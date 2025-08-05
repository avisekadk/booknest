import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  loading: false,
  error: null,
  message: null,
  books: [],
};

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    fetchBooksRequest: (state) => {
      state.loading = true;
    },
    fetchBooksSuccess: (state, action) => {
      state.loading = false;
      state.books = action.payload;
    },
    fetchBooksFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    addBookRequest: (state) => {
      state.loading = true;
    },
    addBookSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    addBookFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    updateBookRequest: (state) => {
      state.loading = true;
    },
    updateBookSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload;
    },
    updateBookFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    deleteBookRequest: (state) => {
      state.loading = true;
    },
    deleteBookSuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      state.books = state.books.filter(
        (book) => book._id !== action.payload.bookId
      );
    },
    deleteBookFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    changeQuantityRequest: (state) => {
      state.loading = true;
    },
    changeQuantitySuccess: (state, action) => {
      state.loading = false;
      state.message = action.payload.message;
      const index = state.books.findIndex(book => book._id === action.payload.book._id);
      if (index !== -1) {
        state.books[index] = action.payload.book;
      }
    },
    changeQuantityFailed: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    resetBookSlice: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
});

export const fetchAllBooks = () => async (dispatch) => {
  dispatch(bookSlice.actions.fetchBooksRequest());
  try {
    const { data } = await axios.get("http://localhost:4000/api/v1/book/all", {
      withCredentials: true,
    });
    dispatch(bookSlice.actions.fetchBooksSuccess(data.books));
  } catch (err) {
    dispatch(bookSlice.actions.fetchBooksFailed(err.response?.data?.message));
  }
};

export const addBook = (bookData) => async (dispatch) => {
  dispatch(bookSlice.actions.addBookRequest());
  try {
    const { data: responseData } = await axios.post(
      "http://localhost:4000/api/v1/book/admin/add",
      bookData,
      {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      }
    );
    dispatch(bookSlice.actions.addBookSuccess(responseData.message));
  } catch (err) {
    dispatch(bookSlice.actions.addBookFailed(err.response?.data?.message));
  }
};

export const updateBook = (id, bookData) => async (dispatch) => {
  dispatch(bookSlice.actions.updateBookRequest());
  try {
    const { data } = await axios.put(
      `http://localhost:4000/api/v1/book/admin/update/${id}`,
      bookData,
      { withCredentials: true, headers: { "Content-Type": "application/json" } }
    );
    dispatch(bookSlice.actions.updateBookSuccess(data.message));
  } catch (error) {
    dispatch(bookSlice.actions.updateBookFailed(error.response?.data?.message));
  }
};

export const deleteBook = (id) => async (dispatch) => {
  dispatch(bookSlice.actions.deleteBookRequest());
  try {
    const { data } = await axios.delete(
      `http://localhost:4000/api/v1/book/admin/delete/${id}`,
      { withCredentials: true }
    );
    dispatch(bookSlice.actions.deleteBookSuccess({ message: data.message, bookId: id }));
    return data.message;
  } catch (error) {
    const errMsg = error?.response?.data?.message || "Failed to delete book";
    dispatch(bookSlice.actions.deleteBookFailed(errMsg));
    throw new Error(errMsg);
  }
};

export const incrementQuantity = (id) => async (dispatch) => {
  dispatch(bookSlice.actions.changeQuantityRequest());
  try {
    const { data } = await axios.put(
      `http://localhost:4000/api/v1/book/admin/increment/${id}`,
      {},
      { withCredentials: true }
    );
    dispatch(bookSlice.actions.changeQuantitySuccess(data));
  } catch (error) {
    dispatch(bookSlice.actions.changeQuantityFailed(error.response?.data?.message));
  }
};

export const decrementQuantity = (id) => async (dispatch) => {
  dispatch(bookSlice.actions.changeQuantityRequest());
  try {
    const { data } = await axios.put(
      `http://localhost:4000/api/v1/book/admin/decrement/${id}`,
      {},
      { withCredentials: true }
    );
    dispatch(bookSlice.actions.changeQuantitySuccess(data));
  } catch (error) {
    dispatch(bookSlice.actions.changeQuantityFailed(error.response?.data?.message));
  }
};


export const resetBookSlice = () => (dispatch) => {
  dispatch(bookSlice.actions.resetBookSlice());
};

export default bookSlice.reducer;