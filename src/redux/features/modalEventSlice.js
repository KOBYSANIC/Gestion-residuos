import { createSlice } from "@reduxjs/toolkit";

export const modalEventSlice = createSlice({
  name: "modalEvent",
  initialState: {
    isModalOpen: false,
  },
  reducers: {
    onOpenModal: (state) => {
      state.isModalOpen = true;
    },
    onCloseModal: (state) => {
      state.isModalOpen = false;
    },
  },
});

export const { onOpenModal, onCloseModal } = modalEventSlice.actions;

// selectors
export const selectModalEvent = (state) => state.modalEvent.isModalOpen;

export default modalEventSlice.reducer;
