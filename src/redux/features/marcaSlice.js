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
const getQuery = (marcasCollection, search, sort = "asc") => {
  return query(
    marcasCollection,
    // where("active", "==", true),
    orderBy("placa", sort),
    limit(10)
  );
};

// Funcion para obtener todos los marcas de la base de datos
export const getMarcas = createAsyncThunk(
  "marca/getMarcas",
  async (
    { isNextPage, isPrevPage, search = "" },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const marcas = [];

      const marcasCollection = collection(db, "vehiculos");
      const { lastVisible, firstVisible, marcas: _marcas } = getState().marca;

      let querySnapshot = null;

      if (!isNextPage && !isPrevPage) {
        const q = getQuery(marcasCollection, search);
        querySnapshot = await getDocs(q);
      }

      if (_marcas.length === 0 && isPrevPage) {
        const q = getQuery(marcasCollection, search, "desc");
        querySnapshot = await getDocs(q);
        dispatch(resetPage());
      }

      // Get the last visible document

      if ((isNextPage || isPrevPage) && _marcas.length !== 0) {
        const order_by = !isNextPage ? "desc" : "asc";
        // Construct a new query starting at this document,
        // get the next or prev 10 marcas.
        const next = query(
          marcasCollection,
          where("active", "==", true),
          orderBy("nombre_marca", order_by),
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
        marcas.push({ ...doc.data(), id: doc.id });
      });
      return marcas;
    } catch (err) {
      console.log(err);
      toast.error(err.mesage);
      return rejectWithValue(err);
    }
  }
);

// funcion para eliminar una marca
export const eliminarMarca = createAsyncThunk(
  "marca/eliminarMarca",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const docRef = doc(db, "vehiculos", params?.id);

      const updateTimestamp = updateDoc(docRef, {
        active: !params?.stauts,
        updated_at: new Date(),
      });

      await toast.promise(updateTimestamp, {
        loading: "Eliminando...",
        success: "Estado del vehículo actualizado",
        error: "Error al actualizar el estado del vehículo",
      });

      dispatch(resetPage());
      dispatch(getMarcas({ isNextPage: false, isPrevPage: false }));

      return docRef;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// funcion para obtener una marca por id
export const getMarca = createAsyncThunk(
  "marca/getMarca",
  async (marca_id, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "vehiculos", marca_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          id: docSnap.id,
        };
      } else {
        toast.error("No se encontró el vehículo");
        return rejectWithValue("No se encontró el vehículo");
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// funcion para crear una marca
export const createMarca = createAsyncThunk(
  "marca/createMarca",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const { onClose, reset, ...data } = params;

      const new_marca = addDoc(collection(db, "vehiculos"), {
        ...document_info,
        ...data,
      });

      await toast.promise(new_marca, {
        loading: "Creando...",
        success: "Vehículo creado",
        error: "Error al crear el vehículo",
      });

      dispatch(resetPage());
      dispatch(getMarcas({ isNextPage: false, isPrevPage: false }));

      onClose();
      reset();

      return new_marca;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

// funcion para actualizar una marca
export const updateMarca = createAsyncThunk(
  "marca/updateMarca",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const { id, onClose, reset, ...data } = params;

      const docRef = doc(db, "vehiculos", id);

      // transaction atomic
      const transactionFunc = () =>
        runTransaction(db, async (transaction) => {
          const doc = await transaction.get(docRef);

          if (!doc.exists()) {
            toast.error("El vehículo no existe");
            throw "El vehículo no existe";
          }

          transaction.update(docRef, {
            ...data,
            updated_at: new Date(),
          });

          // update
          const rutas = await getDocs(
            query(
              collection(db, "rutas"),
              where("vehiculo_id.id", "==", id),
              where("active", "==", true)
            )
          );

          rutas.forEach((doc) => {
            // Obtener el ID del documento
            const docRefProducto = doc.ref;

            // Actualizar el documento con los nuevos datos
            transaction.update(docRefProducto, {
              vehiculo_id: { ...data },
            });
          });

          // update marca en productos
          const recolecciones = await getDocs(
            query(
              collection(db, "residuos"),
              where("ruta.vehiculo_id.id", "==", id),
              where("active", "==", true)
            )
          );

          recolecciones.forEach((doc) => {
            // Obtener el ID del documento
            const docRefProducto = doc.ref;

            // Actualizar el documento con los nuevos datos
            transaction.update(docRefProducto, {
              ruta: {
                ...doc.data().ruta,
                vehiculo_id: { ...data },
              },
            });
          });
        });

      await toast.promise(transactionFunc(), {
        loading: "Actualizando...",
        success: "Vehículo actualizado",
        error: "Error al actualizar el vehículo",
      });

      onClose();
      reset();

      dispatch(resetPage());
      dispatch(getMarcas({ isNextPage: false, isPrevPage: false }));

      return id;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err);
    }
  }
);
// -----------------------------------------Slice-----------------------------------------
export const marcaSlice = createSlice({
  name: "marca",
  initialState: {
    marcas: [],
    marca_selected: null,
    marca_data_update: null,
    error: null,
    loading_marca: false,
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

    // acttions Marca
    setMarcaSelected: (state, action) => {
      state.marca_selected = action.payload;
    },

    // update state isUpdate
    setIsUpdate: (state, action) => {
      state.isUpdate = action.payload;
    },
  },

  extraReducers: {
    // get marcas
    [getMarcas.pending]: (state) => {
      state.loading_marca = true;
    },
    [getMarcas.fulfilled]: (state, action) => {
      state.loading_marca = false;
      state.marcas = action.payload;
    },
    [getMarcas.rejected]: (state, action) => {
      state.loading_marca = false;
      state.error = action.payload;
    },

    // eliminar marca
    [eliminarMarca.pending]: (state, action) => {
      state.loading_marca = true;
    },
    [eliminarMarca.fulfilled]: (state, action) => {
      state.loading_marca = false;
    },
    [eliminarMarca.rejected]: (state, action) => {
      state.loading_marca = false;
      state.error = action.payload.message;
    },

    // get marca
    [getMarca.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [getMarca.fulfilled]: (state, action) => {
      state.marca_data_update = action.payload;
      state.loading_actions = false;
    },
    [getMarca.rejected]: (state, action) => {
      state.loading_actions = false;
      state.error = action.payload.message;
    },

    // create marca
    [createMarca.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [createMarca.fulfilled]: (state, action) => {
      state.loading_actions = false;
    },
    [createMarca.rejected]: (state, action) => {
      state.loading_actions = false;
      state.error = action.payload.message;
    },

    // update marca
    [updateMarca.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [updateMarca.fulfilled]: (state, action) => {
      state.loading_actions = false;
    },
    [updateMarca.rejected]: (state, action) => {
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
  setMarcaSelected,
  setIsUpdate,
} = marcaSlice.actions;

// -----------------------------------------Selector-----------------------------------------
export const selectMarcas = (state) => state.marca.marcas;
export const selectLoadingMarcas = (state) => state.marca.loading_marca;
export const selectPage = (state) => state.marca.page;
export const selectMarcaSelected = (state) => state.marca.marca_selected;
export const loadingActions = (state) => state.marca.loading_actions;
export const selectMarcaDataUpdate = (state) => state.marca.marca_data_update;
export const selectIsUpdate = (state) => state.marca.isUpdate;

export default marcaSlice.reducer;
