import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const borrowSlice = createSlice({
  name: "borrow",
  initialState: {
    loading: false,
    error: null,
    userBorrowedBooks: [],
    allBorrowedBooks: [],
    message: null,
    totalBorrowedBooksCount: 0, // NEW: For Catalog component
    totalUserBorrowedBooksCount: 0, // NEW: For MyBorrowedBooks component
    totalPages: 0, // NEW: Shared for pagination
  },

  reducers: {
    fetchUserBorrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchUserBorrowedBooksSuccess(state, action) {
      state.loading = false;
      state.userBorrowedBooks = action.payload.borrowedBooks; // MODIFIED: Payload now contains 'borrowedBooks' array
      state.totalUserBorrowedBooksCount = action.payload.totalCount; // NEW: Get total count from server
      state.totalPages = action.payload.totalPages; // NEW: Get total pages from server
    },
    fetchUserBorrowedBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.userBorrowedBooks = [];
      state.totalUserBorrowedBooksCount = 0; // NEW: Reset on failure
      state.totalPages = 0; // NEW: Reset on failure
    },

    recordBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    recordBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    recordBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    fetchAllBorrowedBooksRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchAllBorrowedBooksSuccess(state, action) {
      state.loading = false;
      state.allBorrowedBooks = action.payload.borrowedBooks; // MODIFIED: Payload now contains 'borrowedBooks' array
      state.totalBorrowedBooksCount = action.payload.totalCount; // NEW: Get total count from server
      state.totalPages = action.payload.totalPages; // NEW: Get total pages from server
    },
    fetchAllBorrowedBooksFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
      state.allBorrowedBooks = [];
      state.totalBorrowedBooksCount = 0; // NEW: Reset on failure
      state.totalPages = 0; // NEW: Reset on failure
    },
    returnBookRequest(state) {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    returnBookSuccess(state, action) {
      state.loading = false;
      state.message = action.payload;
    },
    returnBookFailed(state, action) {
      state.loading = false;
      state.error = action.payload;
      state.message = null;
    },
    resetBookSlice(state) { // This seems like a duplicate, likely for borrowSlice specific reset
      state.loading = false;
      state.error = null;
      state.message = null;
    },
    resetBorrowSlice(state) {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

// MODIFIED: fetchUserBorrowedBooks to accept pagination parameters
export const fetchUserBorrowedBooks = (page = 1, limit = 15, filter = 'all') => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchUserBorrowedBooksRequest());
  try {
    const { data } = await axios
      .get(`http://localhost:4000/api/v1/borrow/my-borrowed-books?page=${page}&limit=${limit}&filter=${filter}`, {
        withCredentials: true,
      });
    dispatch(
      borrowSlice.actions.fetchUserBorrowedBooksSuccess(data) // Pass the entire data object
    );
  } catch (err) {
    dispatch(borrowSlice.actions.fetchUserBorrowedBooksFailed(err.response?.data?.message || "Failed to fetch user borrowed books"));
  }
};

// MODIFIED: fetchAllBorrowedBooks to accept pagination, filter, and keyword parameters
export const fetchAllBorrowedBooks = (page = 1, limit = 15, filter = 'borrowed', keyword = '') => async (dispatch) => {
  dispatch(borrowSlice.actions.fetchAllBorrowedBooksRequest());
  try {
    const { data } = await axios
      .get(`http://localhost:4000/api/v1/borrow/borrowed-books-by-users?page=${page}&limit=${limit}&filter=${filter}&keyword=${keyword}`, {
        withCredentials: true,
      });
    dispatch(
      borrowSlice.actions.fetchAllBorrowedBooksSuccess(data) // Pass the entire data object
    );
  } catch (err) {
    dispatch(
      borrowSlice.actions.fetchAllBorrowedBooksFailed(
        err.response?.data?.message || "Failed to fetch all borrowed books"
      )
    );
  }
};

export const recordBorrowBook = (email, id) => async (dispatch) => {
  dispatch(borrowSlice.actions.recordBookRequest());
  try { // Added try-catch for consistency
    const res = await axios
      .post(
        `http://localhost:4000/api/v1/borrow/record-borrow-book/${id}`,
        { email },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
    dispatch(borrowSlice.actions.recordBookSuccess(res.data.message));
  } catch (err) {
    dispatch(borrowSlice.actions.recordBookFailed(err.response?.data?.message || "Failed to record borrow book")); // Use optional chaining
  }
};

export const returnBook = ({ email, id }) => async (dispatch) => {
  dispatch(borrowSlice.actions.returnBookRequest());
  try {
    const res = await axios.put(
      `http://localhost:4000/api/v1/borrow/return-borrowed-book/${id}`,
      { email },
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(borrowSlice.actions.returnBookSuccess(res.data.message));
  } catch (err) {
    dispatch(borrowSlice.actions.returnBookFailed(err.response?.data?.message || err.message));
  }
};

// Reset state (call in components to clear messages/errors)
export const resetBookSlice = () => (dispatch) => { // This might be a typo, should be resetBorrowSlice?
  dispatch(borrowSlice.actions.resetBookSlice());
};

export const resetBorrowSlice = () => (dispatch) => {
  dispatch(borrowSlice.actions.resetBorrowSlice());
};
export default borrowSlice.reducer;
