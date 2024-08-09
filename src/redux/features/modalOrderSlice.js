import { createSlice } from "@reduxjs/toolkit";

export const modalOrderSlice = createSlice({
  name: "modalOrder",
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

export const { onOpenModal, onCloseModal } = modalOrderSlice.actions;

// selectors
export const selectModalOrder = (state) => state.modalOrder.isModalOpen;

export default modalOrderSlice.reducer;
