// redux
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// config
import { db } from "../../firebase/config";

// constants
import { document_info } from "../../Utils/constants";

// firebase
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";

// toast
import toast from "react-hot-toast";

// -----------------------------------------Funciones-----------------------------------------

// Funcion para obtener la query global
const getQuery = (monedasCollection, search, sort = "asc") => {
  return query(
    monedasCollection,
    where("active", "==", true),
    where("buscar_nombre", ">=", search.toLowerCase()),
    where("buscar_nombre", "<=", search.toLowerCase() + "\uf8ff"),
    orderBy("buscar_nombre", sort),
    limit(10)
  );
};

// Funcion para obtener todos los monedas de la base de datos
export const getMonedas = createAsyncThunk(
  "moneda/getMonedas",
  async (
    { isNextPage, isPrevPage, search = "" },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const monedas = [];

      const monedasCollection = collection(db, "monedas");
      const {
        lastVisible,
        firstVisible,
        monedas: _monedas,
      } = getState().moneda;

      let querySnapshot = null;

      if (!isNextPage && !isPrevPage) {
        const q = getQuery(monedasCollection, search);
        querySnapshot = await getDocs(q);
      }

      if (_monedas.length === 0 && isPrevPage) {
        const q = getQuery(monedasCollection, search, "desc");
        querySnapshot = await getDocs(q);
        dispatch(resetPage());
      }

      // Get the last visible document

      if ((isNextPage || isPrevPage) && _monedas.length !== 0) {
        const order_by = !isNextPage ? "desc" : "asc";
        // Construct a new query starting at this document,
        // get the next or prev 10 monedas.
        const next = query(
          monedasCollection,
          where("active", "==", true),
          orderBy("nombre_moneda", order_by),
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
        monedas.push({ ...doc.data(), id: doc.id });
      });
      return monedas;
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

// funcion para eliminar un moneda
export const eliminarMoneda = createAsyncThunk(
  "moneda/eliminarMoneda",
  async (moneda_id, { dispatch, rejectWithValue }) => {
    try {
      const docRef = doc(db, "monedas", moneda_id);

      const updateTimestamp = updateDoc(docRef, {
        active: false,
        updated_at: new Date(),
      });

      await toast.promise(updateTimestamp, {
        loading: "Eliminando...",
        success: "Moneda eliminada",
        error: "Error al eliminar la moneda",
      });

      dispatch(resetPage());
      dispatch(getMonedas({ isNextPage: false, isPrevPage: false }));

      return docRef;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// funcion para obtener una moneda por id
export const getMoneda = createAsyncThunk(
  "moneda/getMoneda",
  async (moneda_id, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "monedas", moneda_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          id: docSnap.id,
        };
      } else {
        toast.error("No se encontró la moneda");
        return rejectWithValue("No se encontró la moneda");
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const datosDolar = {
  nombre_moneda: "Dolar Estadounidense",
  siglas_moneda: "USD",
  dolar: "1.000",
};

// funcion para crear una moneda
export const createMoneda = createAsyncThunk(
  "moneda/createMoneda",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const { onClose, reset, ...data } = params;

      const buscar_nombre = data.nombre_moneda_conversion.toLowerCase();

      const new_moneda = addDoc(collection(db, "monedas"), {
        ...document_info,
        ...datosDolar,
        ...data,
        buscar_nombre,
      });

      await toast.promise(new_moneda, {
        loading: "Creando...",
        success: "Moneda creada",
        error: "Error al crear la Moneda",
      });

      dispatch(resetPage());
      dispatch(getMonedas({ isNextPage: false, isPrevPage: false }));

      onClose();
      reset();

      return new_moneda;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

// funcion para actualizar una moneda
export const updateMoneda = createAsyncThunk(
  "moneda/updateMoneda",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const { id, onClose, reset, ...data } = params;

      const buscar_nombre = data.nombre_moneda_conversion.toLowerCase();

      const moneda = updateDoc(doc(db, "monedas", id), {
        ...data,
        ...datosDolar,
        buscar_nombre,
        updated_at: new Date(),
      });

      await toast.promise(moneda, {
        loading: "Actualizando...",
        success: "Moneda actualizada",
        error: "Error al actualizar la Moneda",
      });

      onClose();
      reset();

      dispatch(resetPage());
      dispatch(getMonedas({ isNextPage: false, isPrevPage: false }));

      return moneda;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
// -----------------------------------------Slice-----------------------------------------
export const monedaSlice = createSlice({
  name: "moneda",
  initialState: {
    monedas: [],
    moneda_selected: null,
    moneda_data_update: null,
    error: null,
    loading_moneda: false,
    loading_actions: false,
    isUpdate: false,
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

    // acttions moneda
    setMonedaSelected: (state, action) => {
      state.moneda_selected = action.payload;
    },

    // update state isUpdate
    setIsUpdate: (state, action) => {
      state.isUpdate = action.payload;
    },
  },

  extraReducers: {
    // get monedas
    [getMonedas.pending]: (state) => {
      state.loading_moneda = true;
    },
    [getMonedas.fulfilled]: (state, action) => {
      state.loading_moneda = false;
      state.monedas = action.payload;
    },
    [getMonedas.rejected]: (state, action) => {
      state.loading_moneda = false;
      state.error = action.payload;
    },

    // eliminar moneda
    [eliminarMoneda.pending]: (state, action) => {
      state.loading_moneda = true;
    },
    [eliminarMoneda.fulfilled]: (state, action) => {
      state.loading_moneda = false;
    },
    [eliminarMoneda.rejected]: (state, action) => {
      state.loading_moneda = false;
      state.error = action.payload.message;
    },

    // get moneda
    [getMoneda.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [getMoneda.fulfilled]: (state, action) => {
      state.moneda_data_update = action.payload;
      state.loading_actions = false;
    },
    [getMoneda.rejected]: (state, action) => {
      state.loading_actions = false;
      state.error = action.payload.message;
    },

    // create banco
    [createMoneda.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [createMoneda.fulfilled]: (state, action) => {
      state.loading_actions = false;
    },
    [createMoneda.rejected]: (state, action) => {
      state.loading_actions = false;
      state.error = action.payload.message;
    },

    // update moneda
    [updateMoneda.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [updateMoneda.fulfilled]: (state, action) => {
      state.loading_actions = false;
    },
    [updateMoneda.rejected]: (state, action) => {
      state.loading_actions = false;
      state.error = action.payload.message;
    },
  },
});

export const {
  nextPage,
  prevPage,
  resetPage,
  setFirstVisible,
  setLastVisible,
  setMonedaSelected,
  setIsUpdate,
} = monedaSlice.actions;

// -----------------------------------------Selector-----------------------------------------
export const selectMonedas = (state) => state.moneda.monedas;
export const selectLoadingMonedas = (state) => state.moneda.loading_moneda;
export const selectPage = (state) => state.moneda.page;
export const selectMonedaSelected = (state) => state.moneda.moneda_selected;
export const loadingActions = (state) => state.moneda.loading_actions;
export const selectMonedaDataUpdate = (state) =>
  state.moneda.moneda_data_update;
export const selectIsUpdate = (state) => state.moneda.isUpdate;

export default monedaSlice.reducer;
