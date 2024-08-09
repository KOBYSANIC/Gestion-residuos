import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { db } from "../../firebase/config";
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
import toast from "react-hot-toast";
import {
  CANCELADO,
  document_info,
  ENTREGADO,
  ENVIADO,
  GENERADO,
} from "../../Utils/constants";

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (
    { order_name, description, onClose, reset },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const new_order = addDoc(collection(db, "orders"), {
        ...document_info,
        order_name,
        description,
      });

      await toast.promise(new_order, {
        loading: "Creando...",
        success: "Marca creada",
        error: "Error al crear la marca",
      });

      dispatch(resetPage());
      dispatch(getOrders({ isNextPage: false, isPrevPage: false }));

      onClose();
      reset();

      return new_order;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

const getQuery = (ordersCollection, filters, sort = "desc") => {
  const { apply_filters, order_state } = filters;
  return query(
    ordersCollection,

    apply_filters
      ? where("order_state", "==", order_state || GENERADO)
      : where("order_state", "in", [GENERADO, ENVIADO, ENTREGADO, CANCELADO]),
    where("active", "==", true),
    orderBy("created_at", sort),
    limit(10)
  );
};

export const getOrders = createAsyncThunk(
  "order/getOrders",
  async (
    { isNextPage, isPrevPage },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      // Get filters and the last visible document
      const {
        filters,
        apply_filters,
        lastVisible,
        firstVisible,
        orders: _orders,
      } = getState().order;
      const { order_state } = filters;
      const orders = [];

      const ordersCollection = collection(db, "orders");
      let querySnapshot = null;
      const filters_query = {
        apply_filters,
        order_state,
      };

      if (!isNextPage && !isPrevPage) {
        const q = getQuery(ordersCollection, filters_query);
        querySnapshot = await getDocs(q);
      }

      if (_orders.length === 0 && isPrevPage) {
        const q = getQuery(ordersCollection, filters_query, "asc");
        querySnapshot = await getDocs(q);
        dispatch(resetPage());
      }

      if ((isNextPage || isPrevPage) && _orders.length !== 0) {
        const order_by = !isNextPage ? "asc" : "desc";
        // Construct a new query starting at this document,
        // get the next or prev 10 orders.
        const next = query(
          ordersCollection,
          apply_filters
            ? where("order_state", "==", order_state || GENERADO)
            : where("order_state", "in", [
                GENERADO,
                ENVIADO,
                ENTREGADO,
                CANCELADO,
              ]),
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
        orders.push({ ...doc.data(), id: doc.id });
      });

      return orders;
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

export const getOrder = createAsyncThunk(
  "order/getOrder",
  async (order_id, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "orders", order_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          id: docSnap.id,
          // event_state: event_states[2],
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

export const changeStateOrder = createAsyncThunk(
  "order/changeStateOrder",
  async ({ order_id, state }, { dispatch, rejectWithValue }) => {
    try {
      const docRef = doc(db, "orders", order_id);

      const updateTimestamp = updateDoc(docRef, {
        order_state: state,
      });

      await toast.promise(updateTimestamp, {
        loading: "Editando...",
        success: "Orden editada",
        error: "Error al editar la orden",
      });

      dispatch(resetPage());
      dispatch(getOrders({ isNextPage: false, isPrevPage: false }));

      return docRef;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateOrder = createAsyncThunk(
  "order/updateOrder",
  async (
    { id, order_name, description, onClose, reset },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const order = updateDoc(doc(db, "orders", id), {
        order_name,
        description,
        updated_at: new Date(),
      });

      await toast.promise(order, {
        loading: "Actualizando...",
        success: "Marca actualizada",
        error: "Error al actualizar la marca",
      });

      onClose();
      reset();

      dispatch(resetPage());
      dispatch(getOrders({ isNextPage: false, isPrevPage: false }));

      return order;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: null,
    orders: [],
    order_data_update: null,
    order_selected: null,
    loading: false,
    loading_order: false,
    loading_update_order: false,
    loading_save_order: false,
    isUpdate: false,
    error: null,
    firstVisible: null,
    lastVisible: null,
    page: 1,
    filters: {
      order_state: null,
    },
    apply_filters: false,
  },
  reducers: {
    login: (state, action) => {
      state.order = action.payload;
    },
    logout: (state) => {
      state.order = null;
    },
    setIsUpdate: (state, action) => {
      state.isUpdate = action.payload;
    },
    setOrderSelected: (state, action) => {
      state.order_selected = action.payload;
    },

    nextPage: (state) => {
      state.page += 1;
    },
    prevPage: (state) => {
      state.page -= 1;
    },
    setOrderStateFilter: (state, action) => {
      state.filters = action.payload;
      state.apply_filters = true;
    },
    setFirstVisible: (state, action) => {
      state.firstVisible = action.payload;
    },
    setLastVisible: (state, action) => {
      state.lastVisible = action.payload;
    },
    resetPage: (state) => {
      state.page = 1;
    },
  },

  extraReducers: {
    [createOrder.pending]: (state) => {
      state.loading = true;
    },
    [createOrder.fulfilled]: (state, action) => {
      state.loading = false;
      // state.order = action.payload;
    },
    [createOrder.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    [getOrders.pending]: (state) => {
      state.loading_order = true;
    },
    [getOrders.fulfilled]: (state, action) => {
      state.loading_order = false;
      state.orders = action.payload;
    },
    [getOrders.rejected]: (state, action) => {
      state.loading_order = false;
      state.error = action.payload;
    },

    [getOrder.pending]: (state, action) => {
      state.loading_update_order = true;
    },
    [getOrder.fulfilled]: (state, action) => {
      state.loading_update_order = false;
      state.order_data_update = action.payload;
    },
    [getOrder.rejected]: (state, action) => {
      state.loading_update_order = false;
      state.error = action.payload.message;
    },

    [changeStateOrder.pending]: (state, action) => {
      state.loading_order = true;
    },
    [changeStateOrder.fulfilled]: (state, action) => {
      state.loading_order = false;
    },
    [changeStateOrder.rejected]: (state, action) => {
      state.loading_order = false;
      state.error = action.payload.message;
    },

    [updateOrder.pending]: (state, action) => {
      state.loading_save_order = true;
    },
    [updateOrder.fulfilled]: (state, action) => {
      state.loading_save_order = false;
    },
    [updateOrder.rejected]: (state, action) => {
      state.loading_save_order = false;
      state.error = action.payload.message;
    },
  },
});

export const {
  login,
  logout,
  setIsUpdate,
  setOrderSelected,
  nextPage,
  prevPage,
  setOrderStateFilter,
  setFirstVisible,
  setLastVisible,
  resetPage,
} = orderSlice.actions;

// selectors
export const selectOrder = (state) => state.order.order;
export const selectLoading = (state) => state.order.loading;
export const selectOrders = (state) => state.order.orders;
export const selectLoadingOrders = (state) => state.order.loading_order;
export const selectOrderDataUpdate = (state) => state.order.order_data_update;
export const selectLoadingupdateOrder = (state) =>
  state.order.loading_update_order;
export const selectOrderSelected = (state) => state.order.order_selected;
export const selectPage = (state) => state.order.page;
export const selectIsUpdate = (state) => state.order.isUpdate;
export const selectLoadingSaveOrder = (state) => state.order.loading_save_order;

export default orderSlice.reducer;
