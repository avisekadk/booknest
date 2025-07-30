import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Book } from "../models/bookModel.js";

// Add a new book
export const addBook = catchAsyncErrors(async (req, res, next) => {
  const { title, author, description, price, quantity } = req.body;

  if (!title || !author || !description || !price || !quantity) {
    return next(new ErrorHandler("Please enter all fields.", 400));
  }

  await Book.create({ title, author, description, price, quantity });

  res.status(201).json({
    success: true,
    message: "Book Added Successfully.",
  });
});

// Get all books - MODIFIED for server-side pagination and search
export const getAllBook = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1; // Current page, default to 1
  const limit = parseInt(req.query.limit) || 15; // Items per page, default to 15
  const keyword = req.query.keyword || ''; // Search keyword, default to empty string

  const skip = (page - 1) * limit; // Calculate how many documents to skip

  let query = {};
  if (keyword) {
    // Build search query for title or author (case-insensitive)
    query = {
      $or: [
        { title: { $regex: keyword, $options: 'i' } },
        { author: { $regex: keyword, $options: 'i' } },
      ],
    };
  }

  // Get total count of books matching the query (before pagination)
  const totalBooksCount = await Book.countDocuments(query);

  // Fetch books for the current page
  const books = await Book.find(query)
    .skip(skip)
    .limit(limit);

  // Calculate total pages
  const totalPages = Math.ceil(totalBooksCount / limit);

  res.status(200).json({
    success: true,
    books,
    totalBooksCount,
    totalPages,
  });
});

// Delete a book
export const deleteBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  const book = await Book.findById(id);

  if (!book) {
    return next(new ErrorHandler("Book not found.", 404));
  }

  await book.deleteOne();

  res.status(200).json({
    success: true,
    message: "Book deleted successfully.",
  });
});

// Update a book - MODIFIED to update availability
export const updateBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const { title, author, description, price, quantity } = req.body;

  if (!title || !author || !description || !price || !quantity) {
    return next(new ErrorHandler("Please fill all fields.", 400));
  }

  const book = await Book.findById(id);

  if (!book) {
    return next(new ErrorHandler("Book not found.", 404));
  }

  book.title = title;
  book.author = author;
  book.description = description;
  book.price = price;
  book.quantity = quantity;
  book.availability = book.quantity > 0; // NEW: Update availability based on quantity

  await book.save();

  res.status(200).json({
    success: true,
    message: "Book updated successfully.",
  });
});
