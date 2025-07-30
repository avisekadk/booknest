import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  error: null,
  message: null,
  books: [],
  totalBooksCount: 0, // NEW: To store the total count of books (for pagination)
  totalPages: 0,     // NEW: To store the total number of pages
};

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    // Fetch all books
    fetchBooksRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    fetchBooksSuccess: (state, action) => {
      state.loading = false;
      state.books = action.payload.books; // Payload now contains 'books' array
      state.totalBooksCount = action.payload.totalBooksCount; // NEW: Get total count from server
      state.totalPages = action.payload.totalPages;         // NEW: Get total pages from server
    },
    fetchBooksFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.books = []; // Clear books on failure
      state.totalBooksCount = 0; // NEW: Reset total count on failure
      state.totalPages = 0;     // NEW: Reset total pages on failure
    },

    // Add book
    addBookRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    addBookSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    addBookFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Update book
    updateBookRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    updateBookSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    updateBookFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Delete book
    deleteBookRequest: (state) => {
      state.loading = true;
      state.error = null;
      state.message = null;
    },
    deleteBookSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      // For server-side pagination, we generally re-fetch data after delete
      // so the local filter might not be strictly needed if re-fetch happens immediately.
      // However, keeping it for immediate UI update if desired before re-fetch.
      state.books = state.books.filter(book => book._id !== action.payload.bookId);
      // Note: totalBooksCount and totalPages will be updated on the next fetchAllBooks
    },
    deleteBookFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Reset state
    resetBookSlice: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

// -----------------
// Async Actions
// -----------------

// MODIFIED: fetchAllBooks now accepts page, limit, and keyword parameters
export const fetchAllBooks = (page = 1, limit = 15, keyword = '') => async (dispatch) => {
  dispatch(bookSlice.actions.fetchBooksRequest());
  try {
    const { data } = await axios.get(
      `http://localhost:4000/api/v1/book/all?page=${page}&limit=${limit}&keyword=${keyword}`,
      {
        withCredentials: true,
      }
    );
    // The server is expected to return { books: [], totalBooksCount: number, totalPages: number }
    dispatch(bookSlice.actions.fetchBooksSuccess(data));
  } catch (err) {
    dispatch(bookSlice.actions.fetchBooksFailed(err.response?.data?.message || "Failed to fetch books"));
  }
};

export const addBook = (data) => async (dispatch) => {
  dispatch(bookSlice.actions.addBookRequest());
  try {
    const { data: responseData } = await axios.post("http://localhost:4000/api/v1/book/admin/add", data, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(bookSlice.actions.addBookSuccess(responseData.message));
  } catch (err) {
    dispatch(bookSlice.actions.addBookFailed(err.response?.data?.message || "Failed to add book"));
  }
};

export const updateBook = (id, bookData) => async (dispatch) => {
  dispatch(bookSlice.actions.updateBookRequest());
  try {
    const { data } = await axios.put(`http://localhost:4000/api/v1/book/admin/update/${id}`, bookData, {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    });
    dispatch(bookSlice.actions.updateBookSuccess(data.message));
  } catch (error) {
    dispatch(bookSlice.actions.updateBookFailed(error.response?.data?.message || "Failed to update book"));
  }
};

export const deleteBook = (id) => async (dispatch) => {
  dispatch(bookSlice.actions.deleteBookRequest());
  try {
    const { data } = await axios.delete(`http://localhost:4000/api/v1/book/delete/${id}`, {
      withCredentials: true,
    });
    dispatch(bookSlice.actions.deleteBookSuccess({ message: data.message, bookId: id }));
    return data.message;
  } catch (error) {
    const errMsg = error?.response?.data?.message || "Failed to delete book";
    dispatch(bookSlice.actions.deleteBookFailed(errMsg));
    throw new Error(errMsg);
  }
};

// Reset state (call in components to clear messages/errors)
export const resetBookSlice = () => (dispatch) => {
  dispatch(bookSlice.actions.resetBookSlice());
};

// Export reducer
export default bookSlice.reducer;
