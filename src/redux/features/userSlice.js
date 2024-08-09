import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import {
  auth,
  createUserWithEmailAndPassword,
  db,
  signInWithEmailAndPassword,
} from "../../firebase/config";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";

import { user_status_select, user_role_select } from "../../Utils/constants";

import toast from "react-hot-toast";
import { ADMINISTRADOR, VENDEDOR } from "../../Utils/constants";

export const loginToApp = createAsyncThunk(
  "user/loginToApp",
  async ({ email, password }, { dispatch, rejectWithValue }) => {
    try {
      const user_auth = await signInWithEmailAndPassword(auth, email, password);

      const docRef = doc(db, "users", user_auth.user.uid);

      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const role = docSnap.data().role;
        if (![ADMINISTRADOR, VENDEDOR].includes(role)) {
          toast.error("Lo sentimos, no tienes acceso a esta aplicación");
          auth.signOut();
          dispatch(logout());
          return rejectWithValue("No tienes acceso a esta aplicación");
        }
        if (docSnap.data().active) {
          return {
            email: user_auth.user.email,
            uid: user_auth.user.uid,
            displayName: user_auth.user.displayName,
            photoUrl: user_auth.user.photoURL,
            ...docSnap.data(),
          };
        } else {
          toast.error("Lo sentimos, tu cuenta ha sido desactivada");
          auth.signOut();
          dispatch(logout());
        }
      } else {
        toast.error("No se encontró el usuario");
        auth.signOut();
        dispatch(logout());
      }
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (
    { email, password, user_name, user_role, onClose, reset },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const user_auth = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const buscar_correo = email.toLowerCase();

      const buscar_user_name = user_name.toLowerCase();

      const new_user = setDoc(doc(db, "users", user_auth.user.uid), {
        user_name: user_name,
        email: user_auth.user.email,
        role: user_role?.value,
        active: true,
        created_at: new Date(),
        updated_at: new Date(),
        typed: "email",
        buscar_correo,
        buscar_user_name,
      });

      await toast.promise(new_user, {
        loading: "Creando...",
        success: "Usuario creado",
        error: "Error al crear el usuario",
      });

      onClose();
      reset();

      return new_user;
    } catch (err) {
      toast.error(err.message);
      return rejectWithValue(err);
    } finally {
      auth.signOut();
      dispatch(logout());
    }
  }
);

const getQuery = (usersCollection, search = "", sort = "asc") => {
  return query(
    usersCollection,
    where("buscar_correo", ">=", search.toLowerCase()),
    where("buscar_correo", "<=", search.toLowerCase() + "\uf8ff"),
    orderBy("buscar_correo", sort),
    limit(10)
  );
};

export const getUsers = createAsyncThunk(
  "user/getUsers",
  async (
    { isNextPage, isPrevPage, search },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const users = [];

      const usersCollection = collection(db, "users");
      const { lastVisible, firstVisible, users: _users } = getState().user;
      let querySnapshot = null;

      if (!isNextPage && !isPrevPage) {
        const q = getQuery(usersCollection, search);
        querySnapshot = await getDocs(q);
      }

      if (_users.length === 0 && isPrevPage) {
        const q = getQuery(usersCollection, search, "desc");
        querySnapshot = await getDocs(q);
        dispatch(resetPage());
      }

      // Get the last visible document

      if ((isNextPage || isPrevPage) && _users.length !== 0) {
        const order_by = !isNextPage ? "desc" : "asc";
        // Construct a new query starting at this document,
        // get the next or prev 10 events.
        const next = query(
          usersCollection,
          orderBy("user_name", order_by),
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
        users.push({ ...doc.data(), id: doc.id });
      });
      return users;
    } catch (err) {
      console.log(err);
      toast.error(err.message);
      return rejectWithValue(err);
    }
  }
);

