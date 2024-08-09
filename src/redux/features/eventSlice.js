import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { db, deleteFiles, uploadFiles } from "../../firebase/config";
import {
  collection,
  addDoc,
  query,
  orderBy,
  getDocs,
  limit,
  updateDoc,
  doc,
  where,
  getDoc,
  startAfter,
} from "firebase/firestore";

import toast from "react-hot-toast";

import {
  CANCELADO,
  document_info,
  EN_RUTA,
  FINALIZADO,
  NO_APILCA,
  PROCESO,
} from "../../Utils/constants";

export const createEvent = createAsyncThunk(
  "event/createEvent",
  async (newEventData, { dispatch, rejectWithValue, getState }) => {
    try {
      const event_date = new Date(
        `${newEventData.event_start_date}T${newEventData.event_start_time}:00`
      );
      const user_state = getState().user.user;
      const uuid_user = user_state.uid;

      const images = newEventData.images;

      // delete data
      delete newEventData.images;
      delete newEventData.imagesToDelete;
      delete newEventData.setImages;
      delete newEventData.setImagesToDelete;

      const images_url = await uploadFiles(images, "events");
      const new_event = addDoc(collection(db, "events"), {
        ...newEventData,
        ...document_info,
        event_images: images_url,
        event_state: PROCESO,
        is_pay_on_site: newEventData.is_pay_on_site || NO_APILCA,
        event_date,
        user_id: uuid_user,
      });

      await toast.promise(new_event, {
        loading: "Creando...",
        success: "Evento creado",
        error: "Error al crear el evento",
      });

      dispatch(resetPage());
      dispatch(getEvents({ isNextPage: false, isPrevPage: false }));
      dispatch(getClosestEvents());

      return new_event;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const updateEvent = createAsyncThunk(
  "event/updateEvent",
  async (eventData, { dispatch, rejectWithValue }) => {
    try {
      const event_date = new Date(
        `${eventData.event_start_date}T${eventData.event_start_time}:00`
      );

      const images = eventData.images;
      const imagesToDelete = eventData.imagesToDelete;
      const isUpdate = true;

      // delete data
      delete eventData.images;
      delete eventData.imagesToDelete;
      delete eventData.setImages;
      delete eventData.setImagesToDelete;

      if (imagesToDelete.length > 0)
        await deleteFiles(imagesToDelete, "events");
      const images_url = await uploadFiles(images, "events", isUpdate);

      const event = updateDoc(doc(db, "events", eventData.id), {
        ...eventData,
        ...document_info,
        event_images: images_url,
        updated_at: new Date(),
        event_date,
      });

      await toast.promise(event, {
        loading: "Actualizando...",
        success: "Evento actualizado",
        error: "Error al actualizar el evento",
      });

      dispatch(resetPage());
      dispatch(getEvents({ isNextPage: false, isPrevPage: false }));
      dispatch(getClosestEvents());

      return event;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const getQuery = (eventsCollection, filters, sort = "desc") => {
  const {
    apply_filters,
    event_state,
    event_start_date_format,
    event_end_date_format,
  } = filters;
  return query(
    eventsCollection,

    apply_filters
      ? where("event_state", "==", event_state ? event_state : PROCESO)
      : where("event_state", "in", [PROCESO, EN_RUTA, FINALIZADO]),

    apply_filters
      ? where("event_date", ">=", event_start_date_format)
      : where("active", "==", true),

    apply_filters
      ? where("event_date", "<=", event_end_date_format)
      : where("active", "==", true),

    orderBy("event_date", sort),
    limit(10)
  );
};

export const getEvents = createAsyncThunk(
  "event/getEvents",
  async (
    { isNextPage, isPrevPage },
    { rejectWithValue, getState, dispatch }
  ) => {
    try {
      const { filters, apply_filters } = getState().event;
      const { event_state, event_start_date, event_end_date } = filters;
      // Get the last visible document
      const { lastVisible, firstVisible, events: _events } = getState().event;

      const event_start_date_format = new Date(`${event_start_date}T00:00:00`);
      const event_end_date_format = new Date(`${event_end_date}T23:59:59`);

      // Query the first page of docs
      const eventsCollection = collection(db, "events");
      let querySnapshot = null;

      const filters_query = {
        apply_filters,
        event_state,
        event_start_date_format,
        event_end_date_format,
      };

      if (!isNextPage && !isPrevPage) {
        const q = getQuery(eventsCollection, filters_query);
        querySnapshot = await getDocs(q);
      }

      if (_events.length === 0 && isPrevPage) {
        const q = getQuery(eventsCollection, filters_query, "asc");
        querySnapshot = await getDocs(q);
        dispatch(resetPage());
      }

      if ((isNextPage || isPrevPage) && _events.length !== 0) {
        const order_by = isNextPage ? "desc" : "asc";
        // Construct a new query starting at this document,
        // get the next or prev 10 events.
        const next = query(
          eventsCollection,

          apply_filters
            ? where("event_state", "==", event_state ? event_state : PROCESO)
            : where("event_state", "in", [PROCESO, EN_RUTA, FINALIZADO]),

          apply_filters
            ? where("event_date", ">=", event_start_date_format)
            : where("active", "==", true),

          apply_filters
            ? where("event_date", "<=", event_end_date_format)
            : where("active", "==", true),

          orderBy("event_date", order_by),

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

      const events = [];
      querySnapshot.forEach((doc) => {
        events.push({ ...doc.data(), id: doc.id });
      });

      return events;
    } catch (err) {
      toast.error("Error al obtener los eventos");
      console.log(err);
      return rejectWithValue(err);
    }
  }
);

export const changeStateEvent = createAsyncThunk(
  "event/changeStateEvent",
  async ({ event_id, state }, { dispatch, rejectWithValue }) => {
    try {
      const docRef = doc(db, "events", event_id);

      const updateTimestamp = updateDoc(docRef, {
        event_state: state,
        event_updated_at: new Date(),
      });

      await toast.promise(updateTimestamp, {
        loading: "Editando...",
        success: "Evento editado",
        error: "Error al editar el evento",
      });

      dispatch(resetPage());
      dispatch(getEvents({ isNextPage: false, isPrevPage: false }));
      dispatch(getClosestEvents());

      return docRef;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const validateAndCreateUpdate = createAsyncThunk(
  "event/validateAndCreateUpdate",
  async (props, { rejectWithValue, dispatch }) => {
    // Validate if the event in date exists, if not, create the event

    try {
      const {
        event_start_date,
        event_start_time,
        isUpdate,
        onClose,
        reset,
        setImages,
        setImagesToDelete,
      } = props;

      const event_date = new Date(`${event_start_date}T${event_start_time}:00`);
      const start_date = new Date(`${event_start_date}T00:00:00`); // start of the day
      const end_date = new Date(`${event_start_date}T23:59:59`); // end of the day

      // get all events for the day
      const q = query(
        collection(db, "events"),
        where("event_date", ">=", start_date),
        where("event_date", "<=", end_date)
      );

      const querySnapshot = await getDocs(q);

      let exists = false; // if the event exists

      // check if the event exists
      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          const event = doc.data();
          const _event_date = event.event_date.toDate();
          const _event_date_plus_1 = new Date(
            _event_date.getTime() + 1800000 // 30 minutos
          );
          const _event_date_minus_1 = new Date(
            _event_date.getTime() - 1800000 // 30 minutos
          );

          // check if the event exists in range of 30 minutes before and after, or if the event is the same
          if (
            event_date.getTime() === _event_date.getTime() ||
            (event_date.getTime() < _event_date_plus_1.getTime() &&
              event_date.getTime() > _event_date_minus_1.getTime() &&
              event.event_state !== FINALIZADO &&
              event.event_state !== CANCELADO)
          ) {
            // ignore the event that is being updated
            if (isUpdate) {
              if (doc.id !== props.id) {
                exists = true;
              }
            }
            // if the event is not being updated, then it is a new event
            else {
              exists = true;
            }
          }
        });
      }

      // if the event exists, show toast
      if (exists) {
        toast.error("Ya existe un evento en en el rango de 30 minutos");
      } else {
        // delete onClose and reset from props
        delete props.onClose;
        delete props.reset;
        delete props.isUpdate;

        if (isUpdate) {
          dispatch(updateEvent(props));
        } else {
          // create event
          dispatch(createEvent(props));
        }

        setImages([]); // reset images
        setImagesToDelete([]); // reset images to delete
        onClose(); // close modal
        reset(); // reset form
      }

      return exists;
    } catch (err) {
      console.log(err);
      toast.error("Error al validar el evento");
      return rejectWithValue(err);
    }
  }
);

export const getEvent = createAsyncThunk(
  "event/getEvent",
  async (event_id, { rejectWithValue }) => {
    try {
      const docRef = doc(db, "events", event_id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        return {
          ...docSnap.data(),
          id: docSnap.id,
          // event_state: event_states[2],
        };
      } else {
        toast.error("No se encontró el evento");
        return rejectWithValue("No se encontró el evento");
      }
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

// get the closest events, return the time difference and return 10 today's events
export const getClosestEvents = createAsyncThunk(
  "event/getClosestEvents",
  async (_, { rejectWithValue }) => {
    try {
      const today = new Date();
      const year = today.getFullYear();
      const month =
        today.getMonth() + 1 < 10
          ? `0${today.getMonth() + 1}`
          : today.getMonth() + 1;
      const day =
        today.getDate() < 10 ? `0${today.getDate()}` : today.getDate();

      const today_start_date = new Date(`${year}-${month}-${day}T00:00:00`); // start of the day
      const today_end_date = new Date(`${year}-${month}-${day}T23:59:59`); // end of the day

      // get all events for the day
      const q = query(
        collection(db, "events"),
        where("event_date", ">=", today_start_date),
        where("event_date", "<=", today_end_date),
        where("event_state", "in", [PROCESO, EN_RUTA, FINALIZADO])
      );

      const querySnapshot = await getDocs(q);

      let closest_event = null;
      let closest_event_time = null;
      let closest_event_time_diff = null;

      let temp_event_time = 0;
      // check if the event exists
      if (querySnapshot.size > 0) {
        querySnapshot.forEach((doc) => {
          const event = doc.data();
          event.id = doc.id;
          const _event_date = event.event_date.toDate();

          if (today.getTime() <= _event_date.getTime()) {
            const time_diff = _event_date.getTime() - today.getTime();

            if (time_diff <= temp_event_time || temp_event_time === 0) {
              temp_event_time = time_diff;
              closest_event = event;
            }
          }
        });
      }

      // get time difference in minutes and seconds between now and the closest event
      if (closest_event) {
        closest_event_time = closest_event.event_date.toDate();
        closest_event_time_diff =
          closest_event_time.getTime() - today.getTime();
      }

      // convert to mitutes or hours closest_event_time_diff
      let closest_event_time_diff_minutes = Math.floor(
        closest_event_time_diff / 60000
      );
      let closest_event_time_diff_hours = Math.floor(
        closest_event_time_diff / 3600000
      );

      // if the difference is less than 60 minutes, then show minutes
      if (closest_event_time_diff_minutes < 60) {
        closest_event_time_diff = `${closest_event_time_diff_minutes} minutos`;
      }
      // if the difference is less than 24 hours, then show hours
      else if (closest_event_time_diff_hours < 24) {
        closest_event_time_diff = `${closest_event_time_diff_hours} horas`;
      }

      // get all events for the day
      const q2 = query(
        collection(db, "events"),
        where("event_date", ">=", today_start_date),
        where("event_date", "<=", today_end_date),
        where("event_state", "in", [PROCESO, EN_RUTA, FINALIZADO]),
        orderBy("event_date", "desc"),
        limit(10)
      );

      const querySnapshot2 = await getDocs(q2);

      let today_events = [];

      // check if the event exists
      if (querySnapshot2.size > 0) {
        querySnapshot2.forEach((doc) => {
          const event = doc.data();
          event.id = doc.id;
          today_events.push(event);
        });
      }

      return {
        closest_event,
        closest_event_time_diff,
        today_events,
      };
    } catch (err) {
      console.log(err);
      toast.error("Error al obtener los eventos");
      return rejectWithValue(err);
    }
  }
);

export const eventSlice = createSlice({
  name: "event",
  initialState: {
    events: [],
    page: 1,
    numberOfPages: null,
    error: "",
    loading: false,
    event_selected: null,
    validate_date_time: false,
    loading_validate_date_time: false,
    event_data_update: null,
    loading_update_event: false,
    isUpdate: false,
    firstVisible: null,
    lastVisible: null,
    filters: {
      event_state: null,
      event_start_date: null,
      event_end_date: null,
    },
    apply_filters: false,

    loading_closest_events: false,
    closest_event: null,
    closest_event_time_diff: null,
    today_events: [],
  },
  reducers: {
    nextPage: (state) => {
      state.page += 1;
    },
    prevPage: (state) => {
      state.page -= 1;
    },
    setEventSelected: (state, action) => {
      state.event_selected = action.payload;
    },
    setIsUpdate: (state, action) => {
      state.isUpdate = action.payload;
    },
    setEventStateFilter: (state, action) => {
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
    [createEvent.pending]: (state, action) => {
      state.loading = true;
    },
    [createEvent.fulfilled]: (state, action) => {
      state.loading = false;
      // state.events = [...state.events, action.payload];
    },
    [createEvent.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },

    [getEvents.pending]: (state, action) => {
      state.loading = true;
    },
    [getEvents.fulfilled]: (state, action) => {
      state.loading = false;
      state.events = action.payload;
    },
    [getEvents.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },

    [changeStateEvent.pending]: (state, action) => {
      state.loading = true;
    },
    [changeStateEvent.fulfilled]: (state, action) => {
      state.loading = false;
    },
    [changeStateEvent.rejected]: (state, action) => {
      state.loading = false;
      state.error = action.payload.message;
    },

    [validateAndCreateUpdate.pending]: (state, action) => {
      state.loading_validate_date_time = true;
    },
    [validateAndCreateUpdate.fulfilled]: (state, action) => {
      state.loading_validate_date_time = false;
      state.validate_date_time = action.payload;
    },
    [validateAndCreateUpdate.rejected]: (state, action) => {
      state.loading_validate_date_time = false;
      state.error = action.payload.message;
    },

    [getEvent.pending]: (state, action) => {
      state.loading_update_event = true;
    },
    [getEvent.fulfilled]: (state, action) => {
      state.loading_update_event = false;
      state.event_data_update = action.payload;
    },
    [getEvent.rejected]: (state, action) => {
      state.loading_update_event = false;
      state.error = action.payload.message;
    },

    [updateEvent.pending]: (state, action) => {
      state.loading_validate_date_time = true;
    },
    [updateEvent.fulfilled]: (state, action) => {
      state.loading_validate_date_time = false;
    },
    [updateEvent.rejected]: (state, action) => {
      state.loading_validate_date_time = false;
      state.error = action.payload.message;
    },

    [getClosestEvents.pending]: (state, action) => {
      state.loading_closest_events = true;
    },
    [getClosestEvents.fulfilled]: (state, action) => {
      state.loading_closest_events = false;
      state.closest_event = action.payload.closest_event;
      state.closest_event_time_diff = action.payload.closest_event_time_diff;
      state.today_events = action.payload.today_events;
    },
    [getClosestEvents.rejected]: (state, action) => {
      state.loading_closest_events = false;
      state.error = action.payload.message;
    },
  },
});

export const {
  nextPage,
  prevPage,
  setEventSelected,
  setIsUpdate,
  setEventStateFilter,
  setFirstVisible,
  setLastVisible,
  resetPage,
} = eventSlice.actions;

// selectors
export const selectPage = (state) => state.event.page;
export const selectEvent = (state) => state.event.events;
export const selecteEventSelected = (state) => state.event.event_selected;
export const selectEventDateTime = (state) => state.event.validate_date_time;
export const selectEventDataUpdate = (state) => state.event.event_data_update;
export const selectLoadingUpdateEvent = (state) =>
  state.event.loading_update_event;

export const selectClosestEvent = (state) => state.event.closest_event;
export const selectClosestEventTimeDiff = (state) =>
  state.event.closest_event_time_diff;
export const selectTodayEvents = (state) => state.event.today_events;
export const selectLoadingClosestEvents = (state) =>
  state.event.loading_closest_events;

export default eventSlice.reducer;
