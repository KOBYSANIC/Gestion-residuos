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

export const createCategory = createAsyncThunk(
  "category/createCategory",
  async (
    { category_name, description, show_in_ecommerce = true, onClose, reset },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const slug = category_name.toLowerCase().replace(/ /g, "_");
      const new_category = addDoc(collection(db, "categories"), {
        ...document_info,
        category_name,
        description,
        show_in_ecommerce,
        slug,
      });

      await toast.promise(new_category, {
        loading: "Creando...",
        success: "Categoria creada",
        error: "Error al crear la categoria",
      });

      dispatch(resetPage());
      dispatch(getCategories({ isNextPage: false, isPrevPage: false }));

      onClose();
      reset();

      return new_category;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

const getQuery = (categoriesCollection, search, sort = "asc") => {
  return query(
    categoriesCollection,
    where("active", "==", true),
    search
      ? where("category_name", "==", search)
      : orderBy("category_name", sort),
    limit(10)
  );
};

export const getCategories = createAsyncThunk(
  "category/getCategories",
  async (
    { search, isNextPage, isPrevPage },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const categories = [];

      const categoriesCollection = collection(db, "categories");
      const {
        lastVisible,
        firstVisible,
        categories: _categories,
      } = getState().category;

      let querySnapshot = null;

      if (!isNextPage && !isPrevPage) {
        const q = getQuery(categoriesCollection, search);
        querySnapshot = await getDocs(q);
      }

      if (_categories.length === 0 && isPrevPage) {
        const q = getQuery(categoriesCollection, search, "desc");
        querySnapshot = await getDocs(q);
        dispatch(resetPage());
      }

      // Get the last visible document

      if ((isNextPage || isPrevPage) && _categories.length !== 0) {
        const order_by = !isNextPage ? "desc" : "asc";
        // Construct a new query starting at this document,
        // get the next or prev 10 categories.
        const next = query(
          categoriesCollection,
          where("active", "==", true),
          orderBy("category_name", order_by),
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
        categories.push({ ...doc.data(), id: doc.id });
      });

      return categories;
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

export const getCategory = createAsyncThunk(
  "category/getCategory",
  async (category_id, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "categories", category_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          id: docSnap.id,
          // event_state: event_states[2],
        };
      } else {
        toast.error("No se encontró la categoria");
        return rejectWithValue("No se encontró la categoria");
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const changeStateCategory = createAsyncThunk(
  "category/changeStateCategory",
  async ({ category_id }, { dispatch, rejectWithValue }) => {
    try {
      const docRef = doc(db, "categories", category_id);

      const updateTimestamp = updateDoc(docRef, {
        active: false,
        updated_at: new Date(),
      });

      await toast.promise(updateTimestamp, {
        loading: "Eliminando...",
        success: "Categoria eliminada",
        error: "Error al eliminar la categoria",
      });

      dispatch(resetPage());
      dispatch(getCategories({ isNextPage: false, isPrevPage: false }));

      return docRef;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "category/updateCategory",
  async (
    {
      id,
      category_name,
      description,
      show_in_ecommerce = true,
      onClose,
      reset,
    },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const slug = category_name.toLowerCase().replace(/ /g, "_");
      const category = updateDoc(doc(db, "categories", id), {
        category_name,
        description,
        show_in_ecommerce,
        slug,
        updated_at: new Date(),
      });

      await toast.promise(category, {
        loading: "Actualizando...",
        success: "Categoria actualizada",
        error: "Error al actualizar la categoria",
      });

      onClose();
      reset();

      dispatch(resetPage());
      dispatch(getCategories({ isNextPage: false, isPrevPage: false }));

      return category;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const categorySlice = createSlice({
  name: "category",
  initialState: {
    category: null,
    categories: [],
    category_data_update: null,
    category_selected: null,
    loading: false,
    loading_category: false,
    loading_update_category: false,
    loading_save_category: false,
    isUpdate: false,
    error: null,
    firstVisible: null,
    lastVisible: null,
    page: 1,
  },
  reducers: {
    login: (state, action) => {
      state.category = action.payload;
    },
    logout: (state) => {
      state.category = null;
    },
    setIsUpdate: (state, action) => {
      state.isUpdate = action.payload;
    },
    setCategorySelected: (state, action) => {
      state.category_selected = action.payload;
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
    [createCategory.pending]: (state) => {
      state.loading = true;
    },
    [createCategory.fulfilled]: (state, action) => {
      state.loading = false;
      // state.category = action.payload;
    },
    [createCategory.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    [getCategories.pending]: (state) => {
      state.loading_category = true;
    },
    [getCategories.fulfilled]: (state, action) => {
      state.loading_category = false;
      state.categories = action.payload;
    },
    [getCategories.rejected]: (state, action) => {
      state.loading_category = false;
      state.error = action.payload;
    },

    [getCategory.pending]: (state, action) => {
      state.loading_update_category = true;
    },
    [getCategory.fulfilled]: (state, action) => {
      state.loading_update_category = false;
      state.category_data_update = action.payload;
    },
    [getCategory.rejected]: (state, action) => {
      state.loading_update_category = false;
      state.error = action.payload.message;
    },

    [changeStateCategory.pending]: (state, action) => {
      state.loading_category = true;
    },
    [changeStateCategory.fulfilled]: (state, action) => {
      state.loading_category = false;
    },
    [changeStateCategory.rejected]: (state, action) => {
      state.loading_category = false;
      state.error = action.payload.message;
    },

    [updateCategory.pending]: (state, action) => {
      state.loading_save_category = true;
    },
    [updateCategory.fulfilled]: (state, action) => {
      state.loading_save_category = false;
    },
    [updateCategory.rejected]: (state, action) => {
      state.loading_save_category = false;
      state.error = action.payload.message;
    },
  },
});

export const {
  login,
  logout,
  setIsUpdate,
  setCategorySelected,
  nextPage,
  prevPage,
  setFirstVisible,
  setLastVisible,
  resetPage,
} = categorySlice.actions;

// selectors
export const selectCategory = (state) => state.category.category;
export const selectLoading = (state) => state.category.loading;
export const selectCategories = (state) => state.category.categories;
export const selectLoadingCategories = (state) =>
  state.category.loading_category;
export const selectCategoryDataUpdate = (state) =>
  state.category.category_data_update;
export const selectLoadingupdateCategory = (state) =>
  state.category.loading_update_category;
export const selectCategorySelected = (state) =>
  state.category.category_selected;
export const selectPage = (state) => state.category.page;
export const selectIsUpdate = (state) => state.category.isUpdate;
export const selectLoadingSaveCategory = (state) =>
  state.category.loading_save_category;

export default categorySlice.reducer;
