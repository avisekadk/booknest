import { createSlice } from "@reduxjs/toolkit";

const popupSlice = createSlice({
  name: "popup",
  initialState: {
    settingPopup: false,
    addBookPopup: false,
    readBookPopup: false,
    recordBookPopup: false,
    returnBookPopup: false,
    addNewAdminPopup: false,
    editBookPopup: false,
    deleteBookPopup: false,
    qrCodePopup: false, // For user's QR code
    scannerPopup: false, // For admin's scanner
  },
  reducers: {
    toggleSettingPopup(state) {
      state.settingPopup = !state.settingPopup;
    },
    toggleAddBookPopup(state) {
      state.addBookPopup = !state.addBookPopup;
    },
    toggleReadBookPopup(state) {
      state.readBookPopup = !state.readBookPopup;
    },
    openReadBookPopup(state) {
      state.readBookPopup = true;
    },
    closeReadBookPopup(state) {
      state.readBookPopup = false;
    },
    toggleRecordBookPopup(state) {
      state.recordBookPopup = !state.recordBookPopup;
    },
    toggleReturnBookPopup(state) {
      state.returnBookPopup = !state.returnBookPopup;
    },
    toggleAddNewAdminPopup(state) {
      state.addNewAdminPopup = !state.addNewAdminPopup;
    },
    toggleEditBookPopup(state) {
      state.editBookPopup = !state.editBookPopup;
    },
    toggleDeleteBookPopup(state) {
      state.deleteBookPopup = !state.deleteBookPopup;
    },
    toggleQrCodePopup(state) {
      state.qrCodePopup = !state.qrCodePopup;
    },
    toggleScannerPopup(state) {
      state.scannerPopup = !state.scannerPopup;
    },
    closeAllPopup(state) {
      state.settingPopup = false;
      state.addBookPopup = false;
      state.readBookPopup = false;
      state.recordBookPopup = false;
      state.returnBookPopup = false;
      state.addNewAdminPopup = false;
      state.editBookPopup = false;
      state.deleteBookPopup = false;
      state.qrCodePopup = false;
      state.scannerPopup = false;
    },
  },
});

export const {
  closeAllPopup,
  toggleSettingPopup,
  toggleAddBookPopup,
  toggleReadBookPopup,
  openReadBookPopup,
  closeReadBookPopup,
  toggleRecordBookPopup,
  toggleReturnBookPopup,
  toggleAddNewAdminPopup,
  toggleEditBookPopup,
  toggleDeleteBookPopup,
  toggleQrCodePopup,
  toggleScannerPopup,
} = popupSlice.actions;

export default popupSlice.reducer;