export const getUser = createAsyncThunk(
  "event/getUser",
  async (user_id, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "users", user_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          id: docSnap.id,
          user_role: user_role_select[docSnap.data().role],
          active: user_status_select[docSnap.data().active],
          // event_state: event_states[2],
        };
      } else {
        toast.error("No se encontró el usuario");
        return rejectWithValue("No se encontró el usuario");
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const changeStateUser = createAsyncThunk(
  "event/changeStateUser",
  async ({ user_id }, { dispatch, rejectWithValue }) => {
    try {
      const docRef = doc(db, "users", user_id);

      const updateTimestamp = updateDoc(docRef, {
        active: false,
        updated_at: new Date(),
      });

      await toast.promise(updateTimestamp, {
        loading: "Inactivando Usuario...",
        success: "El usuario ha sido desactivado",
        error: "Error al inactivar al usuario",
      });

      dispatch(resetPage());
      dispatch(getUsers({ isNextPage: false, isPrevPage: false }));

      return docRef;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateUser = createAsyncThunk(
  "event/updateUser",
  async (
    { id, user_name, user_role, active, onClose, reset },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const buscar_user_name = user_name.toLowerCase();

      const user = updateDoc(doc(db, "users", id), {
        user_name: user_name,
        role: user_role?.value,
        active: active?.value,
        updated_at: new Date(),
        buscar_user_name,
      });

      await toast.promise(user, {
        loading: "Actualizando...",
        success: "Usuario actualizado",
        error: "Error al actualizar el usuario",
      });

      onClose();
      reset();

      dispatch(resetPage());
      dispatch(getUsers({ isNextPage: false, isPrevPage: false }));

      return user;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    users: [],
    user_data_update: null,
    user_selected: null,
    loading: false,
    loading_users: false,
    loading_update_user: false,
    loading_save_user: false,
    isUpdate: false,
    error: null,
    firstVisible: null,
    lastVisible: null,
    page: 1,
  },
  reducers: {
    login: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
    setIsUpdate: (state, action) => {
      state.isUpdate = action.payload;
    },
    setUserSelected: (state, action) => {
      state.user_selected = action.payload;
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
    [loginToApp.pending]: (state) => {
      state.loading = true;
    },
    [loginToApp.fulfilled]: (state, action) => {
      state.loading = false;
      state.user = action.payload;
    },
    [loginToApp.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    [createUser.pending]: (state) => {
      state.loading = true;
    },
    [createUser.fulfilled]: (state, action) => {
      state.loading = false;
      // state.user = action.payload;
    },
    [createUser.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    [getUsers.pending]: (state) => {
      state.loading_users = true;
    },
    [getUsers.fulfilled]: (state, action) => {
      state.loading_users = false;
      state.users = action.payload;
    },
    [getUsers.rejected]: (state, action) => {
      state.loading_users = false;
      state.error = action.payload;
    },

    [getUser.pending]: (state, action) => {
      state.loading_update_user = true;
    },
    [getUser.fulfilled]: (state, action) => {
      state.loading_update_user = false;
      state.user_data_update = action.payload;
    },
    [getUser.rejected]: (state, action) => {
      state.loading_update_user = false;
      state.error = action.payload.message;
    },

    [changeStateUser.pending]: (state, action) => {
      state.loading_users = true;
    },
    [changeStateUser.fulfilled]: (state, action) => {
      state.loading_users = false;
    },
    [changeStateUser.rejected]: (state, action) => {
      state.loading_users = false;
      state.error = action.payload.message;
    },

    [updateUser.pending]: (state, action) => {
      state.loading_save_user = true;
    },
    [updateUser.fulfilled]: (state, action) => {
      state.loading_save_user = false;
    },
    [updateUser.rejected]: (state, action) => {
      state.loading_save_user = false;
      state.error = action.payload.message;
    },
  },
});

export const {
  login,
  logout,
  setIsUpdate,
  setUserSelected,
  nextPage,
  prevPage,
  setFirstVisible,
  setLastVisible,
  resetPage,
} = userSlice.actions;

// selectors
export const selectUser = (state) => state.user.user;
export const selectLoading = (state) => state.user.loading;
export const selectUsers = (state) => state.user.users;
export const selectLoadingUsers = (state) => state.user.loading_users;
export const selectUserDataUpdate = (state) => state.user.user_data_update;
export const selectLoadingUpdateUser = (state) =>
  state.user.loading_update_user;
export const selectUserSelected = (state) => state.user.user_selected;
export const selectPage = (state) => state.user.page;
export const selectIsUpdate = (state) => state.user.isUpdate;
export const selectLoadingSaveUser = (state) => state.user.loading_save_user;

export default userSlice.reducer;
