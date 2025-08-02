import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Prebooking } from "../models/prebookingModel.js";
import { Book } from "../models/bookModel.js";

export const createPrebooking = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;
  const { _id: userId } = req.user;

  const book = await Book.findById(bookId);
  if (!book) return next(new ErrorHandler("Book not found.", 404));

  // Check if there are any copies available to pre-book
  if (book.quantity <= 0) {
    return next(new ErrorHandler("This book is currently out of stock and cannot be pre-booked.", 400));
  }

  // Check for existing pre-booking
  const existing = await Prebooking.findOne({ bookId, userId });
  if (existing) {
    return next(new ErrorHandler("You have already pre-booked this book.", 400));
  }

  // Create the pre-booking
  await Prebooking.create({ bookId, userId });
  
  // Decrement the book quantity to reflect the pre-booking
  book.quantity = book.quantity - 1;
  await book.save();
  
  res.status(201).json({ success: true, message: "Book pre-booked successfully! It will be reserved for 24 hours." });
});

export const getAdminPrebookings = catchAsyncErrors(async (req, res, next) => {
  const prebookings = await Prebooking.find({}).populate('userId', 'name email').populate('bookId', 'title');
  res.status(200).json({ success: true, prebookings });
});
