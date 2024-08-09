import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { db, deleteFiles, uploadFiles } from "../../firebase/config";
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
import { document_info } from "../../Utils/constants";

export const createProduct = createAsyncThunk(
  "product/createProduct",
  async (
    {
      product_name,
      product_code,
      description,
      show_in_ecommerce = true,
      price,
      tags = [],
      characteristics,
      id_categories,
      id_brands,
      id_variants,
      images,
      setImages,
      onClose,
      reset,
    },
    { dispatch, rejectWithValue }
  ) => {
    const slug = product_name
      .toLowerCase()
      .replace(/[!*'();:@&=+$,\/?%#\[\]]/g, "_");
    const search_name = product_name.toLowerCase();
    const _id_brands = id_brands?.id;
    const _id_categories = id_categories?.id;
    const _id_variants = id_variants?.id;

    try {
      const updateProductData = async () => {
        // upload images and get url images array
        const images_url = await uploadFiles(images, "products");
        await addDoc(collection(db, "products"), {
          ...document_info,
          product_name,
          product_code,
          description,
          images: images_url,
          show_in_ecommerce,
          price: {
            currency: "QTZ",
            value: price,
            discounted_value: 0,
            discount_percentage: 0,
            discounted: false,
            discounted_until: null,
            discounted_from: null,
            price_discounted: 0,
          },
          tags,
          slug,
          search_name,
          characteristics,
          id_categories: [_id_categories],
          categories: [id_categories],
          id_brands: [_id_brands],
          brands: [id_brands],
          id_variants: [_id_variants],
          variants: [id_variants],
          reviews: {
            rating: 0,
            count: 0,
            bayesian_avg: 0,
          },
          comments: [
            // {
            //   id: 1,
            //   rating: 4,
            //   comment: "Comentario 1",
            //   created_at: "2021-08-10T00:00:00.000000Z",
            //   updated_at: "2021-08-10T00:00:00.000000Z",
            //   user: {
            //     id: 1,
            //     name: "Usuario 1",
            //     email: "email@mail.com",
            //     email_verified_at: "2021-08-10T00:00:00.000000Z",
            //   },
            // },
          ],
          color: {
            // filter_group: "black;#333",
            // original_name: "black",
          },
        });
      };

      await toast.promise(updateProductData(), {
        loading: "Creando...",
        success: "Producto creado",
        error: "Error al crear el prodcuto",
      });

      dispatch(resetPage());
      dispatch(getProducts({ isNextPage: false, isPrevPage: false }));

      setImages([]);
      onClose();
      reset();

      return true;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

const getQuery = (productsCollection, search, sort = "asc") => {
  return query(
    productsCollection,
    where("active", "==", true),
    search
      ? where("product_code", "==", search)
      : orderBy("product_name", sort),
    limit(10)
  );
};

export const getProducts = createAsyncThunk(
  "product/getProducts",
  async (
    { isNextPage, isPrevPage, search = "" },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const products = [];

      const productsCollection = collection(db, "products");
      const {
        lastVisible,
        firstVisible,
        products: _products,
      } = getState().product;

      let querySnapshot = null;

      if (!isNextPage && !isPrevPage) {
        const q = getQuery(productsCollection, search);
        querySnapshot = await getDocs(q);
      }

      if (_products.length === 0 && isPrevPage) {
        const q = getQuery(productsCollection, search, "desc");
        querySnapshot = await getDocs(q);
        dispatch(resetPage());
      }

      // Get the last visible document

      if ((isNextPage || isPrevPage) && _products.length !== 0) {
        const order_by = !isNextPage ? "desc" : "asc";
        // Construct a new query starting at this document,
        // get the next or prev 10 products.
        const next = query(
          productsCollection,
          where("active", "==", true),
          orderBy("product_name", order_by),
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
        products.push({ ...doc.data(), id: doc.id });
      });

      return products;
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

export const getProduct = createAsyncThunk(
  "product/getProduct",
  async (product_id, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "products", product_id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        // TODO populate example
        // const brand_id = String(docSnap.data().id_brands[0]);
        // const brandQuery = doc(db, "brands", brand_id);

        // const brandSnapshot = await getDoc(brandQuery);
        // const brandData = brandSnapshot.data();

        return {
          ...docSnap.data(),
          id: docSnap.id,
          price: docSnap.data().price?.value,
          discount_percentage: docSnap.data().price?.discount_percentage,
          discounted_value: docSnap.data().price?.discounted_value,
          discounted: docSnap.data().price?.discounted ? 1 : 0,
          price_discounted: docSnap.data().price?.price_discounted,
          // id_brands: brandData,
          discounted_from: docSnap.data().price?.discounted_from,
          discounted_until: docSnap.data().price?.discounted_until,
          id_brands: docSnap.data().brands,
          id_categories: docSnap.data().categories,
          id_variants: docSnap.data().variants,
        };
      } else {
        toast.error("No se encontró el prodcuto");
        return rejectWithValue("No se encontró el prodcuto");
      }
    } catch (err) {
      console.log(err);
      return rejectWithValue(err);
    }
  }
);

export const changeStateProduct = createAsyncThunk(
  "product/changeStateProduct",
  async ({ product_id }, { dispatch, rejectWithValue }) => {
    try {
      const docRef = doc(db, "products", product_id);

      const updateTimestamp = updateDoc(docRef, {
        active: false,
        updated_at: new Date(),
      });

      await toast.promise(updateTimestamp, {
        loading: "Eliminando...",
        success: "Producto eliminado",
        error: "Error al eliminar el prodcuto",
      });

      dispatch(resetPage());
      dispatch(getProducts({ isNextPage: false, isPrevPage: false }));

      return docRef;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateProduct = createAsyncThunk(
  "product/updateProduct",
  async (
    {
      id,
      product_name,
      product_code,
      description,
      show_in_ecommerce = true,
      price,
      tags = [],
      characteristics,
      id_categories,
      id_brands,
      id_variants,
      images,
      imagesToDelete,
      setImages,
      setImagesToDelete,
      onClose,
      reset,
    },
    { dispatch, rejectWithValue }
  ) => {
    const slug = product_name
      .toLowerCase()
      .replace(/[!*'();:@&=+$,\/?%#\[\]]/g, "_");
    const search_name = product_name.toLowerCase();
    const _id_brands = Array.isArray(id_brands)
      ? id_brands[0].id
      : id_brands?.id;
    const _id_categories = Array.isArray(id_categories)
      ? id_categories[0].id
      : id_categories?.id;
    const _id_variants = Array.isArray(id_variants)
      ? id_variants[0].id
      : id_variants?.id;

    try {
      // upload images and get url images array and update images product
      const updateProductData = async () => {
        const images_url = await uploadFiles(images, "products");
        if (imagesToDelete.length > 0)
          await deleteFiles(imagesToDelete, "products");

        await updateDoc(doc(db, "products", id), {
          product_name,
          product_code,
          description,
          show_in_ecommerce,
          images: images_url,
          tags,
          slug,
          search_name,
          characteristics,
          price,
          id_categories: [_id_categories],
          categories: Array.isArray(id_categories)
            ? id_categories
            : [id_categories],
          id_brands: [_id_brands],
          brands: Array.isArray(id_brands) ? id_brands : [id_brands],
          id_variants: [_id_variants],
          variants: Array.isArray(id_variants) ? id_variants : [id_variants],
          updated_at: new Date(),
        });
      };

      await toast.promise(updateProductData(), {
        loading: "Actualizando...",
        success: "Producto actualizado",
        error: "Error al actualizar el prodcuto",
      });

      // reset images state
      setImages([]);
      setImagesToDelete([]);
      onClose();
      reset();

      dispatch(resetPage());
      dispatch(getProducts({ isNextPage: false, isPrevPage: false }));

      return true;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// update discount product
export const updateDiscountProduct = createAsyncThunk(
  "product/updateDiscountProduct",
  async (
    {
      price,
      discounted_from,
      discounted_until,
      id,
      discount_percentage,
      discounted_value,
      discounted,
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const updateProductData = async () => {
        await updateDoc(doc(db, "products", id), {
          price: {
            value: price,
            currency: "QTZ",
            discounted_value: discounted_value,
            discount_percentage: discount_percentage,
            discounted: discounted,
            discounted_until: discounted_until,
            discounted_from: discounted_from,
            price_discounted: price - discounted_value,
          },
          updated_at: new Date(),
        });
      };

      await toast.promise(updateProductData(), {
        loading: "Actualizando...",
        success: "Producto actualizado",
        error: "Error al actualizar el prodcuto",
      });

      dispatch(resetPage());
      dispatch(getProducts({ isNextPage: false, isPrevPage: false }));

      return true;
    } catch (err) {
      console.log(err);
      return rejectWithValue(err);
    }
  }
);

export const productSlice = createSlice({
  name: "product",
  initialState: {
    product: null,
    products: [],
    product_data_update: null,
    product_selected: null,
    loading: false,
    loading_product: false,
    loading_update_product: false,
    loading_save_product: false,
    isUpdate: false,
    error: null,
    firstVisible: null,
    lastVisible: null,
    page: 1,
  },
  reducers: {
    login: (state, action) => {
      state.product = action.payload;
    },
    logout: (state) => {
      state.product = null;
    },
    setIsUpdate: (state, action) => {
      state.isUpdate = action.payload;
    },
    setProductSelected: (state, action) => {
      state.product_selected = action.payload;
    },

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
    [createProduct.pending]: (state) => {
      state.loading = true;
    },
    [createProduct.fulfilled]: (state, action) => {
      state.loading = false;
      // state.product = action.payload;
    },
    [createProduct.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    [getProducts.pending]: (state) => {
      state.loading_product = true;
    },
    [getProducts.fulfilled]: (state, action) => {
      state.loading_product = false;
      state.products = action.payload;
    },
    [getProducts.rejected]: (state, action) => {
      state.loading_product = false;
      state.error = action.payload;
    },

    [getProduct.pending]: (state, action) => {
      state.loading_update_product = true;
    },
    [getProduct.fulfilled]: (state, action) => {
      state.loading_update_product = false;
      state.product_data_update = action.payload;
    },
    [getProduct.rejected]: (state, action) => {
      state.loading_update_product = false;
      state.error = action.payload.message;
    },

    [changeStateProduct.pending]: (state, action) => {
      state.loading_product = true;
    },
    [changeStateProduct.fulfilled]: (state, action) => {
      state.loading_product = false;
    },
    [changeStateProduct.rejected]: (state, action) => {
      state.loading_product = false;
      state.error = action.payload.message;
    },

    [updateProduct.pending]: (state, action) => {
      state.loading_save_product = true;
    },
    [updateProduct.fulfilled]: (state, action) => {
      state.loading_save_product = false;
    },
    [updateProduct.rejected]: (state, action) => {
      state.loading_save_product = false;
      state.error = action.payload.message;
    },
  },
});

export const {
  login,
  logout,
  setIsUpdate,
  setProductSelected,
  nextPage,
  prevPage,
  setFirstVisible,
  setLastVisible,
  resetPage,
} = productSlice.actions;

// selectors
export const selectProduct = (state) => state.product.product;
export const selectLoading = (state) => state.product.loading;
export const selectProducts = (state) => state.product.products;
export const selectLoadingProducts = (state) => state.product.loading_product;
export const selectProductDataUpdate = (state) =>
  state.product.product_data_update;
export const selectLoadingupdateProduct = (state) =>
  state.product.loading_update_product;
export const selectProductSelected = (state) => state.product.product_selected;
export const selectPage = (state) => state.product.page;
export const selectIsUpdate = (state) => state.product.isUpdate;
export const selectLoadingSaveProduct = (state) =>
  state.product.loading_save_product;

export default productSlice.reducer;
