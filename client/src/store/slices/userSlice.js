import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { toggleAddNewAdminPopup } from "./popUpSlice";

const userSlice = createSlice({
  name: "user",
  initialState: {
    users: [],
    loading: false,
    totalUsersCount: 0, // NEW: To store the total count of users
    totalPages: 0,      // NEW: To store the total number of pages
    error: null, // Added error state for consistency
  },
  reducers: {
    fetchAllUsersRequest(state) {
      state.loading = true;
      state.error = null; // Ensure error is cleared on new request
    },
    fetchAllUsersSuccess(state, action) {
      state.loading = false;
      state.users = action.payload.users; // Payload now contains 'users' array
      state.totalUsersCount = action.payload.totalUsersCount; // NEW: Get total count from server
      state.totalPages = action.payload.totalPages;         // NEW: Get total pages from server
    },
    fetchAllUsersFailed(state, action) { // Added action for error message
      state.loading = false;
      state.error = action.payload;
      state.users = []; // Clear users on failure
      state.totalUsersCount = 0; // NEW: Reset total count on failure
      state.totalPages = 0;     // NEW: Reset total pages on failure
    },

    addNewAdminRequest(state) {
      state.loading = true;
    },
    addNewAdminSuccess(state) {
      state.loading = false;
    },
    addNewAdminFailed(state) {
      state.loading = false;
    },
  },
});

// MODIFIED: fetchAllUsers now accepts page, limit, and keyword parameters
export const fetchAllUsers = (page = 1, limit = 15, keyword = '') => async (dispatch) => {
  dispatch(userSlice.actions.fetchAllUsersRequest());
  try {
    const { data } = await axios.get(
      `http://localhost:4000/api/v1/user/all?page=${page}&limit=${limit}&keyword=${keyword}`,
      { withCredentials: true }
    );
    // The server is expected to return { users: [], totalUsersCount: number, totalPages: number }
    dispatch(userSlice.actions.fetchAllUsersSuccess(data)); // Pass the entire data object
  } catch (err) {
    dispatch(userSlice.actions.fetchAllUsersFailed(err.response?.data?.message || "Failed to fetch users"));
  }
};

export const addNewAdmin = (data) => async (dispatch) => {
  dispatch(userSlice.actions.addNewAdminRequest());
  try { // Added try-catch for consistency
    const res = await axios.post("http://localhost:4000/api/v1/user/add/new-admin", data, {
      withCredentials: true,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    dispatch(userSlice.actions.addNewAdminSuccess());
    toast.success(res.data.message);
    dispatch(toggleAddNewAdminPopup());
    // Re-fetch users after adding a new admin to update the list
    // This will trigger the fetchAllUsers in the component's useEffect
  } catch (err) {
    dispatch(userSlice.actions.addNewAdminFailed());
    toast.error(err.response?.data?.message || "Failed to add admin.");
  }
};

export default userSlice.reducer;
