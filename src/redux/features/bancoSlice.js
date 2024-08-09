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
  runTransaction,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";

// utils
import { validateImage } from "../../Utils/firebaseFunc";

// toast
import toast from "react-hot-toast";

// -----------------------------------------Funciones-----------------------------------------

// Funcion para obtener la query global
const getQuery = (bancosCollection, search, sort = "asc") => {
  return query(
    bancosCollection,
    where("active", "==", true),
    where("buscar_nombre", ">=", search.toLowerCase()),
    where("buscar_nombre", "<=", search.toLowerCase() + "\uf8ff"),
    orderBy("buscar_nombre", sort),
    limit(10)
  );
};

// Funcion para obtener todos los bancos de la base de datos
export const getBancos = createAsyncThunk(
  "banco/getBancos",
  async (
    { isNextPage, isPrevPage, search = "" },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const bancos = [];

      const bancosCollection = collection(db, "bancos");
      const { lastVisible, firstVisible, bancos: _bancos } = getState().banco;

      let querySnapshot = null;

      if (!isNextPage && !isPrevPage) {
        const q = getQuery(bancosCollection, search);
        querySnapshot = await getDocs(q);
      }

      if (_bancos.length === 0 && isPrevPage) {
        const q = getQuery(bancosCollection, search, "desc");
        querySnapshot = await getDocs(q);
        dispatch(resetPage());
      }

      // Get the last visible document

      if ((isNextPage || isPrevPage) && _bancos.length !== 0) {
        const order_by = !isNextPage ? "desc" : "asc";
        // Construct a new query starting at this document,
        // get the next or prev 10 bancos.
        const next = query(
          bancosCollection,
          where("active", "==", true),
          orderBy("nombre_banco", order_by),
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
        bancos.push({ ...doc.data(), id: doc.id });
      });
      return bancos;
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

// funcion para eliminar un banco
export const eliminarBanco = createAsyncThunk(
  "banco/eliminarBanco",
  async (banco_id, { dispatch, rejectWithValue }) => {
    try {
      // verificar si el banco tiene metodos de pago asociados
      const metodos_pago = await getDocs(
        query(collection(db, "metodos_pago"), where("active", "==", true))
      );

      let metodosAsociados = false;

      metodos_pago.forEach((doc) => {
        doc.data().cuenta.forEach((cuenta) => {
          if (cuenta?.metodo_pago?.id === banco_id) {
            metodosAsociados = true;
          }
        });
      });

      if (metodosAsociados) {
        toast.error(
          "No se puede eliminar el banco, tiene metodos de pago asociados"
        );
        return rejectWithValue("El banco tiene metodos de pago asociados");
      }

      const docRef = doc(db, "bancos", banco_id);

      const updateTimestamp = updateDoc(docRef, {
        active: false,
        updated_at: new Date(),
      });

      await toast.promise(updateTimestamp, {
        loading: "Eliminando...",
        success: "Banco eliminado",
        error: "Error al eliminar el banco",
      });

      dispatch(resetPage());
      dispatch(getBancos({ isNextPage: false, isPrevPage: false }));

      return docRef;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// funcion para obtener un banco por id
export const getBanco = createAsyncThunk(
  "banco/getBanco",
  async (banco_id, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "bancos", banco_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          id: docSnap.id,
        };
      } else {
        toast.error("No se encontró el banco");
        return rejectWithValue("No se encontró el banco");
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// funcion para crear un banco
export const createBanco = createAsyncThunk(
  "banco/createBanco",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const { onClose, reset, ...data } = params;

      const { imagen_banco } = data;

      const images_url = await uploadFiles(imagen_banco, "bancos");

      const buscar_nombre = data.nombre_banco.toLowerCase();

      const new_banco = addDoc(collection(db, "bancos"), {
        ...document_info,
        ...data,
        imagen_banco: images_url,
        buscar_nombre,
      });

      await toast.promise(new_banco, {
        loading: "Creando...",
        success: "Banco creado",
        error: "Error al crear el Banco",
      });

      dispatch(resetPage());
      dispatch(getBancos({ isNextPage: false, isPrevPage: false }));

      onClose();
      reset();

      return new_banco;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

// funcion para actualizar una banco
export const updateBanco = createAsyncThunk(
  "banco/updateBanco",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const { id, onClose, reset, ...data } = params;

      const { imagen_banco } = data;

      // Verificar si la imagen del producto ha cambiado
      const images_url = await validateImage(
        id,
        imagen_banco,
        "imagen_banco",
        "bancos"
      );

      const buscar_nombre = data.nombre_banco.toLowerCase();

      const docRef = doc(db, "bancos", id);

      // transaction atomic
      const transactionFunc = () =>
        runTransaction(db, async (transaction) => {
          const doc = await transaction.get(docRef);

          if (!doc.exists()) {
            toast.error("El banco no existe");
            throw "El banco no existe";
          }

          transaction.update(docRef, {
            ...data,
            buscar_nombre,
            imagen_banco: images_url,
            updated_at: new Date(),
          });

          // update metodos de pago asociados
          const metodos_pago = await getDocs(
            query(collection(db, "metodos_pago"), where("active", "==", true))
          );

          metodos_pago.forEach((docRefMP) => {
            // verificar si el metodo de pago tiene el banco asociado
            docRefMP.data().cuenta.forEach((cuenta) => {
              // si el metodo de pago tiene el banco asociado
              if (cuenta?.metodo_pago?.id === id) {
                // actualizar el nombre del banco
                transaction.update(docRefMP.ref, {
                  cuenta: [
                    // map para buscar el metodo de pago asociado y actualizar el nombre del banco
                    ...docRefMP.data().cuenta.map((c) => {
                      if (c.metodo_pago.id === id) {
                        return {
                          ...c,
                          metodo_pago: {
                            ...c.metodo_pago,
                            ...data,
                            imagen_banco: images_url,
                            buscar_nombre,
                          },
                        };
                      }
                      return c;
                    }),
                  ],
                });
              }
            });
          });
        });

      await toast.promise(transactionFunc(), {
        loading: "Actualizando...",
        success: "Banco actualizado",
        error: "Error al actualizar el Banco",
      });

      onClose();
      reset();

      dispatch(resetPage());
      dispatch(getBancos({ isNextPage: false, isPrevPage: false }));

      return id;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);
// -----------------------------------------Slice-----------------------------------------
export const bancoSlice = createSlice({
  name: "banco",
  initialState: {
    bancos: [],
    banco_selected: null,
    banco_data_update: null,
    error: null,
    loading_banco: false,
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

    // acttions Banco
    setBancoSelected: (state, action) => {
      state.banco_selected = action.payload;
    },

    // update state isUpdate
    setIsUpdate: (state, action) => {
      state.isUpdate = action.payload;
    },
  },

  extraReducers: {
    // get bancos
    [getBancos.pending]: (state) => {
      state.loading_banco = true;
    },
    [getBancos.fulfilled]: (state, action) => {
      state.loading_banco = false;
      state.bancos = action.payload;
    },
    [getBancos.rejected]: (state, action) => {
      state.loading_banco = false;
      state.error = action.payload;
    },

    // eliminar banco
    [eliminarBanco.pending]: (state, action) => {
      state.loading_banco = true;
    },
    [eliminarBanco.fulfilled]: (state, action) => {
      state.loading_banco = false;
    },
    [eliminarBanco.rejected]: (state, action) => {
      state.loading_banco = false;
      state.error = action.payload.message;
    },

    // get banco
    [getBanco.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [getBanco.fulfilled]: (state, action) => {
      state.banco_data_update = action.payload;
      state.loading_actions = false;
    },
    [getBanco.rejected]: (state, action) => {
      state.loading_actions = false;
      state.error = action.payload.message;
    },

    // create banco
    [createBanco.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [createBanco.fulfilled]: (state, action) => {
      state.loading_actions = false;
    },
    [createBanco.rejected]: (state, action) => {
      state.loading_actions = false;
      state.error = action.payload.message;
    },

    // update banco
    [updateBanco.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [updateBanco.fulfilled]: (state, action) => {
      state.loading_actions = false;
    },
    [updateBanco.rejected]: (state, action) => {
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
  setBancoSelected,
  setIsUpdate,
} = bancoSlice.actions;

// -----------------------------------------Selector-----------------------------------------
export const selectBancos = (state) => state.banco.bancos;
export const selectLoadingBancos = (state) => state.banco.loading_banco;
export const selectPage = (state) => state.banco.page;
export const selectBancoSelected = (state) => state.banco.banco_selected;
export const loadingActions = (state) => state.banco.loading_actions;
export const selectBancoDataUpdate = (state) => state.banco.banco_data_update;
export const selectIsUpdate = (state) => state.banco.isUpdate;

export default bancoSlice.reducer;
