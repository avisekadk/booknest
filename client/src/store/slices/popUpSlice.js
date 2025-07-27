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
    editBookPopup: false,    // NEW: for editing a book
    deleteBookPopup: false,  // NEW: for confirming book deletion
  },
  reducers: {
    toggleSettingPopup(state) {
      state.settingPopup = !state.settingPopup;
    },
    toggleAddBookPopup(state) {
      state.addBookPopup = !state.addBookPopup;
    },

    // Keep toggle for other popups if you want
    toggleReadBookPopup(state) {
      state.readBookPopup = !state.readBookPopup;
    },

    // **Add explicit open and close actions**
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
    // NEW: Actions for Edit and Delete Book Popups
    toggleEditBookPopup(state) {
      state.editBookPopup = !state.editBookPopup;
    },
    toggleDeleteBookPopup(state) {
      state.deleteBookPopup = !state.deleteBookPopup;
    },
    closeAllPopup(state) {
      state.settingPopup = false;
      state.addBookPopup = false;
      state.readBookPopup = false;
      state.recordBookPopup = false;
      state.returnBookPopup = false;
      state.addNewAdminPopup = false;
      state.editBookPopup = false;    // NEW: ensure this is closed
      state.deleteBookPopup = false;  // NEW: ensure this is closed
    },
  },
});

export const {
  closeAllPopup,
  toggleSettingPopup,
  toggleAddBookPopup,
  toggleReadBookPopup,
  openReadBookPopup,      // export new open action
  closeReadBookPopup,     // export new close action
  toggleRecordBookPopup,
  toggleReturnBookPopup,
  toggleAddNewAdminPopup,
  toggleEditBookPopup,    // NEW: export the new action
  toggleDeleteBookPopup,  // NEW: export the new action
} = popupSlice.actions;

export default popupSlice.reducer;