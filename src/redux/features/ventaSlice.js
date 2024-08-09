// redux
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// config
import { db } from "../../firebase/config";

// firebase
import {
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
import {
  CANCELADO_ORDER,
  COMPLETADO,
  GENERADO_ORDER,
  PAGO_CONFIRMADO,
  REEMBOLSO_REALIZADO,
  array_error_order,
} from "../../Utils/constants";
import { convertStatus } from "../../Utils/functions";

import moment from "moment";
// -----------------------------------------Funciones-----------------------------------------

// Funcion para obtener la query global
const getQuery = (ventasCollection, search, sort = "desc") => {
  const q = search
    ? query(
        ventasCollection,
        where("numero_orden", ">=", search.toLowerCase()),
        where("numero_orden", "<=", search.toLowerCase() + "\uf8ff"),
        orderBy("numero_orden", sort),
        limit(10)
      )
    : query(
        ventasCollection,
        where("active", "==", true),
        orderBy("created_at", sort),
        limit(10)
      );

  return q;
};

const parceDate = (date, fecha_fin = false) => {
  if (fecha_fin) {
    return date + " " + "23:59:59";
  } else {
  }
  return date + " " + "00:00:00";
};

const getQueryFilter = (ventasCollection, search, filter, sort = "desc") => {
  const q = search
    ? query(
        ventasCollection,
        where("numero_orden", ">=", search.toLowerCase()),
        where("numero_orden", "<=", search.toLowerCase() + "\uf8ff"),
        filter?.order_state && filter?.order_state?.value !== ""
          ? where("status", "==", filter?.order_state?.value)
          : where("active", "==", true),
        filter?.id_user !== "" && filter?.id_user?.id !== ""
          ? where("usuario.uid", "==", filter?.id_user?.id)
          : where("active", "==", true),
        orderBy("numero_orden", sort),
        limit(10)
      )
    : query(
        ventasCollection,
        where("active", "==", true),
        filter?.order_state && filter?.order_state?.value !== ""
          ? where("status", "==", filter.order_state.value)
          : where("active", "==", true),
        filter?.id_user !== "" && filter?.id_user?.id !== ""
          ? where("usuario.uid", "==", filter?.id_user?.id)
          : where("active", "==", true),
        filter?.fecha_inicio !== ""
          ? where("created_at", ">=", parceDate(filter?.fecha_inicio))
          : where("active", "==", true),
        filter?.fecha_fin !== ""
          ? where("created_at", "<=", parceDate(filter?.fecha_fin, true))
          : where("active", "==", true),
        orderBy("created_at", sort),
        limit(10)
      );

  return q;
};

// Funcion para obtener todos los ventas de la base de datos
export const getVentas = createAsyncThunk(
  "venta/getVentas",
  async (
    { isNextPage, isPrevPage, search = "", filter = {} },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const ventas = [];

      const ventasCollection = collection(db, "ventas");
      const { lastVisible, firstVisible, ventas: _ventas } = getState().venta;

      let querySnapshot = null;

      if (!isNextPage && !isPrevPage) {
        const q =
          Object.keys(filter).length > 0 && filter
            ? getQueryFilter(ventasCollection, search, filter)
            : getQuery(ventasCollection, search);
        querySnapshot = await getDocs(q);
      }

      if (_ventas.length === 0 && isPrevPage) {
        const q =
          Object.keys(filter).length > 0 && filter
            ? getQueryFilter(ventasCollection, search, filter, "desc")
            : getQuery(ventasCollection, search, "desc");
        querySnapshot = await getDocs(q);
        dispatch(resetPage());
      }

      // Get the last visible document

      if ((isNextPage || isPrevPage) && _ventas.length !== 0) {
        const order_by = !isNextPage ? "asc" : "desc";
        // Construct a new query starting at this document,
        // get the next or prev 10 ventas.
        const next =
          Object.keys(filter).length > 0 && filter
            ? query(
                ventasCollection,
                where("active", "==", true),
                filter?.order_state && filter?.order_state.value
                  ? where("status", "==", filter.order_state.value)
                  : where("active", "==", true),
                filter?.id_user !== "" && filter?.id_user?.id !== ""
                  ? where("usuario.uid", "==", filter.id_user.id)
                  : where("active", "==", true),
                filter?.fecha_inicio
                  ? where("created_at", ">=", parceDate(filter?.fecha_inicio))
                  : where("active", "==", true),
                filter?.fecha_fin
                  ? where(
                      "created_at",
                      "<=",
                      parceDate(filter?.fecha_fin, true)
                    )
                  : where("active", "==", true),
                orderBy("created_at", order_by),
                startAfter(isNextPage ? lastVisible : firstVisible),
                limit(10)
              )
            : query(
                ventasCollection,
                where("active", "==", true),
                orderBy("created_at", order_by),
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
        ventas.push({ ...doc.data(), id: doc.id });
      });
      return ventas;
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

export const getOrder = createAsyncThunk(
  "venta/getOrder",
  async (order_id, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "ventas", order_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          id: docSnap.id,
        };
      } else {
        toast.error("No se encontró la orden");
        return rejectWithValue("No se encontró la orden");
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const updateTransaction = async (
  venta_id,
  status,
  motivo_cancelacion,
  comentario_error
) => {
  const transactionFunc = () =>
    runTransaction(db, async (transaction) => {
      const docRef = doc(db, "ventas", venta_id);
      const docSnap = await transaction.get(docRef);

      if (!docSnap.exists()) {
        toast.error("No se encontró la orden");
        throw new Error("No se encontró la orden");
      }

      const bitacora = docSnap.data().bitacora || [];
      const orden = docSnap.data().orden;

      const productos = {};

      if (orden) {
        // Lee todos los productos primero y almacena los resultados
        for (const item of orden) {
          const productoRef = doc(db, "productos", item?.productoID);
          const productoSnap = await transaction.get(productoRef);
          productos[item?.productoID] = {
            snap: productoSnap,
            quantity: item?.items?.reduce(
              (acc, curr) => acc + curr?.quantity,
              0
            ),
          };
        }

        // Realiza todas las escrituras después
        transaction.update(docRef, {
          status,
          comentario_error:
            comentario_error || docSnap.data()?.comentario_error || "",
          motivo_cancelacion:
            motivo_cancelacion || docSnap.data()?.motivo_cancelacion || "",
          bitacora: [
            ...bitacora,
            {
              status,
              created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
              comentario_error:
                comentario_error || docSnap.data()?.comentario_error || "",
              motivo_cancelacion:
                motivo_cancelacion || docSnap.data()?.motivo_cancelacion || "",
            },
          ],
        });

        orden.map((item) => {
          const productoSnap = productos[item?.productoID]?.snap;
          const productoRef = doc(db, "productos", item?.productoID);

          transaction.update(productoRef, {
            cantidad_vendidos:
              (productoSnap.data().cantidad_vendidos || 0) +
              productos[item?.productoID]?.quantity,
          });
        });
      }
    });

  await toast.promise(transactionFunc(), {
    loading: "Actualizando...",
    success: "Estado de la orden actualizado",
    error: "Error al editar la orden",
  });
};

const updateNormal = async (
  docRef,
  docSnap,
  status,
  motivo_cancelacion,
  comentario_error
) => {
  const bitacora = docSnap.data().bitacora || [];

  const updateTimestamp = updateDoc(docRef, {
    status,
    comentario_error:
      comentario_error || docSnap.data()?.comentario_error || "",
    motivo_cancelacion:
      motivo_cancelacion || docSnap.data()?.motivo_cancelacion || "",
    bitacora: [
      ...bitacora,
      {
        status,
        created_at: moment().format("YYYY-MM-DD HH:mm:ss"),
        comentario_error:
          comentario_error || docSnap.data()?.comentario_error || "",
        motivo_cancelacion:
          motivo_cancelacion || docSnap.data()?.motivo_cancelacion || "",
      },
    ],
  });

  await toast.promise(updateTimestamp, {
    loading: "Actualizando...",
    success: "Estado de la orden actualizado",
    error: "Error al editar la orden",
  });
};

export const changeState = createAsyncThunk(
  "venta/changeState",
  async (
    { venta_id, status, motivo_cancelacion = "", comentario_error = "" },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const docRef = doc(db, "ventas", venta_id);

      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        toast.error("No se encontró la orden");
        return rejectWithValue("No se encontró la orden");
      }

      if (docSnap.data().status === CANCELADO_ORDER) {
        toast.error("La orden ya fue cancelada");
        dispatch(resetPage());
        dispatch(getVentas({ isNextPage: false, isPrevPage: false }));
        return rejectWithValue("La orden ya fue cancelada");
      }

      if (docSnap.data().status === COMPLETADO) {
        toast.error("La orden ya fue completada");
        dispatch(resetPage());
        dispatch(getVentas({ isNextPage: false, isPrevPage: false }));
        return rejectWithValue("La orden ya fue completada");
      }

      if (docSnap.data().status === REEMBOLSO_REALIZADO) {
        toast.error("La orden ya fue reembolsada");
        dispatch(resetPage());
        dispatch(getVentas({ isNextPage: false, isPrevPage: false }));
        return rejectWithValue("La orden ya fue reembolsada");
      }

      if (
        status === CANCELADO_ORDER &&
        docSnap.data().status !== GENERADO_ORDER
      ) {
        toast.error(
          `No puedes cancelar una orden con el estado "${
            convertStatus(docSnap.data().status)?.name
          }"`
        );
        dispatch(resetPage());
        dispatch(getVentas({ isNextPage: false, isPrevPage: false }));
        return rejectWithValue("No puedes cancelar una orden con este estado");
      }

      if (docSnap.data().status === status) {
        toast.error(
          `La orden ya fue actualizada a "${
            convertStatus(status)?.name
          }" anteriormente`
        );
        dispatch(resetPage());
        dispatch(getVentas({ isNextPage: false, isPrevPage: false }));
        return rejectWithValue("La orden ya tiene este estado");
      }

      if (
        array_error_order.includes(docSnap.data().status) &&
        array_error_order.includes(status)
      ) {
        toast.error(
          `La orde ya fue actualizda a "${
            convertStatus(docSnap.data().status)?.name
          }", no puedes volver a asignar un estado de error a esta orden`
        );
        dispatch(resetPage());
        dispatch(getVentas({ isNextPage: false, isPrevPage: false }));
        return rejectWithValue("Debe ingresar un motivo de cancelación");
      }

      if (
        docSnap.data().status !== GENERADO_ORDER &&
        docSnap.data().status !== PAGO_CONFIRMADO &&
        !array_error_order.includes(docSnap.data().status) &&
        array_error_order.includes(status)
      ) {
        toast.error(
          `No puedes asignar un estado de error a una orden con el estado "${
            convertStatus(docSnap.data().status)?.name
          }"`
        );
        dispatch(resetPage());
        dispatch(getVentas({ isNextPage: false, isPrevPage: false }));
        return rejectWithValue("Debe ingresar un motivo de cancelación");
      }

      if (
        (status === PAGO_CONFIRMADO || status === COMPLETADO) &&
        docSnap.data().status !== GENERADO_ORDER &&
        docSnap.data().status !== PAGO_CONFIRMADO
      ) {
        toast.error(
          `No puedes asignar un estado de "${
            convertStatus(status)?.name
          }" a una orden con el estado "${
            convertStatus(docSnap.data().status)?.name
          }"`
        );
        dispatch(resetPage());
        dispatch(getVentas({ isNextPage: false, isPrevPage: false }));
        return rejectWithValue("Debe ingresar un motivo de cancelación");
      }

      if (
        !array_error_order.includes(docSnap.data().status) &&
        status === REEMBOLSO_REALIZADO
      ) {
        toast.error(
          `No puedes reembolsar una orden con el estado "${
            convertStatus(docSnap.data().status)?.name
          }"`
        );
        dispatch(resetPage());
        dispatch(getVentas({ isNextPage: false, isPrevPage: false }));
        return rejectWithValue("Debe ingresar un motivo de cancelación");
      }

      if (status === COMPLETADO) {
        // transaction atomic
        await updateTransaction(
          venta_id,
          status,
          motivo_cancelacion,
          comentario_error
        );
      } else {
        await updateNormal(
          docRef,
          docSnap,
          status,
          motivo_cancelacion,
          comentario_error
        );
      }

      dispatch(resetPage());
      dispatch(getVentas({ isNextPage: false, isPrevPage: false }));

      return docRef;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// -----------------------------------------Slice-----------------------------------------
export const ventaSlice = createSlice({
  name: "venta",
  initialState: {
    ventas: [],
    venta_selected: null,
    error: null,
    loading_venta: false,
    loading_actions: false,
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
    [getVentas.pending]: (state) => {
      state.loading_venta = true;
    },
    [getVentas.fulfilled]: (state, action) => {
      state.loading_venta = false;
      state.ventas = action.payload;
    },
    [getVentas.rejected]: (state, action) => {
      state.loading_venta = false;
      state.error = action.payload;
    },
    [changeState.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [changeState.fulfilled]: (state, action) => {
      state.loading_actions = false;
    },
    [changeState.rejected]: (state, action) => {
      state.loading_actions = false;
      state.error = action.payload.message;
    },
    [getOrder.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [getOrder.fulfilled]: (state, action) => {
      state.loading_actions = false;
      state.venta_selected = action.payload;
    },
    [getOrder.rejected]: (state, action) => {
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
} = ventaSlice.actions;

// -----------------------------------------Selector-----------------------------------------
export const selectVentas = (state) => state.venta.ventas;
export const selectLoadingVentas = (state) => state.venta.loading_venta;
export const selectPage = (state) => state.venta.page;
export const selectVentaSelected = (state) => state.venta.venta_selected;
export const selectLoadingActions = (state) => state.venta.loading_actions;

export default ventaSlice.reducer;
