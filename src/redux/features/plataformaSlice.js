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
const getQuery = (plataformasCollection, search, sort = "asc") => {
  return query(
    plataformasCollection,
    where("active", "==", true),
    where("buscar_nombre", ">=", search.toLowerCase()),
    where("buscar_nombre", "<=", search.toLowerCase() + "\uf8ff"),
    orderBy("buscar_nombre", sort),
    limit(10)
  );
};

// Funcion para obtener todos los plataformas de la base de datos
export const getPlataformas = createAsyncThunk(
  "plataforma/getPlataformas",
  async (
    { isNextPage, isPrevPage, search = "" },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const plataformas = [];

      const plataformasCollection = collection(db, "plataformas");
      const {
        lastVisible,
        firstVisible,
        plataformas: _plataformas,
      } = getState().plataforma;

      let querySnapshot = null;

      if (!isNextPage && !isPrevPage) {
        const q = getQuery(plataformasCollection, search);
        querySnapshot = await getDocs(q);
      }

      if (_plataformas.length === 0 && isPrevPage) {
        const q = getQuery(plataformasCollection, search, "desc");
        querySnapshot = await getDocs(q);
        dispatch(resetPage());
      }

      // Get the last visible document

      if ((isNextPage || isPrevPage) && _plataformas.length !== 0) {
        const order_by = !isNextPage ? "desc" : "asc";
        // Construct a new query starting at this document,
        // get the next or prev 10 plataformas.
        const next = query(
          plataformasCollection,
          where("active", "==", true),
          orderBy("nombre_plataforma", order_by),
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
        plataformas.push({ ...doc.data(), id: doc.id });
      });
      return plataformas;
    } catch (err) {
      console.log(err);
      toast.error(err.mesage);
      return rejectWithValue(err);
    }
  }
);

