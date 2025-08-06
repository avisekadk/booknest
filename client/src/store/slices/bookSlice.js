import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api/v1";

const initialState = {
  loading: false,
  error: null,
  message: null,
  books: [],
};

export const fetchAllBooks = createAsyncThunk(
  "book/fetchAllBooks",
  async (_, { rejectWithValue }) => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/book/all`, {
        withCredentials: true,
      });
      return data.books;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch books");
    }
  }
);

export const addBook = createAsyncThunk(
  "book/addBook",
  async (bookData, { rejectWithValue }) => {
    try {
      const { data } = await axios.post(
        `${API_BASE_URL}/book/admin/add`,
        bookData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      return data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to add book");
    }
  }
);

export const updateBook = createAsyncThunk(
  "book/updateBook",
  async ({ id, bookData }, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/book/admin/update/${id}`,
        bookData,
        {
          withCredentials: true,
          headers: { "Content-Type": "application/json" },
        }
      );
      return data.message;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to update book");
    }
  }
);

export const deleteBook = createAsyncThunk(
  "book/deleteBook",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.delete(
        `${API_BASE_URL}/book/admin/delete/${id}`,
        { withCredentials: true }
      );
      return { message: data.message, bookId: id };
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to delete book");
    }
  }
);

export const incrementQuantity = createAsyncThunk(
  "book/incrementQuantity",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/book/admin/increment/${id}`,
        {},
        { withCredentials: true }
      );
      return data.book;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to increment quantity");
    }
  }
);

export const decrementQuantity = createAsyncThunk(
  "book/decrementQuantity",
  async (id, { rejectWithValue }) => {
    try {
      const { data } = await axios.put(
        `${API_BASE_URL}/book/admin/decrement/${id}`,
        {},
        { withCredentials: true }
      );
      return data.book;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || "Failed to decrement quantity");
    }
  }
);

const bookSlice = createSlice({
  name: "book",
  initialState,
  reducers: {
    resetBookSlice: (state) => {
      state.loading = false;
      state.error = null;
      state.message = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllBooks.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllBooks.fulfilled, (state, action) => {
        state.loading = false;
        state.books = action.payload;
      })
      .addCase(fetchAllBooks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(addBook.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(addBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload;
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteBook.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.loading = false;
        state.message = action.payload.message;
        state.books = state.books.filter((book) => book._id !== action.payload.bookId);
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(incrementQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(incrementQuantity.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.books.findIndex((book) => book._id === action.payload._id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
        state.message = "Quantity incremented successfully!";
      })
      .addCase(incrementQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(decrementQuantity.pending, (state) => {
        state.loading = true;
      })
      .addCase(decrementQuantity.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.books.findIndex((book) => book._id === action.payload._id);
        if (index !== -1) {
          state.books[index] = action.payload;
        }
        state.message = "Quantity decremented successfully!";
      })
      .addCase(decrementQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetBookSlice } = bookSlice.actions;
export default bookSlice.reducer;