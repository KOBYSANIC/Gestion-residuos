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

// uuid
import { v4 as uuidv4 } from "uuid";

// -----------------------------------------Funciones-----------------------------------------

// Funcion para obtener la query global
const getQuery = (metodosPagoCollection, search, sort = "asc") => {
  return query(
    metodosPagoCollection,
    where("active", "==", true),
    where("buscar_nombre", ">=", search.toLowerCase()),
    where("buscar_nombre", "<=", search.toLowerCase() + "\uf8ff"),
    orderBy("buscar_nombre", sort),
    limit(10)
  );
};

// Funcion para obtener todos los metods de pago de la base de datos
export const getMetodosPago = createAsyncThunk(
  "metodos_pago/getMetodosPago",
  async (
    { isNextPage, isPrevPage, search = "" },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const metodos_pago = [];

      const metodosPagoCollection = collection(db, "metodos_pago");
      const {
        lastVisible,
        firstVisible,
        metodos_pago: _metodos_pago,
      } = getState().metodosPago;

      let querySnapshot = null;

      if (!isNextPage && !isPrevPage) {
        const q = getQuery(metodosPagoCollection, search);
        querySnapshot = await getDocs(q);
      }

      if (_metodos_pago.length === 0 && isPrevPage) {
        const q = getQuery(metodosPagoCollection, search, "desc");
        querySnapshot = await getDocs(q);
        dispatch(resetPage());
      }

      // Get the last visible document

      if ((isNextPage || isPrevPage) && _metodos_pago.length !== 0) {
        const order_by = !isNextPage ? "desc" : "asc";
        // Construct a new query starting at this document,
        // get the next or prev 10 metodos pago.
        const next = query(
          metodosPagoCollection,
          where("active", "==", true),
          orderBy("nombre_pais", order_by),
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
        metodos_pago.push({ ...doc.data(), id: doc.id });
      });
      return metodos_pago;
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

// funcion para eliminar un metodo de pago
export const eliminarMetodoPago = createAsyncThunk(
  "metodos_pago/eliminarMetodoPago",
  async (metodo_pago_id, { dispatch, rejectWithValue }) => {
    try {
      const docRef = doc(db, "metodos_pago", metodo_pago_id);

      const updateTimestamp = updateDoc(docRef, {
        active: false,
        updated_at: new Date(),
      });

      await toast.promise(updateTimestamp, {
        loading: "Eliminando...",
        success: "Metodo de pago eliminado",
        error: "Error al eliminar el metodo de pago",
      });

      dispatch(resetPage());
      dispatch(getMetodosPago({ isNextPage: false, isPrevPage: false }));

      return docRef;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// funcion para obtener un metodo de pago por id
export const getMetodoPago = createAsyncThunk(
  "metodos_pago/getMetodoPago",
  async (metodo_pago_id, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "metodos_pago", metodo_pago_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          id: docSnap.id,
        };
      } else {
        toast.error("No se encontró el metodo de pago");
        return rejectWithValue("No se encontró el metodo de pago");
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// funcion para crear un metodo de pago
export const createMetodoPago = createAsyncThunk(
  "metodos_pago/createMetodoPago",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const { onClose, reset, ...data } = params;

      const buscar_nombre = data.pais?.label.toLowerCase();

      // add uid to cuenta
      const cuentaWithUid = data.cuenta.map((cuenta) => {
        return { ...cuenta, id: uuidv4() };
      });

      const new_metodo_pago = addDoc(collection(db, "metodos_pago"), {
        ...document_info,
        ...data,
        cuenta: cuentaWithUid,
        buscar_nombre,
      });

      await toast.promise(new_metodo_pago, {
        loading: "Creando...",
        success: "Metodo de pago creado",
        error: "Error al crear el metodo de pago",
      });

      dispatch(resetPage());
      dispatch(getMetodosPago({ isNextPage: false, isPrevPage: false }));

      onClose();
      reset();

      return new_metodo_pago;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

// funcion para actualizar un metodo de pago
export const updateMetodoPago = createAsyncThunk(
  "metodos_pago/updateMetodoPago",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const { id, onClose, reset, ...data } = params;

      // add uid to cuenta
      const cuentaWithUid = data.cuenta.map((cuenta) => {
        return { ...cuenta, id: cuenta.id || uuidv4() };
      });

      const buscar_nombre = data.pais?.label.toLowerCase();

      const metodo_pago = updateDoc(doc(db, "metodos_pago", id), {
        ...data,
        buscar_nombre,
        cuenta: cuentaWithUid,
        updated_at: new Date(),
      });

      await toast.promise(metodo_pago, {
        loading: "Actualizando...",
        success: "Metodo de pago actualizado",
        error: "Error al actualizar el metodo de pago",
      });

      onClose();
      reset();

      dispatch(resetPage());
      dispatch(getMetodosPago({ isNextPage: false, isPrevPage: false }));

      return metodo_pago;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
// -----------------------------------------Slice-----------------------------------------
export const metodoPagoSlice = createSlice({
  name: "metodos_pago",
  initialState: {
    metodos_pago: [],
    metodo_pago_selected: null,
    metodo_pago_data_update: null,
    error: null,
    loading_metodo_pago: false,
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

    // acttions
    setMetodoPagoSelected: (state, action) => {
      state.metodo_pago_selected = action.payload;
    },

    // update state isUpdate
    setIsUpdate: (state, action) => {
      state.isUpdate = action.payload;
    },
  },

  extraReducers: {
    // get
    [getMetodosPago.pending]: (state) => {
      state.loading_metodo_pago = true;
    },
    [getMetodosPago.fulfilled]: (state, action) => {
      state.loading_metodo_pago = false;
      state.metodos_pago = action.payload;
    },
    [getMetodosPago.rejected]: (state, action) => {
      state.loading_metodo_pago = false;
      state.error = action.payload;
    },

    // eliminar
    [eliminarMetodoPago.pending]: (state, action) => {
      state.loading_metodo_pago = true;
    },
    [eliminarMetodoPago.fulfilled]: (state, action) => {
      state.loading_metodo_pago = false;
    },
    [eliminarMetodoPago.rejected]: (state, action) => {
      state.loading_metodo_pago = false;
      state.error = action.payload.message;
    },

    // get
    [getMetodoPago.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [getMetodoPago.fulfilled]: (state, action) => {
      state.metodo_pago_data_update = action.payload;
      state.loading_actions = false;
    },
    [getMetodoPago.rejected]: (state, action) => {
      state.loading_actions = false;
      state.error = action.payload.message;
    },

    // create
    [createMetodoPago.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [createMetodoPago.fulfilled]: (state, action) => {
      state.loading_actions = false;
    },
    [createMetodoPago.rejected]: (state, action) => {
      state.loading_actions = false;
      state.error = action.payload.message;
    },

    // update
    [updateMetodoPago.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [updateMetodoPago.fulfilled]: (state, action) => {
      state.loading_actions = false;
    },
    [updateMetodoPago.rejected]: (state, action) => {
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
  setMetodoPagoSelected,
  setIsUpdate,
} = metodoPagoSlice.actions;

// -----------------------------------------Selector-----------------------------------------
export const selectMetodosPago = (state) => state.metodosPago.metodos_pago;
export const selectLoadingMetodosPago = (state) =>
  state.metodosPago.loading_metodo_pago;
export const selectPage = (state) => state.metodosPago.page;
export const selectMetodoPagoSelected = (state) =>
  state.metodosPago.metodo_pago_selected;
export const loadingActions = (state) => state.metodosPago.loading_actions;
export const selectMetodosPagoDataUpdate = (state) =>
  state.metodosPago.metodo_pago_data_update;
export const selectIsUpdate = (state) => state.metodosPago.isUpdate;

export default metodoPagoSlice.reducer;