// funcion para eliminar una plataforma
export const eliminarPlataforma = createAsyncThunk(
  "plataforma/eliminarPlataforma",
  async (plataforma_id, { dispatch, rejectWithValue }) => {
    try {
      const docRef = doc(db, "plataformas", plataforma_id);

      // validar si la plataforma tiene productos asociados
      const productos = await getDocs(
        query(
          collection(db, "productos"),
          where("plataforma.id", "==", plataforma_id),
          where("active", "==", true)
        )
      );

      if (productos.docs.length > 0) {
        toast.error(
          "No se puede eliminar la plataforma, tiene productos asociados"
        );
        return rejectWithValue(
          "No se puede eliminar la plataforma, tiene productos asociados"
        );
      }

      // validar si la plataforma tiene productos asociados
      const codigos = await getDocs(
        query(
          collection(db, "codigos"),
          where("plataforma.id", "==", plataforma_id),
          where("active", "==", true)
        )
      );

      if (codigos.docs.length > 0) {
        toast.error(
          "No se puede eliminar la plataforma, tiene códigos asociados"
        );
        return rejectWithValue(
          "No se puede eliminar la plataforma, tiene códigos asociados"
        );
      }

      const updateTimestamp = updateDoc(docRef, {
        active: false,
        updated_at: new Date(),
      });

      await toast.promise(updateTimestamp, {
        loading: "Eliminando...",
        success: "Plataforma eliminada",
        error: "Error al eliminar la plataforma",
      });

      dispatch(resetPage());
      dispatch(getPlataformas({ isNextPage: false, isPrevPage: false }));

      return docRef;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// funcion para obtener una plataforma por id
export const getPlataforma = createAsyncThunk(
  "plataforma/getPlataforma",
  async (plataforma_id, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "plataformas", plataforma_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          id: docSnap.id,
        };
      } else {
        toast.error("No se encontró la plataforma");
        return rejectWithValue("No se encontró la plataforma");
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// funcion para crear una plataforma
export const createPlataforma = createAsyncThunk(
  "plataforma/createPlataforma",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const { onClose, reset, ...data } = params;

      const { nombre_plataforma } = data;

      // slug
      const slug = nombre_plataforma.toLowerCase().replace(/ /g, "_");
      const buscar_nombre = nombre_plataforma.toLowerCase();

      const isDuplicate = await checkDuplicateValue(
        "plataformas",
        "nombre_plataforma",
        nombre_plataforma
      );

      if (isDuplicate) {
        toast.error("Nombre de la plataforma duplicada");
        return rejectWithValue("Plataforma duplicada");
      }

      const nueva_plataforma = addDoc(collection(db, "plataformas"), {
        ...document_info,
        ...data,
        slug,
        buscar_nombre,
      });

      await toast.promise(nueva_plataforma, {
        loading: "Creando...",
        success: "Plataforma creada",
        error: "Error al crear la Plataforma",
      });

      dispatch(resetPage());
      dispatch(getPlataformas({ isNextPage: false, isPrevPage: false }));

      onClose();
      reset();

      return nueva_plataforma;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

// funcion para actualizar una plataforma
export const updatePlataforma = createAsyncThunk(
  "plataforma/updatePlataforma",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const { id, onClose, reset, ...data } = params;

      const { nombre_plataforma } = data;

      // slug
      const slug = nombre_plataforma.toLowerCase().replace(/ /g, "_");
      const buscar_nombre = nombre_plataforma.toLowerCase();

      const isDuplicate = await checkDuplicateValue(
        "plataformas",
        "nombre_plataforma",
        nombre_plataforma,
        id
      );

      if (isDuplicate) {
        toast.error("Nombre de la plataforma duplicada");
        return rejectWithValue("Plataforma duplicada");
      }

      const docRef = doc(db, "plataformas", id);

      // transaction atomic
      const transactionFunc = () =>
        runTransaction(db, async (transaction) => {
          const doc = await transaction.get(docRef);

          if (!doc.exists()) {
            toast.error("La plataforma no existe");
            throw "La plataforma no existe";
          }

          transaction.update(docRef, {
            ...data,
            slug,
            buscar_nombre,
            updated_at: new Date(),
          });

          // update plataforma en productos
          const productos = await getDocs(
            query(
              collection(db, "productos"),
              where("plataforma.id", "==", id),
              where("active", "==", true)
            )
          );

          productos.forEach((doc) => {
            // Obtener el ID del documento
            const docRefProducto = doc.ref;

            // Actualizar el documento con los nuevos datos
            transaction.update(docRefProducto, {
              "plataforma.nombre_plataforma": nombre_plataforma,
              "plataforma.slug": slug,
            });
          });

          // update plataforma en codigos
          const plataformas = await getDocs(
            query(
              collection(db, "codigos"),
              where("plataforma.id", "==", id),
              where("active", "==", true)
            )
          );

          plataformas.forEach((doc) => {
            // Obtener el ID del documento
            const docRefPlataforma = doc.ref;

            // Actualizar el documento con los nuevos datos
            transaction.update(docRefPlataforma, {
              "plataforma.nombre_plataforma": nombre_plataforma,
              "plataforma.slug": slug,
            });
          });
        });

      await toast.promise(transactionFunc(), {
        loading: "Actualizando...",
        success: "Plataforma actualizada",
        error: "Error al actualizar la Plataforma",
      });

      onClose();
      reset();

      dispatch(resetPage());
      dispatch(getPlataformas({ isNextPage: false, isPrevPage: false }));

      return id;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err);
    }
  }
);
// -----------------------------------------Slice-----------------------------------------
export const plataformaSlice = createSlice({
  name: "plataforma",
  initialState: {
    plataformas: [],
    plataforma_selected: null,
    plataforma_data_update: null,
    error: null,
    loading_plataforma: false,
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

    // acttions Plataforma
    setPlataformaSelected: (state, action) => {
      state.plataforma_selected = action.payload;
    },

    // update state isUpdate
    setIsUpdate: (state, action) => {
      state.isUpdate = action.payload;
    },
  },

  extraReducers: {
    // get plataformas
    [getPlataformas.pending]: (state) => {
      state.loading_plataforma = true;
    },
    [getPlataformas.fulfilled]: (state, action) => {
      state.loading_plataforma = false;
      state.plataformas = action.payload;
    },
    [getPlataformas.rejected]: (state, action) => {
      state.loading_plataforma = false;
      state.error = action.payload;
    },

    // eliminar plataforma
    [eliminarPlataforma.pending]: (state, action) => {
      state.loading_plataforma = true;
    },
    [eliminarPlataforma.fulfilled]: (state, action) => {
      state.loading_plataforma = false;
    },
    [eliminarPlataforma.rejected]: (state, action) => {
      state.loading_plataforma = false;
      state.error = action.payload.message;
    },

    // get plataforma
    [getPlataforma.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [getPlataforma.fulfilled]: (state, action) => {
      state.plataforma_data_update = action.payload;
      state.loading_actions = false;
    },
    [getPlataforma.rejected]: (state, action) => {
      state.loading_actions = false;
      state.error = action.payload.message;
    },

    // create plataforma
    [createPlataforma.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [createPlataforma.fulfilled]: (state, action) => {
      state.loading_actions = false;
    },
    [createPlataforma.rejected]: (state, action) => {
      state.loading_actions = false;
      state.error = action.payload.message;
    },

    // update plataforma
    [updatePlataforma.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [updatePlataforma.fulfilled]: (state, action) => {
      state.loading_actions = false;
    },
    [updatePlataforma.rejected]: (state, action) => {
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
  setPlataformaSelected,
  setIsUpdate,
} = plataformaSlice.actions;

// -----------------------------------------Selector-----------------------------------------
export const selectPlataforma = (state) => state.plataforma.plataformas;
export const selectLoadingPlataformas = (state) =>
  state.plataforma.loading_plataforma;
export const selectPage = (state) => state.plataforma.page;
export const selectPlataformaSelected = (state) =>
  state.plataforma.plataforma_selected;
export const loadingActions = (state) => state.plataforma.loading_actions;
export const selectPlataformaDataUpdate = (state) =>
  state.plataforma.plataforma_data_update;
export const selectIsUpdate = (state) => state.plataforma.isUpdate;

export default plataformaSlice.reducer;
