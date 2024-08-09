// redux
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// config
import { db, uploadFiles } from "../../firebase/config";

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
import { validateImage } from "../../Utils/firebaseFunc";
// -----------------------------------------Funciones-----------------------------------------

// Funcion para obtener la query global
const getQuery = (carruselsCollection, search, sort = "asc") => {
  return query(
    carruselsCollection,
    where("active", "==", true),
    search
      ? where("nombre_carrusel", "==", search)
      : orderBy("nombre_carrusel", sort),
    limit(10)
  );
};

// Funcion para obtener todos los carrusels de la base de datos
export const getCarrusels = createAsyncThunk(
  "carrusel/getCarrusels",
  async (
    { isNextPage, isPrevPage, search = "" },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const carrusels = [];

      const carruselsCollection = collection(db, "carrusels");
      const {
        lastVisible,
        firstVisible,
        carrusels: _carrusels,
      } = getState().carrusel;

      let querySnapshot = null;

      if (!isNextPage && !isPrevPage) {
        const q = getQuery(carruselsCollection, search);
        querySnapshot = await getDocs(q);
      }

      if (_carrusels.length === 0 && isPrevPage) {
        const q = getQuery(carruselsCollection, search, "desc");
        querySnapshot = await getDocs(q);
        dispatch(resetPage());
      }

      // Get the last visible document

      if ((isNextPage || isPrevPage) && _carrusels.length !== 0) {
        const order_by = !isNextPage ? "desc" : "asc";
        // Construct a new query starting at this document,
        // get the next or prev 10 carrusels.
        const next = query(
          carruselsCollection,
          where("active", "==", true),
          orderBy("nombre_carrusel", order_by),
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
        carrusels.push({ ...doc.data(), id: doc.id });
      });
      return carrusels;
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);
// funcion para eliminar un carrusel
export const eliminarCarrusel = createAsyncThunk(
  "carrusel/eliminarCarrusel",
  async (carrusel_id, { dispatch, rejectWithValue }) => {
    try {
      const docRef = doc(db, "carrusels", carrusel_id);

      const updateTimestamp = updateDoc(docRef, {
        active: false,
        updated_at: new Date(),
      });

      await toast.promise(updateTimestamp, {
        loading: "Eliminando...",
        success: "Imagen eliminada",
        error: "Error al eliminar la imagen",
      });

      dispatch(resetPage());
      dispatch(getCarrusels({ isNextPage: false, isPrevPage: false }));

      return docRef;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// funcion para obtener un carrusel por id
export const getCarrusel = createAsyncThunk(
  "carrusel/getCarrusel",
  async (carrusel_id, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "carrusels", carrusel_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          id: docSnap.id,
        };
      } else {
        toast.error("No se encontró la imagen");
        return rejectWithValue("No se encontró la imagen");
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// funcion para crear un carrusel
export const createCarrusel = createAsyncThunk(
  "carrusel/createCarrusel",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const { onClose, reset, ...data } = params;
      const { imagen_carrusel } = data;

      const images_url = await uploadFiles(imagen_carrusel, "carrusels");

      const new_carrusel = addDoc(collection(db, "carrusels"), {
        ...document_info,
        ...data,
        imagen_carrusel: images_url,
      });

      await toast.promise(new_carrusel, {
        loading: "Creando...",
        success: "Imagen creada",
        error: "Error al crear la Imagen",
      });

      dispatch(resetPage());
      dispatch(getCarrusels({ isNextPage: false, isPrevPage: false }));

      onClose();
      reset();

      return new_carrusel;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

// funcion para actualizar un carrusel
export const updateCarrusel = createAsyncThunk(
  "carrusel/updateCarrusel",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const { id, onClose, reset, ...data } = params;
      const {imagen_carrusel} = data;

      const images_url = await validateImage(
        id,
        imagen_carrusel,
        "imagen_carrusel",
        "carrusels"
      )
      const carrusel = updateDoc(doc(db, "carrusels", id), {
        ...data,
        updated_at: new Date(),
        imagen_carrusel: images_url,
      });

      await toast.promise(carrusel, {
        loading: "Actualizando...",
        success: "Imagen actualizada",
        error: "Error al actualizar la Imagen",
      });

      onClose();
      reset();

      dispatch(resetPage());
      dispatch(getCarrusels({ isNextPage: false, isPrevPage: false }));

      return carrusel;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err);
    }
  }
);
// -----------------------------------------Slice-----------------------------------------
export const carruselSlice = createSlice({
  name: "carrusel",
  initialState: {
    carrusels: [],
    carrusel_selected: null,
    carrusel_data_update: null,
    error: null,
    loading_carrusel: false,
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

    // actions Carrusel
    setCarruselSelected: (state, action) => {
      state.carrusel_selected = action.payload;
    },

    // update state isUpdate
    setIsUpdate: (state, action) => {
      state.isUpdate = action.payload;
    },
  },

  extraReducers: {
    //get carrusels
    [getCarrusels.pending]: (state) => {
      state.loading_carrusel = true;
    },
    [getCarrusels.fulfilled]: (state, action) => {
      state.loading_carrusel = false;
      state.carrusels = action.payload;
    },
    [getCarrusels.rejected]: (state, action) => {
      state.loading_carrusel = false;
      state.error = action.payload;
    },

    // eliminar carrusel
    [eliminarCarrusel.pending]: (state, action) => {
      state.loading_carrusel = true;
    },
    [eliminarCarrusel.fulfilled]: (state, action) => {
      state.loading_carrusel = false;
    },
    [eliminarCarrusel.rejected]: (state, action) => {
      state.loading_carrusel = false;
      state.error = action.payload.message;
    },

    // get carrusel
    [getCarrusel.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [getCarrusel.fulfilled]: (state, action) => {
      state.carrusel_data_update = action.payload;
      state.loading_actions = false;
    },
    [getCarrusel.rejected]: (state, action) => {
      state.loading_actions = false;
      state.error = action.payload.message;
    },

    // create carrusel
    [createCarrusel.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [createCarrusel.fulfilled]: (state, action) => {
      state.loading_actions = false;
    },
    [createCarrusel.rejected]: (state, action) => {
      state.loading_actions = false;
      state.error = action.payload.message;
    },

    // update carrusel
    [updateCarrusel.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [updateCarrusel.fulfilled]: (state, action) => {
      state.loading_actions = false;
    },
    [updateCarrusel.rejected]: (state, action) => {
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
  setCarruselSelected,
  setIsUpdate,
} = carruselSlice.actions;

// -----------------------------------------Selector-----------------------------------------
export const selectCarrusels = (state) => state.carrusel.carrusels;
export const selectLoadingCarrusels = (state) =>
  state.carrusel.loading_carrusel;
export const selectPage = (state) => state.carrusel.page;
export const selectCarruselSelected = (state) =>
  state.carrusel.carrusel_selected;
export const loadingActions = (state) => state.carrusel.loading_actions;
export const selectCarruselDataUpdate = (state) =>
  state.carrusel.carrusel_data_update;
export const selectIsUpdate = (state) => state.carrusel.isUpdate;

export default carruselSlice.reducer;
