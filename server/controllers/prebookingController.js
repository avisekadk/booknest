// server/controllers/prebookingController.js

import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Prebooking } from "../models/prebookingModel.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";

export const createPrebooking = catchAsyncErrors(async (req, res, next) => {
    const { bookId } = req.params;
    const { _id: userId, kycStatus, borrowedBooks } = req.user;

    if (kycStatus !== 'Verified') {
        return next(new ErrorHandler('You must complete and verify your KYC to pre-book books.', 403));
    }

    // Check if the book is already in the user's borrowed list and not returned
    const isAlreadyBorrowed = borrowedBooks.find(
        (b) => b.bookId.toString() === bookId && b.returned === false
    );

    if (isAlreadyBorrowed) {
        return next(new ErrorHandler("You have already borrowed this book and cannot pre-book it again.", 400));
    }

    const book = await Book.findById(bookId);
    if (!book) return next(new ErrorHandler("Book not found.", 404));
    if (book.quantity <= 0) {
        return next(new ErrorHandler("This book is out of stock and cannot be pre-booked.", 400));
    }
    const existing = await Prebooking.findOne({ bookId, userId });
    if (existing) {
        return next(new ErrorHandler("You have already pre-booked this book.", 400));
    }
    await Prebooking.create({ bookId, userId });
    book.quantity -= 1;
    await book.save();
    res.status(201).json({ success: true, message: "Book pre-booked successfully! It will be reserved for 24 hours." });
});

export const getAdminPrebookings = catchAsyncErrors(async (req, res, next) => {
    const prebookings = await Prebooking.find({}).populate('userId', 'name email').populate('bookId', 'title');
    res.status(200).json({ success: true, prebookings });
});

export const getUsersForPrebooking = catchAsyncErrors(async (req, res, next) => {
    const { bookId } = req.params;
    const prebookings = await Prebooking.find({ bookId }).populate('userId', 'name email');
    if (!prebookings || prebookings.length === 0) {
        return res.status(200).json({ success: true, users: [] });
    }

    const users = prebookings.map(pb => pb.userId);
    res.status(200).json({ success: true, users });
});