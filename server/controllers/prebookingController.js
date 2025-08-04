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

    // Check if the number of pre-bookings is less than the available quantity
    const prebookingCount = await Prebooking.countDocuments({ bookId });
    if (prebookingCount >= book.quantity) {
        return next(new ErrorHandler("All available copies of this book have been pre-booked.", 400));
    }

    await Prebooking.create({ bookId, userId });
    // Don't decrement quantity on pre-booking, do it on borrow record
    res.status(201).json({ success: true, message: "Book pre-booked successfully! It will be reserved for you." });
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

export const getMyPrebookings = catchAsyncErrors(async (req, res, next) => {
    const prebookings = await Prebooking.find({ userId: req.user._id }).populate('bookId', 'title');
    res.status(200).json({ success: true, prebookings });
});