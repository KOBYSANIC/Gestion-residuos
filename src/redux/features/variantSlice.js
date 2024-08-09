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

export const createVariant = createAsyncThunk(
  "variant/createVariant",
  async (
    { variant_name, title, description, onClose, reset },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const new_variant = addDoc(collection(db, "variants"), {
        ...document_info,
        variant_name,
        title,
        description,
      });

      await toast.promise(new_variant, {
        loading: "Creando...",
        success: "Variación creada",
        error: "Error al crear la variación",
      });

      dispatch(resetPage());
      dispatch(getVariants({ isNextPage: false, isPrevPage: false }));

      onClose();
      reset();

      return new_variant;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

const getQuery = (variantsCollection, sort = "asc") => {
  return query(
    variantsCollection,
    where("active", "==", true),
    orderBy("created_at", sort),
    limit(10)
  );
};

export const getVariants = createAsyncThunk(
  "variant/getVariants",
  async (
    { isNextPage, isPrevPage },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const variants = [];

      const variantsCollection = collection(db, "variants");
      const {
        lastVisible,
        firstVisible,
        variants: _variants,
      } = getState().variant;

      let querySnapshot = null;
      if (!isNextPage && !isPrevPage) {
        const q = getQuery(variantsCollection);
        querySnapshot = await getDocs(q);
      }

      if (_variants.length === 0 && isPrevPage) {
        const q = getQuery(variantsCollection, "desc");
        querySnapshot = await getDocs(q);
        dispatch(resetPage());
      }

      // Get the last visible document

      if ((isNextPage || isPrevPage) && _variants.length !== 0) {
        const order_by = !isNextPage ? "desc" : "asc";
        // Construct a new query starting at this document,
        // get the next or prev 10 variants.
        const next = query(
          variantsCollection,
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
        variants.push({ ...doc.data(), id: doc.id });
      });

      return variants;
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

export const getVariant = createAsyncThunk(
  "variant/getVariant",
  async (variant_id, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "variants", variant_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          id: docSnap.id,
          // event_state: event_states[2],
        };
      } else {
        toast.error("No se encontró la variación");
        return rejectWithValue("No se encontró la variación");
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const changeStateVariant = createAsyncThunk(
  "variant/changeStateVariant",
  async ({ variant_id }, { dispatch, rejectWithValue }) => {
    try {
      const docRef = doc(db, "variants", variant_id);

      const updateTimestamp = updateDoc(docRef, {
        active: false,
        updated_at: new Date(),
      });

      await toast.promise(updateTimestamp, {
        loading: "Eliminando...",
        success: "Variación eliminada",
        error: "Error al eliminar la variación",
      });

      dispatch(resetPage());
      dispatch(getVariants({ isNextPage: false, isPrevPage: false }));

      return docRef;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateVariant = createAsyncThunk(
  "variant/updateVariant",
  async (
    { id, variant_name, title, description, onClose, reset },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const variant = updateDoc(doc(db, "variants", id), {
        variant_name,
        title,
        description,
        updated_at: new Date(),
      });

      await toast.promise(variant, {
        loading: "Actualizando...",
        success: "Variación actualizada",
        error: "Error al actualizar la variación",
      });

      onClose();
      reset();

      dispatch(resetPage());
      dispatch(getVariants({ isNextPage: false, isPrevPage: false }));

      return variant;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const variantSlice = createSlice({
  name: "variant",
  initialState: {
    variant: null,
    variants: [],
    variant_data_update: null,
    variant_selected: null,
    loading: false,
    loading_variant: false,
    loading_update_variant: false,
    loading_save_variant: false,
    isUpdate: false,
    error: null,
    firstVisible: null,
    lastVisible: null,
    page: 1,
  },
  reducers: {
    login: (state, action) => {
      state.variant = action.payload;
    },
    logout: (state) => {
      state.variant = null;
    },
    setIsUpdate: (state, action) => {
      state.isUpdate = action.payload;
    },
    setVariantSelected: (state, action) => {
      state.variant_selected = action.payload;
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
    [createVariant.pending]: (state) => {
      state.loading = true;
    },
    [createVariant.fulfilled]: (state, action) => {
      state.loading = false;
      // state.variant = action.payload;
    },
    [createVariant.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    [getVariants.pending]: (state) => {
      state.loading_variant = true;
    },
    [getVariants.fulfilled]: (state, action) => {
      state.loading_variant = false;
      state.variants = action.payload;
    },
    [getVariants.rejected]: (state, action) => {
      state.loading_variant = false;
      state.error = action.payload;
    },

    [getVariant.pending]: (state, action) => {
      state.loading_update_variant = true;
    },
    [getVariant.fulfilled]: (state, action) => {
      state.loading_update_variant = false;
      state.variant_data_update = action.payload;
    },
    [getVariant.rejected]: (state, action) => {
      state.loading_update_variant = false;
      state.error = action.payload.message;
    },

    [changeStateVariant.pending]: (state, action) => {
      state.loading_variant = true;
    },
    [changeStateVariant.fulfilled]: (state, action) => {
      state.loading_variant = false;
    },
    [changeStateVariant.rejected]: (state, action) => {
      state.loading_variant = false;
      state.error = action.payload.message;
    },

    [updateVariant.pending]: (state, action) => {
      state.loading_save_variant = true;
    },
    [updateVariant.fulfilled]: (state, action) => {
      state.loading_save_variant = false;
    },
    [updateVariant.rejected]: (state, action) => {
      state.loading_save_variant = false;
      state.error = action.payload.message;
    },
  },
});

export const {
  login,
  logout,
  setIsUpdate,
  setVariantSelected,
  nextPage,
  prevPage,
  setFirstVisible,
  setLastVisible,
  resetPage,
} = variantSlice.actions;

// selectors
export const selectVariant = (state) => state.variant.variant;
export const selectLoading = (state) => state.variant.loading;
export const selectVariants = (state) => state.variant.variants;
export const selectLoadingVariants = (state) => state.variant.loading_variant;
export const selectVariantDataUpdate = (state) =>
  state.variant.variant_data_update;
export const selectLoadingupdateVariant = (state) =>
  state.variant.loading_update_variant;
export const selectVariantSelected = (state) => state.variant.variant_selected;
export const selectPage = (state) => state.variant.page;
export const selectIsUpdate = (state) => state.variant.isUpdate;
export const selectLoadingSaveVariant = (state) =>
  state.variant.loading_save_variant;

export default variantSlice.reducer;
