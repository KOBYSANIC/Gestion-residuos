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
const getQuery = (solicitudesCollection, search, sort = "asc") => {
  return query(
    solicitudesCollection,
    where("active", "==", true),
    where("solicitudor_de_vendedor", "==", true),
    where("buscar_correo", ">=", search.toLowerCase()),
    where("buscar_correo", "<=", search.toLowerCase() + "\uf8ff"),
    orderBy("buscar_correo", sort),
    limit(10)
  );
};

// Funcion para obtener todos los solicitudes de la base de datos
export const getSolicitudes = createAsyncThunk(
  "solicitud/getSolicitudes",
  async (
    { isNextPage, isPrevPage, search = "" },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const solicitudes = [];

      const solicitudesCollection = collection(db, "users");
      const {
        lastVisible,
        firstVisible,
        solicitudes: _solicitudes,
      } = getState().solicitud;

      let querySnapshot = null;

      if (!isNextPage && !isPrevPage) {
        const q = getQuery(solicitudesCollection, search);
        querySnapshot = await getDocs(q);
      }

      if (_solicitudes.length === 0 && isPrevPage) {
        const q = getQuery(solicitudesCollection, search, "desc");
        querySnapshot = await getDocs(q);
        dispatch(resetPage());
      }

      // Get the last visible document

      if ((isNextPage || isPrevPage) && _solicitudes.length !== 0) {
        const order_by = !isNextPage ? "desc" : "asc";
        // Construct a new query starting at this document,
        // get the next or prev 10 solicitudes.
        const next = query(
          solicitudesCollection,
          where("active", "==", true),
          orderBy("nombre_solicitud", order_by),
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
        solicitudes.push({ ...doc.data(), id: doc.id });
      });
      return solicitudes;
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

// -----------------------------------------Slice-----------------------------------------
export const solicitudeSlice = createSlice({
  name: "solicitud",
  initialState: {
    solicitudes: [],
    error: null,
    loading_solicitud: false,
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
    [getSolicitudes.pending]: (state) => {
      state.loading_solicitud = true;
    },
    [getSolicitudes.fulfilled]: (state, action) => {
      state.loading_solicitud = false;
      state.solicitudes = action.payload;
    },
    [getSolicitudes.rejected]: (state, action) => {
      state.loading_solicitud = false;
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
} = solicitudeSlice.actions;

// -----------------------------------------Selector-----------------------------------------
export const selectSolicitudes = (state) => state.solicitud.solicitudes;
export const selectLoadingsolicitudes = (state) =>
  state.solicitud.loading_solicitud;
export const selectPage = (state) => state.solicitud.page;

export default solicitudeSlice.reducer;
