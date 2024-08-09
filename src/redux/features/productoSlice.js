// redux
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// config
import { db, uploadFiles } from "../../firebase/config";

// constants
import { ADMINISTRADOR, document_info } from "../../Utils/constants";

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
import { validateImage, checkDuplicateValue } from "../../Utils/firebaseFunc";

// uuid
import { v4 as uuidv4 } from "uuid";

// -----------------------------------------Funciones-----------------------------------------

// Funcion para obtener la query global
const getQuery = (productosCollection, search, sort = "desc", uid) => {
  let querValidate;
  if (uid) {
    querValidate = query(
      productosCollection,
      where("active", "==", true),
      where("user", "==", uid),
      orderBy("fecha_recoleccion", sort),
      limit(10)
    );
  } else {
    querValidate = query(
      productosCollection,
      where("active", "==", true),
      orderBy("fecha_recoleccion", sort),
      limit(10)
    );
  }

  return querValidate;
};

// Funcion para obtener todos los productos de la base de datos
export const getProductos = createAsyncThunk(
  "producto/getProductos",
  async (
    { isNextPage, isPrevPage, search = "" },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const productos = [];

      const productosCollection = collection(db, "residuos");
      const {
        lastVisible,
        firstVisible,
        productos: _productos,
      } = getState().producto;

      let querySnapshot = null;

      const { user } = getState().user;

      let uid = user?.uid;

      if (user.role === ADMINISTRADOR) {
        uid = "";
      }

      if (!isNextPage && !isPrevPage) {
        const q = getQuery(productosCollection, search, "asc", uid);
        querySnapshot = await getDocs(q);
      }

      if (_productos.length === 0 && isPrevPage) {
        const q = getQuery(productosCollection, search, "desc", uid);
        querySnapshot = await getDocs(q);
        dispatch(resetPage());
      }

      // Get the last visible document

      if ((isNextPage || isPrevPage) && _productos.length !== 0) {
        const order_by = !isNextPage ? "desc" : "asc";
        // Construct a new query starting at this document,
        // get the next or prev 10 productos.
        const next = query(
          productosCollection,
          where("active", "==", true),
          orderBy("nombre_producto", order_by),
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
        productos.push({ ...doc.data(), id: doc.id });
      });
      return productos;
    } catch (err) {
      console.log(err.message);
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

// funcion para eliminar un producto
export const eliminarProducto = createAsyncThunk(
  "producto/eliminarProducto",
  async (producto_id, { dispatch, rejectWithValue }) => {
    console.log("pase aqui");
    try {
      const docRef = doc(db, "residuos", producto_id);

      const updateTimestamp = updateDoc(docRef, {
        active: false,
        updated_at: new Date(),
      });

      await toast.promise(updateTimestamp, {
        loading: "Eliminando...",
        success: "Residuo eliminado",
        error: "Error al eliminar el residuo",
      });

      dispatch(resetPage());
      dispatch(getProductos({ isNextPage: false, isPrevPage: false }));

      return docRef;
    } catch (err) {
      console.log(err.message);
      return rejectWithValue(err);
    }
  }
);

// funcion para obtener un producto por id
export const getProducto = createAsyncThunk(
  "producto/getProducto",
  async (producto_id, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "residuos", producto_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          id: docSnap.id,
        };
      } else {
        toast.error("No se encontró el residuo");
        return rejectWithValue("No se encontró el residuo");
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// funcion para crear un producto
export const createProducto = createAsyncThunk(
  "producto/createProducto",
  async (params, { dispatch, rejectWithValue, getState }) => {
    try {
      const { onClose, reset, ...data } = params;

      // add uid to precios
      const preciosWithUid = data.residuos.map((precio) => {
        return { ...precio, id: uuidv4() };
      });

      // --- estados
      // generado       0
      // recolectado    1
      // finalizado     2
      // cancelado      3
      // no recolectado 4

      // obtener data de otra store de redux
      const { user } = getState().user;

      const new_producto = addDoc(collection(db, "residuos"), {
        ...data,
        residuos: preciosWithUid,
        active: true,
        estado: 0,
        created_at: new Date(),
        user: user?.uid,
      });

      await toast.promise(new_producto, {
        loading: "Creando...",
        success: "Residuo creado",
        error: "Error al crear el residuo",
      });

      dispatch(resetPage());
      dispatch(getProductos({ isNextPage: false, isPrevPage: false }));

      onClose();
      reset();

      return new_producto;
      return;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

// funcion para actualizar un producto
export const updateProducto = createAsyncThunk(
  "producto/updateProducto",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const { id, onClose, reset, ...data } = params;

      // add uid to precios
      const preciosWithUid = data.residuos.map((precio) => {
        return { ...precio, id: precio.id || uuidv4() };
      });

      const producto = updateDoc(doc(db, "residuos", id), {
        ...data,
        residuos: preciosWithUid,
        updated_at: new Date(),
      });

      await toast.promise(producto, {
        loading: "Actualizando...",
        success: "Residuo actualizado",
        error: "Error al actualizar el residuo",
      });

      onClose();
      reset();

      dispatch(resetPage());
      dispatch(getProductos({ isNextPage: false, isPrevPage: false }));

      return producto;
    } catch (err) {
      console.log(err.message);
      return rejectWithValue(err);
    }
  }
);
// -----------------------------------------Slice-----------------------------------------
export const productoSlice = createSlice({
  name: "producto",
  initialState: {
    productos: [],
    producto_selected: null,
    producto_data_update: null,
    error: null,
    loading_producto: false,
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

    // acttions Producto
    setProductoSelected: (state, action) => {
      state.producto_selected = action.payload;
    },

    // update state isUpdate
    setIsUpdate: (state, action) => {
      state.isUpdate = action.payload;
    },
  },

  extraReducers: {
    // get productos
    [getProductos.pending]: (state) => {
      state.loading_producto = true;
    },
    [getProductos.fulfilled]: (state, action) => {
      state.loading_producto = false;
      state.productos = action.payload;
    },
    [getProductos.rejected]: (state, action) => {
      state.loading_producto = false;
      state.error = action.payload;
    },

    // eliminar producto
    [eliminarProducto.pending]: (state, action) => {
      state.loading_producto = true;
    },
    [eliminarProducto.fulfilled]: (state, action) => {
      state.loading_producto = false;
    },
    [eliminarProducto.rejected]: (state, action) => {
      state.loading_producto = false;
      state.error = action.payload.message;
    },

    // get producto
    [getProducto.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [getProducto.fulfilled]: (state, action) => {
      state.producto_data_update = action.payload;
      state.loading_actions = false;
    },
    [getProducto.rejected]: (state, action) => {
      state.loading_actions = false;
      state.error = action.payload.message;
    },

    // create producto
    [createProducto.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [createProducto.fulfilled]: (state, action) => {
      state.loading_actions = false;
    },
    [createProducto.rejected]: (state, action) => {
      state.loading_actions = false;
      state.error = action.payload.message;
    },

    // update producto
    [updateProducto.pending]: (state, action) => {
      state.loading_actions = true;
    },
    [updateProducto.fulfilled]: (state, action) => {
      state.loading_actions = false;
    },
    [updateProducto.rejected]: (state, action) => {
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
  setProductoSelected,
  setIsUpdate,
} = productoSlice.actions;

// -----------------------------------------Selector-----------------------------------------
export const selectProductos = (state) => state.producto.productos;
export const selectLoadingProductos = (state) =>
  state.producto.loading_producto;
export const selectPage = (state) => state.producto.page;
export const selectProductoSelected = (state) =>
  state.producto.producto_selected;
export const loadingActions = (state) => state.producto.loading_actions;
export const selectProductoDataUpdate = (state) =>
  state.producto.producto_data_update;
export const selectIsUpdate = (state) => state.producto.isUpdate;

export default productoSlice.reducer;
