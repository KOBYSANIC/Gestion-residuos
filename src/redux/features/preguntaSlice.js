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
const getQuery = (preguntasCollection, search, sort = "asc") => {
  return query(
    preguntasCollection,
    where("active", "==", true),
    where("buscar_nombre", ">=", search.toLowerCase()),
    where("buscar_nombre", "<=", search.toLowerCase() + "\uf8ff"),
    orderBy("buscar_nombre", sort),
    limit(10)
  );
};

// Funcion para obtener todos los preguntas de la base de datos
export const getPreguntas = createAsyncThunk(
  "pregunta/getPreguntas",
  async (
    { isNextPage, isPrevPage, search = "" },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const preguntas = [];

      const preguntasCollection = collection(db, "preguntas");
      const {
        lastVisible,
        firstVisible,
        preguntas: _preguntas,
      } = getState().pregunta;

      let querySnapshot = null;

      if (!isNextPage && !isPrevPage) {
        const q = getQuery(preguntasCollection, search);
        querySnapshot = await getDocs(q);
      }

      if (_preguntas.length === 0 && isPrevPage) {
        const q = getQuery(preguntasCollection, search, "desc");
        querySnapshot = await getDocs(q);
        dispatch(resetPage());
      }

      // Get the last visible document

      if ((isNextPage || isPrevPage) && _preguntas.length !== 0) {
        const order_by = !isNextPage ? "desc" : "asc";
        // Construct a new query starting at this document,
        // get the next or prev 10 preguntas.
        const next = query(
          preguntasCollection,
          where("active", "==", true),
          orderBy("nombre_pregunta", order_by),
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
        preguntas.push({ ...doc.data(), id: doc.id });
      });
      return preguntas;
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

// funcion para eliminar una pregunta
export const eliminarPregunta = createAsyncThunk(
  "pregunta/eliminarPregunta",
  async (pregunta_id, { dispatch, rejectWithValue }) => {
    try {
      const docRef = doc(db, "preguntas", pregunta_id);

      const updateTimestamp = updateDoc(docRef, {
        active: false,
        updated_at: new Date(),
      });

      await toast.promise(updateTimestamp, {
        loading: "Eliminando...",
        success: "Pregunta eliminado",
        error: "Error al eliminar el pregunta",
      });

      dispatch(resetPage());
      dispatch(getPreguntas({ isNextPage: false, isPrevPage: false }));

      return docRef;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// funcion para obtener un pregunta por id
export const getPregunta = createAsyncThunk(
  "pregunta/getPregunta",
  async (pregunta_id, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "preguntas", pregunta_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          id: docSnap.id,
        };
      } else {
        toast.error("No se encontró la pregunta");
        return rejectWithValue("No se encontró la pregunta");
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// funcion para crear una pregunta
export const createPregunta = createAsyncThunk(
  "pregunta/createPregunta",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const { onClose, reset, ...data } = params;

      const buscar_nombre = data.nombre_pregunta.toLowerCase();

      const new_pregunta = addDoc(collection(db, "preguntas"), {
        ...document_info,
        ...data,
        buscar_nombre,
      });

      await toast.promise(new_pregunta, {
        loading: "Creando...",
        success: "Pregunta creada",
        error: "Error al crear la Pregunta",
      });

      dispatch(resetPage());
      dispatch(getPreguntas({ isNextPage: false, isPrevPage: false }));

      onClose();
      reset();

      return new_pregunta;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

// funcion para actualizar una pregunta
export const updatePregunta = createAsyncThunk(
  "pregunta/updatePregunta",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const { id, onClose, reset, ...data } = params;

      const buscar_nombre = data.nombre_pregunta.toLowerCase();

      const pregunta = updateDoc(doc(db, "preguntas", id), {
        ...data,
        buscar_nombre,
        updated_at: new Date(),
      });

      await toast.promise(pregunta, {
        loading: "Actualizando...",
        success: "Pregunta actualizada",
        error: "Error al actualizar la Pregunta",
      });

      onClose();
      reset();

      dispatch(resetPage());
      dispatch(getPreguntas({ isNextPage: false, isPrevPage: false }));

      return pregunta;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
// -----------------------------------------Slice-----------------------------------------
export const preguntaSlice = createSlice({
  name: "pregunta",
  initialState: {
    preguntas: [],
    pregunta_selected: null,
    pregunta_data_update: null,
    error: null,
    loading_pregunta: false,
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

    // acttions Pregunta
    setPreguntaSelected: (state, action) => {
      state.pregunta_selected = action.payload;
    },

    // update state isUpdate
    setIsUpdate: (state, action) => {
      state.isUpdate = action.payload;
    },
  },

  extraReducers: {
    [getPreguntas.pending]: (state) => {
      state.loading_pregunta = true;
    },
    [getPreguntas.fulfilled]: (state, action) => {
      state.loading_pregunta = false;
      state.preguntas = action.payload;
    },
    [getPreguntas.rejected]: (state, action) => {
      state.loading_pregunta = false;
      state.error = action.payload;
    },

    // eliminar pregunta
    [eliminarPregunta.pending]: (state, action) => {
      state.loading_pregunta = true;
    },
    [eliminarPregunta.fulfilled]: (state, action) => {
      state.loading_pregunta = false;
    },
    [eliminarPregunta.rejected]: (state, action) => {
      state.loading_pregunta = false;
      state.error = action.payload.message;
    },

    // get pregunta
    [getPregunta.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [getPregunta.fulfilled]: (state, action) => {
      state.pregunta_data_update = action.payload;
      state.loading_actions = false;
    },
    [getPregunta.rejected]: (state, action) => {
      state.loading_actions = false;
      state.error = action.payload.message;
    },

    // create pregunta
    [createPregunta.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [createPregunta.fulfilled]: (state, action) => {
      state.loading_actions = false;
    },
    [createPregunta.rejected]: (state, action) => {
      state.loading_actions = false;
      state.error = action.payload.message;
    },

    // update pregunta
    [updatePregunta.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [updatePregunta.fulfilled]: (state, action) => {
      state.loading_actions = false;
    },
    [updatePregunta.rejected]: (state, action) => {
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
  setPreguntaSelected,
  setIsUpdate,
} = preguntaSlice.actions;

// -----------------------------------------Selector-----------------------------------------
export const selectPreguntas = (state) => state.pregunta.preguntas;
export const selectLoadingPreguntas = (state) =>
  state.pregunta.loading_pregunta;
export const selectPage = (state) => state.pregunta.page;
export const selectPreguntaSelected = (state) =>
  state.pregunta.pregunta_selected;
export const loadingActions = (state) => state.pregunta.loading_actions;
export const selectPreguntaDataUpdate = (state) =>
  state.pregunta.pregunta_data_update;
export const selectIsUpdate = (state) => state.pregunta.isUpdate;

export default preguntaSlice.reducer;
