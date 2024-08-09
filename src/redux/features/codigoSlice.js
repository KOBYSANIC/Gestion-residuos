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
const getQuery = (codigosCollection, search, sort = "asc") => {
  return query(
    codigosCollection,
    where("active", "==", true),
    where("buscar_nombre", ">=", search.toLowerCase()),
    where("buscar_nombre", "<=", search.toLowerCase() + "\uf8ff"),
    orderBy("buscar_nombre", sort),
    limit(10)
  );
};

// Funcion para obtener todos los codigos de la base de datos
export const getCodigos = createAsyncThunk(
  "codigo/getCodigos",
  async (
    { isNextPage, isPrevPage, search = "" },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const codigos = [];

      const codigosCollection = collection(db, "codigos");
      const {
        lastVisible,
        firstVisible,
        codigos: _codigos,
      } = getState().codigo;

      let querySnapshot = null;

      if (!isNextPage && !isPrevPage) {
        const q = getQuery(codigosCollection, search);
        querySnapshot = await getDocs(q);
      }

      if (_codigos.length === 0 && isPrevPage) {
        const q = getQuery(codigosCollection, search, "desc");
        querySnapshot = await getDocs(q);
        dispatch(resetPage());
      }

      // Get the last visible document

      if ((isNextPage || isPrevPage) && _codigos.length !== 0) {
        const order_by = !isNextPage ? "desc" : "asc";
        // Construct a new query starting at this document,
        // get the next or prev 10 codigos.
        const next = query(
          codigosCollection,
          where("active", "==", true),
          orderBy("nombre_codigo", order_by),
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
        codigos.push({ ...doc.data(), id: doc.id });
      });
      return codigos;
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

// funcion para eliminar un codigo
export const eliminarCodigo = createAsyncThunk(
  "codigo/eliminarCodigo",
  async (codigo_id, { dispatch, rejectWithValue }) => {
    try {
      const docRef = doc(db, "codigos", codigo_id);

      const updateTimestamp = updateDoc(docRef, {
        active: false,
        updated_at: new Date(),
      });

      await toast.promise(updateTimestamp, {
        loading: "Eliminando...",
        success: "Codigo eliminado",
        error: "Error al eliminar el codigo",
      });

      dispatch(resetPage());
      dispatch(getCodigos({ isNextPage: false, isPrevPage: false }));

      return docRef;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// funcion para obtener un codigo por id
export const getCodigo = createAsyncThunk(
  "codigo/getCodigo",
  async (codigo_id, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "codigos", codigo_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          id: docSnap.id,
        };
      } else {
        toast.error("No se encontró el codigo");
        return rejectWithValue("No se encontró el codigo");
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// funcion para crear un codigo
export const createCodigo = createAsyncThunk(
  "codigo/createCodigo",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const { onClose, reset, ...data } = params;

      const buscar_nombre = data.nombre_listado.toLowerCase();

      const new_codigo = addDoc(collection(db, "codigos"), {
        ...document_info,
        ...data,
        buscar_nombre,
      });

      await toast.promise(new_codigo, {
        loading: "Creando...",
        success: "Código creado",
        error: "Error al crear el código",
      });

      dispatch(resetPage());
      dispatch(getCodigos({ isNextPage: false, isPrevPage: false }));

      onClose();
      reset();

      return new_codigo;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

// funcion para actualizar un codigo
export const updateCodigo = createAsyncThunk(
  "codigo/updateCodigo",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const { id, onClose, reset, ...data } = params;

      const buscar_nombre = data.nombre_listado.toLowerCase();

      const codigo = updateDoc(doc(db, "codigos", id), {
        ...data,
        buscar_nombre,
        updated_at: new Date(),
      });

      await toast.promise(codigo, {
        loading: "Actualizando...",
        success: "Código actualizado",
        error: "Error al actualizar el Código",
      });

      onClose();
      reset();

      dispatch(resetPage());
      dispatch(getCodigos({ isNextPage: false, isPrevPage: false }));

      return codigo;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
// -----------------------------------------Slice-----------------------------------------
export const codigoSlice = createSlice({
  name: "codigo",
  initialState: {
    codigos: [],
    codigo_selected: null,
    codigo_data_update: null,
    error: null,
    loading_codigo: false,
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

    // acttions Codigo
    setCodigoSelected: (state, action) => {
      state.codigo_selected = action.payload;
    },

    // update state isUpdate
    setIsUpdate: (state, action) => {
      state.isUpdate = action.payload;
    },
  },

  extraReducers: {
    // get codigos
    [getCodigos.pending]: (state) => {
      state.loading_codigo = true;
    },
    [getCodigos.fulfilled]: (state, action) => {
      state.loading_codigo = false;
      state.codigos = action.payload;
    },
    [getCodigos.rejected]: (state, action) => {
      state.loading_codigo = false;
      state.error = action.payload;
    },

    // eliminar codigo
    [eliminarCodigo.pending]: (state, action) => {
      state.loading_codigo = true;
    },
    [eliminarCodigo.fulfilled]: (state, action) => {
      state.loading_codigo = false;
    },
    [eliminarCodigo.rejected]: (state, action) => {
      state.loading_codigo = false;
      state.error = action.payload.message;
    },

    // get codigo
    [getCodigo.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [getCodigo.fulfilled]: (state, action) => {
      state.codigo_data_update = action.payload;
      state.loading_actions = false;
    },
    [getCodigo.rejected]: (state, action) => {
      state.loading_actions = false;
      state.error = action.payload.message;
    },

    // create producto
    [createCodigo.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [createCodigo.fulfilled]: (state, action) => {
      state.loading_actions = false;
    },
    [createCodigo.rejected]: (state, action) => {
      state.loading_actions = false;
      state.error = action.payload.message;
    },

    // update codigo
    [updateCodigo.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [updateCodigo.fulfilled]: (state, action) => {
      state.loading_actions = false;
    },
    [updateCodigo.rejected]: (state, action) => {
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
  setCodigoSelected,
  setIsUpdate,
} = codigoSlice.actions;

// -----------------------------------------Selector-----------------------------------------
export const selectCodigos = (state) => state.codigo.codigos;
export const selectLoadingCodigos = (state) => state.codigo.loading_codigo;
export const selectPage = (state) => state.codigo.page;
export const selectCodigoSelected = (state) => state.codigo.codigo_selected;
export const loadingActions = (state) => state.codigo.loading_actions;
export const selectCodigoDataUpdate = (state) =>
  state.codigo.codigo_data_update;
export const selectIsUpdate = (state) => state.codigo.isUpdate;

export default codigoSlice.reducer;
