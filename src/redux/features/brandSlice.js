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
import { document_info } from "../../Utils/constants";

export const createBrand = createAsyncThunk(
  "brand/createBrand",
  async (
    { brand_name, description, onClose, reset },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const slug = brand_name.toLowerCase().replace(/ /g, "_");
      const new_brand = addDoc(collection(db, "brands"), {
        ...document_info,
        brand_name,
        description,
        slug,
      });

      await toast.promise(new_brand, {
        loading: "Creando...",
        success: "Marca creada",
        error: "Error al crear la marca",
      });

      dispatch(resetPage());
      dispatch(getBrands({ isNextPage: false, isPrevPage: false }));

      onClose();
      reset();

      return new_brand;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

const getQuery = (brandsCollection, search, sort = "asc") => {
  return query(
    brandsCollection,
    where("active", "==", true),
    search
      ? where("brand_name", "==", search)
      : orderBy("brand_name", sort),
    limit(10)
  );
};

export const getBrands = createAsyncThunk(
  "brand/getBrands",
  async (
    { search, isNextPage, isPrevPage },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const brandsCollection = collection(db, "brands");
      // Get the last visible document
      const { lastVisible, firstVisible, brands: _brands } = getState().brand;

      let querySnapshot = null;
      if (!isNextPage && !isPrevPage) {
        const q = getQuery(brandsCollection, search);
        querySnapshot = await getDocs(q);
      }

      if (_brands.length === 0 && isPrevPage) {
        const q = getQuery(brandsCollection, search, "desc");
        querySnapshot = await getDocs(q);
        dispatch(resetPage());
      }

      if ((isNextPage || isPrevPage) && _brands.length !== 0) {
        const order_by = !isNextPage ? "desc" : "asc";
        // Construct a new query starting at this document,
        // get the next or prev 10 brands.
        const next = query(
          brandsCollection,
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

      const brands = [];
      querySnapshot.forEach((doc) => {
        brands.push({ ...doc.data(), id: doc.id });
      });

      return brands;
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

export const getBrand = createAsyncThunk(
  "brand/getBrand",
  async (brand_id, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "brands", brand_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          id: docSnap.id,
          // event_state: event_states[2],
        };
      } else {
        toast.error("No se encontró la marca");
        return rejectWithValue("No se encontró la marca");
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const changeStateBrand = createAsyncThunk(
  "brand/changeStateBrand",
  async ({ brand_id }, { dispatch, rejectWithValue }) => {
    try {
      const docRef = doc(db, "brands", brand_id);

      const updateTimestamp = updateDoc(docRef, {
        active: false,
        updated_at: new Date(),
      });

      await toast.promise(updateTimestamp, {
        loading: "Eliminando...",
        success: "Marca eliminada",
        error: "Error al eliminar la marca",
      });

      dispatch(resetPage());
      dispatch(getBrands({ isNextPage: false, isPrevPage: false }));

      return docRef;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateBrand = createAsyncThunk(
  "brand/updateBrand",
  async (
    { id, brand_name, description, onClose, reset },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const slug = brand_name.toLowerCase().replace(/ /g, "_");
      const brand = updateDoc(doc(db, "brands", id), {
        brand_name,
        description,
        slug,
        updated_at: new Date(),
      });

      await toast.promise(brand, {
        loading: "Actualizando...",
        success: "Marca actualizada",
        error: "Error al actualizar la marca",
      });

      onClose();
      reset();

      dispatch(resetPage());
      dispatch(getBrands({ isNextPage: false, isPrevPage: false }));

      return brand;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const brandSlice = createSlice({
  name: "brand",
  initialState: {
    brand: null,
    brands: [],
    brand_data_update: null,
    brand_selected: null,
    loading: false,
    loading_brand: false,
    loading_update_brand: false,
    loading_save_brand: false,
    isUpdate: false,
    firstVisible: null,
    lastVisible: null,
    error: null,
    page: 1,
  },
  reducers: {
    login: (state, action) => {
      state.brand = action.payload;
    },
    logout: (state) => {
      state.brand = null;
    },
    setIsUpdate: (state, action) => {
      state.isUpdate = action.payload;
    },
    setBrandSelected: (state, action) => {
      state.brand_selected = action.payload;
    },
    nextPage: (state) => {
      state.page += 1;
    },
    prevPage: (state) => {
      state.page -= 1;
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
    [createBrand.pending]: (state) => {
      state.loading = true;
    },
    [createBrand.fulfilled]: (state, action) => {
      state.loading = false;
      // state.brand = action.payload;
    },
    [createBrand.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    [getBrands.pending]: (state) => {
      state.loading_brand = true;
    },
    [getBrands.fulfilled]: (state, action) => {
      state.loading_brand = false;
      state.brands = action.payload;
    },
    [getBrands.rejected]: (state, action) => {
      state.loading_brand = false;
      state.error = action.payload;
    },

    [getBrand.pending]: (state, action) => {
      state.loading_update_brand = true;
    },
    [getBrand.fulfilled]: (state, action) => {
      state.loading_update_brand = false;
      state.brand_data_update = action.payload;
    },
    [getBrand.rejected]: (state, action) => {
      state.loading_update_brand = false;
      state.error = action.payload.message;
    },

    [changeStateBrand.pending]: (state, action) => {
      state.loading_brand = true;
    },
    [changeStateBrand.fulfilled]: (state, action) => {
      state.loading_brand = false;
    },
    [changeStateBrand.rejected]: (state, action) => {
      state.loading_brand = false;
      state.error = action.payload.message;
    },

    [updateBrand.pending]: (state, action) => {
      state.loading_save_brand = true;
    },
    [updateBrand.fulfilled]: (state, action) => {
      state.loading_save_brand = false;
    },
    [updateBrand.rejected]: (state, action) => {
      state.loading_save_brand = false;
      state.error = action.payload.message;
    },
  },
});

export const {
  login,
  logout,
  setIsUpdate,
  setBrandSelected,
  nextPage,
  prevPage,
  setFirstVisible,
  setLastVisible,
  resetPage,
} = brandSlice.actions;

// selectors
export const selectBrand = (state) => state.brand.brand;
export const selectLoading = (state) => state.brand.loading;
export const selectBrands = (state) => state.brand.brands;
export const selectLoadingBrands = (state) => state.brand.loading_brand;
export const selectBrandDataUpdate = (state) => state.brand.brand_data_update;
export const selectLoadingupdateBrand = (state) =>
  state.brand.loading_update_brand;
export const selectBrandSelected = (state) => state.brand.brand_selected;
export const selectPage = (state) => state.brand.page;
export const selectIsUpdate = (state) => state.brand.isUpdate;
export const selectLoadingSaveBrand = (state) => state.brand.loading_save_brand;

export default brandSlice.reducer;
