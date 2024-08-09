// redux
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// config
import { db } from "../../firebase/config";

// firebase
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  where,
} from "firebase/firestore";

// toast
import toast from "react-hot-toast";

// -----------------------------------------Funciones-----------------------------------------

// Funcion para obtener la query global
const getQuery = (tokensCollection, search, sort = "asc") => {
  return query(
    tokensCollection,
    where("active", "==", true),
    search
      ? where("nombre_token", "==", search)
      : orderBy("nombre_token", sort),
    limit(10)
  );
};

// Funcion para obtener todos los tokens de la base de datos
export const getTokens = createAsyncThunk(
  "token/getTokens",
  async (
    { isNextPage, isPrevPage, search = "" },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const tokens = [];

      const tokensCollection = collection(db, "tokens");
      const {
        lastVisible,
        firstVisible,
        tokens: _tokens,
      } = getState().token;

      let querySnapshot = null;

      if (!isNextPage && !isPrevPage) {
        const q = getQuery(tokensCollection, search);
        querySnapshot = await getDocs(q);
      }

      if (_tokens.length === 0 && isPrevPage) {
        const q = getQuery(tokensCollection, search, "desc");
        querySnapshot = await getDocs(q);
        dispatch(resetPage());
      }

      // Get the last visible document

      if ((isNextPage || isPrevPage) && _tokens.length !== 0) {
        const order_by = !isNextPage ? "desc" : "asc";
        // Construct a new query starting at this document,
        // get the next or prev 10 tokens.
        const next = query(
          tokensCollection,
          where("active", "==", true),
          orderBy("nombre_token", order_by),
          startAfter(isNextPage ? lastVisible : firstVisible),
          limit(10)
        );

        querySnapshot = await getDocs(next);
      }

      if (querySnapshot.docs.length > 0) {
        let lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];
        let firstDoc = querySnapshot.docs[0];

        if (isNextPage || isPrevPage) {
          lastDoc =
            querySnapshot.docs[isNextPage ? querySnapshot.docs.length - 1 : 0];
          firstDoc =
            querySnapshot.docs[isNextPage ? 0 : querySnapshot.docs.length - 1];
        }

        dispatch(setLastVisible(lastDoc));
        dispatch(setFirstVisible(firstDoc));
      }

      if (isPrevPage) querySnapshot = querySnapshot.docs.reverse();

      querySnapshot.forEach((doc) => {
        tokens.push({ ...doc.data(), id: doc.id });
      });
      return tokens;
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

// -----------------------------------------Slice-----------------------------------------
export const tokenSlice = createSlice({
  name: "token",
  initialState: {
    tokens: [],
    error: null,
    loading_token: false,
    firstVisible: null,
    lastVisible: null,
    page: 1,
  },
  reducers: {
    nextPage: (state) => {
      state.page += 1;
    },
    prevPage: (state) => {
      state.page -= 1;
    },

    resetPage: (state) => {
      state.page = 1;
    },

    setFirstVisible: (state, action) => {
      state.firstVisible = action.payload;
    },
    setLastVisible: (state, action) => {
      state.lastVisible = action.payload;
    },
  },

  extraReducers: {
    [getTokens.pending]: (state) => {
      state.loading_token = true;
    },
    [getTokens.fulfilled]: (state, action) => {
      state.loading_token = false;
      state.tokens = action.payload;
    },
    [getTokens.rejected]: (state, action) => {
      state.loading_token = false;
      state.error = action.payload;
    },
  },
});

export const {
  nextPage,
  prevPage,
  resetPage,
  setFirstVisible,
  setLastVisible,
} = tokenSlice.actions;

// -----------------------------------------Selector-----------------------------------------
export const selectTokens = (state) => state.token.tokens;
export const selectLoadingTokens = (state) =>
  state.token.loading_token;
export const selectPage = (state) => state.token.page;

export default tokenSlice.reducer;
