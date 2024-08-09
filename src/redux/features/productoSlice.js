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
import { validateImage, checkDuplicateValue } from "../../Utils/firebaseFunc";

// uuid
import { v4 as uuidv4 } from "uuid";

// -----------------------------------------Funciones-----------------------------------------

// Funcion para obtener la query global
const getQuery = (productosCollection, search, sort = "asc") => {
  return query(
    productosCollection,
    where("active", "==", true),
    where("buscar_nombre", ">=", search.toLowerCase()),
    where("buscar_nombre", "<=", search.toLowerCase() + "\uf8ff"),
    orderBy("buscar_nombre", sort),
    limit(10)
  );
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

      const productosCollection = collection(db, "productos");
      const {
        lastVisible,
        firstVisible,
        productos: _productos,
      } = getState().producto;

      let querySnapshot = null;

      if (!isNextPage && !isPrevPage) {
        const q = getQuery(productosCollection, search);
        querySnapshot = await getDocs(q);
      }

      if (_productos.length === 0 && isPrevPage) {
        const q = getQuery(productosCollection, search, "desc");
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
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

// funcion para eliminar un producto
export const eliminarProducto = createAsyncThunk(
  "producto/eliminarProducto",
  async (producto_id, { dispatch, rejectWithValue }) => {
    try {
      const docRef = doc(db, "productos", producto_id);

      const updateTimestamp = updateDoc(docRef, {
        active: false,
        updated_at: new Date(),
      });

      await toast.promise(updateTimestamp, {
        loading: "Eliminando...",
        success: "Producto eliminado",
        error: "Error al eliminar el producto",
      });

      dispatch(resetPage());
      dispatch(getProductos({ isNextPage: false, isPrevPage: false }));

      return docRef;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// funcion para obtener un producto por id
export const getProducto = createAsyncThunk(
  "producto/getProducto",
  async (producto_id, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "productos", producto_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const tagsFormated = [];

        docSnap.data()?.tags &&
          docSnap.data().tags.map((tag) => {
            tagsFormated.push({ value: tag, label: tag });
          });

        return {
          ...docSnap.data(),
          id: docSnap.id,
          tags: tagsFormated,
        };
      } else {
        toast.error("No se encontró el producto");
        return rejectWithValue("No se encontró el producto");
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// funcion para crear un producto
export const createProducto = createAsyncThunk(
  "producto/createProducto",
  async (params, { dispatch, rejectWithValue }) => {
    try {
      const { onClose, reset, ...data } = params;

      const { imagen_miniatura, imagen_portada, nombre_producto } = data;

      // add uid to precios
      const preciosWithUid = data.precios.map((precio) => {
        return { ...precio, id: uuidv4() };
      });

      const buscar_nombre = nombre_producto.toLowerCase();

      const isDuplicate = await checkDuplicateValue(
        "productos",
        "nombre_producto",
        nombre_producto
      );

      if (isDuplicate) {
        toast.error("Nombre del producto duplicado");
        return rejectWithValue("Producto duplicado");
      }

      const slug = nombre_producto
        .toLowerCase()
        .replace(/[!*'();:@&=+$,\/?%#\[\] ]/g, "_");

      const images_url = await uploadFiles(imagen_miniatura, "productos");
      const images_url_portada = await uploadFiles(imagen_portada, "productos");

      const new_producto = addDoc(collection(db, "productos"), {
        ...document_info,
        ...data,
        precios: preciosWithUid,
        slug,
        imagen_miniatura: images_url,
        imagen_portada: images_url_portada,
        buscar_nombre,
        cantidad_vendidos: 0,
      });

      await toast.promise(new_producto, {
        loading: "Creando...",
        success: "Producto creado",
        error: "Error al crear el producto",
      });

      dispatch(resetPage());
      dispatch(getProductos({ isNextPage: false, isPrevPage: false }));

      onClose();
      reset();

      return new_producto;
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

      const { imagen_miniatura, imagen_portada, nombre_producto, precios } =
        data;

      // add uid to precios
      const preciosWithUid = precios.map((precio) => {
        return { ...precio, id: precio.id || uuidv4() };
      });

      const buscar_nombre = nombre_producto.toLowerCase();

      const isDuplicate = await checkDuplicateValue(
        "productos",
        "nombre_producto",
        nombre_producto,
        id
      );

      if (isDuplicate) {
        toast.error("Nombre del producto duplicado");
        return rejectWithValue("Producto duplicado");
      }

      const slug = nombre_producto
        .toLowerCase()
        .replace(/[!*'();:@&=+$,\/?%#\[\] ]/g, "_");

      // Verificar si la imagen del producto ha cambiado
      const images_url = await validateImage(
        id,
        imagen_miniatura,
        "imagen_miniatura",
        "productos"
      );

      const images_url_portada = await validateImage(
        id,
        imagen_portada,
        "imagen_portada",
        "productos"
      );

      const producto = updateDoc(doc(db, "productos", id), {
        ...data,
        slug,
        precios: preciosWithUid,
        updated_at: new Date(),
        imagen_miniatura: images_url,
        imagen_portada: images_url_portada,
        buscar_nombre,
      });

      await toast.promise(producto, {
        loading: "Actualizando...",
        success: "Producto actualizado",
        error: "Error al actualizar el Producto",
      });

      onClose();
      reset();

      dispatch(resetPage());
      dispatch(getProductos({ isNextPage: false, isPrevPage: false }));

      return producto;
    } catch (err) {
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
