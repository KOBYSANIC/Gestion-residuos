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
  runTransaction,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";

// toast
import toast from "react-hot-toast";

// utils
import { checkDuplicateValue } from "../../Utils/firebaseFunc";
// -----------------------------------------Funciones-----------------------------------------

// Funcion para obtener la query global
const getQuery = (categoriasCollection, search, sort = "asc") => {
  return query(categoriasCollection, where("active", "==", true), limit(10));
};

// Funcion para obtener todos los categorias de la base de datos
export const getCategorias = createAsyncThunk(
  "categoria/getCategorias",
  async (
    { isNextPage, isPrevPage, search = "" },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const categorias = [];

      const categoriasCollection = collection(db, "rutas");
      const {
        lastVisible,
        firstVisible,
        categorias: _categorias,
      } = getState().categoria;

      let querySnapshot = null;

      if (!isNextPage && !isPrevPage) {
        const q = getQuery(categoriasCollection, search);
        querySnapshot = await getDocs(q);
      }

      if (_categorias.length === 0 && isPrevPage) {
        const q = getQuery(categoriasCollection, search, "desc");
        querySnapshot = await getDocs(q);
        dispatch(resetPage());
      }

      // Get the last visible document

      if ((isNextPage || isPrevPage) && _categorias.length !== 0) {
        const order_by = !isNextPage ? "desc" : "asc";
        // Construct a new query starting at this document,
        // get the next or prev 10 categorias.
        const next = query(
          categoriasCollection,
          where("active", "==", true),
          orderBy("nombre_categoria", order_by),
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
        categorias.push({ ...doc.data(), id: doc.id });
      });
      return categorias;
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

// funcion para eliminar una categoria
export const eliminarCategoria = createAsyncThunk(
  "categoria/eliminarCategoria",
  async (categoria_id, { dispatch, rejectWithValue }) => {
    try {
      const docRef = doc(db, "rutas", categoria_id);

      const updateTimestamp = updateDoc(docRef, {
        active: false,
        updated_at: new Date(),
      });

      await toast.promise(updateTimestamp, {
        loading: "Eliminando...",
        success: "Ruta eliminada",
        error: "Error al eliminar la ruta",
      });

      dispatch(resetPage());
      dispatch(getCategorias({ isNextPage: false, isPrevPage: false }));

      return docRef;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// funcion para obtener una categoria por id
export const getCategoria = createAsyncThunk(
  "categoria/getCategoria",
  async (categoria_id, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "rutas", categoria_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          id: docSnap.id,
        };
      } else {
        toast.error("No se encontró la ruta");
        return rejectWithValue("No se encontró la ruta");
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// funcion para crear una categoria
export const createCategoria = createAsyncThunk(
  "categoria/createCategoria",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const { onClose, reset, ...data } = params;

      const new_categoria = addDoc(collection(db, "rutas"), {
        ...document_info,
        ...data,
      });

      await toast.promise(new_categoria, {
        loading: "Creando...",
        success: "Ruta creada",
        error: "Error al crear la Ruta",
      });

      dispatch(resetPage());
      dispatch(getCategorias({ isNextPage: false, isPrevPage: false }));

      onClose();
      reset();

      return new_categoria;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

// funcion para actualizar una categoria
export const updateCategoria = createAsyncThunk(
  "categoria/updateCategoria",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const { id, onClose, reset, ...data } = params;

      const docRef = doc(db, "rutas", id);

      // transaction atomic
      const transactionFunc = () =>
        runTransaction(db, async (transaction) => {
          const doc = await transaction.get(docRef);

          if (!doc.exists()) {
            toast.error("La ruta no existe");
            throw "La ruta no existe";
          }

          transaction.update(docRef, {
            ...data,
            updated_at: new Date(),
          });

          // update categoria en productos
          const productos = await getDocs(
            query(
              collection(db, "residuos"),
              where("ruta.id", "==", id),
              where("active", "==", true)
            )
          );

          productos.forEach((doc) => {
            // Obtener el ID del documento
            const docRef = doc.ref;

            // Actualizar el documento con los nuevos datos
            transaction.update(docRef, {
              ruta: { ...data },
            });
          });
        });

      await toast.promise(transactionFunc(), {
        loading: "Actualizando...",
        success: "Ruta actualizada",
        error: "Error al actualizar la Ruta",
      });

      onClose();
      reset();

      dispatch(resetPage());
      dispatch(getCategorias({ isNextPage: false, isPrevPage: false }));

      return id;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
// -----------------------------------------Slice-----------------------------------------
export const categoriaSlice = createSlice({
  name: "categoria",
  initialState: {
    categorias: [],
    categoria_selected: null,
    categoria_data_update: null,
    error: null,
    loading_categoria: false,
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

    // acttions Categoria
    setCategoriaSelected: (state, action) => {
      state.categoria_selected = action.payload;
    },

    // update state isUpdate
    setIsUpdate: (state, action) => {
      state.isUpdate = action.payload;
    },
  },

  extraReducers: {
    // get categorias
    [getCategorias.pending]: (state) => {
      state.loading_categoria = true;
    },
    [getCategorias.fulfilled]: (state, action) => {
      state.loading_categoria = false;
      state.categorias = action.payload;
    },
    [getCategorias.rejected]: (state, action) => {
      state.loading_categoria = false;
      state.error = action.payload;
    },

    // eliminar categoria
    [eliminarCategoria.pending]: (state, action) => {
      state.loading_categoria = true;
    },
    [eliminarCategoria.fulfilled]: (state, action) => {
      state.loading_categoria = false;
    },
    [eliminarCategoria.rejected]: (state, action) => {
      state.loading_categoria = false;
      state.error = action.payload.message;
    },

    // get categoria
    [getCategoria.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [getCategoria.fulfilled]: (state, action) => {
      state.categoria_data_update = action.payload;
      state.loading_actions = false;
    },
    [getCategoria.rejected]: (state, action) => {
      state.loading_actions = false;
      state.error = action.payload.message;
    },

    // create categoria
    [createCategoria.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [createCategoria.fulfilled]: (state, action) => {
      state.loading_actions = false;
    },
    [createCategoria.rejected]: (state, action) => {
      state.loading_actions = false;
      state.error = action.payload.message;
    },

    // update categoria
    [updateCategoria.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [updateCategoria.fulfilled]: (state, action) => {
      state.loading_actions = false;
    },
    [updateCategoria.rejected]: (state, action) => {
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
  setCategoriaSelected,
  setIsUpdate,
} = categoriaSlice.actions;

// -----------------------------------------Selector-----------------------------------------
export const selectCategorias = (state) => state.categoria.categorias;
export const selectLoadingCategorias = (state) =>
  state.categoria.loading_categoria;
export const selectPage = (state) => state.categoria.page;
export const selectCategoriaSelected = (state) =>
  state.categoria.categoria_selected;
export const loadingActions = (state) => state.categoria.loading_actions;
export const selectCategoriaDataUpdate = (state) =>
  state.categoria.categoria_data_update;
export const selectIsUpdate = (state) => state.categoria.isUpdate;

export default categoriaSlice.reducer;
