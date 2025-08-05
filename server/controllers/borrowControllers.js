// server/controllers/borrowControllers.js

import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Borrow } from "../models/borrowModel.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import { calculateFine } from "../utils/fineCalculator.js";
import { Prebooking } from "../models/prebookingModel.js";
import { Notification } from "../models/notificationModel.js";

export const recordBorrowBook = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { email } = req.body;
    const book = await Book.findById(id);
    if (!book) {
        return next(new ErrorHandler("Book not found.", 404));
    }
    const user = await User.findOne({ email, accountVerified: true });
    if (!user) {
        return next(new ErrorHandler("User not found.", 404));
    }
    const isAlreadyBorrowed = user.borrowedBooks.find(
        (b) => b.bookId.toString() === id && b.returned === false
    );
    if (isAlreadyBorrowed) {
        return next(new ErrorHandler("Book already borrowed", 400));
    }

    // --- START OF FIX ---

    // 1. First, check if the book is available. This is the only check needed.
    if (book.quantity <= 0) {
        return next(new ErrorHandler("Book not available.", 400));
    }

    // 2. Decrement the quantity REGARDLESS of pre-booking status.
    book.quantity -= 1;

    // 3. Find and delete the pre-booking record if it exists.
    const prebooking = await Prebooking.findOne({
        bookId: book._id,
        userId: user._id,
    });
    if (prebooking) {
        await prebooking.deleteOne();
    }

    // --- END OF FIX ---

    book.availability = book.quantity > 0;
    book.borrowCount += 1;
    await book.save();

    user.borrowedBooks.push({
        bookId: book._id,
        bookTitle: book.title,
        borrowedDate: new Date(),
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    });
    await user.save();

    await Borrow.create({
        user: { id: user._id, name: user.name, email: user.email },
        book: book._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        price: book.price,
    });

    res.status(200).json({
        success: true,
        message: "Borrowed book has been recorded successfully",
    });
});

export const returnBorrowBooks = catchAsyncErrors(async (req, res, next) => {
    const { borrowId } = req.params;
    const { email } = req.body;

    const borrowRecord = await Borrow.findById(borrowId).populate("user").populate("book");
    if (!borrowRecord) {
        return next(new ErrorHandler("Borrow record not found.", 404));
    }
    if (borrowRecord.user?.email !== email) {
        return next(new ErrorHandler("User email mismatch.", 403));
    }
    if (borrowRecord.returnDate) {
        return next(new ErrorHandler("Book already returned.", 400));
    }

    borrowRecord.returnDate = new Date();
    let fine = calculateFine(borrowRecord.dueDate);
    borrowRecord.fine = fine;
    await borrowRecord.save();

    const book = borrowRecord.book;
    if (!book) {
        return next(new ErrorHandler("Book not found.", 404));
    }
    book.quantity += 1;
    book.availability = book.quantity > 0;
    await book.save();

    if (book.quantity > 0 && book.subscribers && book.subscribers.length > 0) {
        const prebookingCount = await Prebooking.countDocuments({ bookId: book._id });
        if (book.quantity > prebookingCount) {
            for (const subscriberId of book.subscribers) {
                await Notification.create({
                    userId: subscriberId,
                    message: `The book "${book.title}" you subscribed to is now available!`,
                    bookId: book._id,
                    type: 'availability',
                });
            }
            book.subscribers = [];
            await book.save();
        }
    }

    const user = await User.findOne({ email, accountVerified: true });
    if (!user) {
        return next(new ErrorHandler("User not found.", 404));
    }
    const borrowedItem = user.borrowedBooks.find(
        (b) => b.bookId.toString() === book._id.toString() && b.returned === false
    );
    if (!borrowedItem) {
        return next(new ErrorHandler("You have not borrowed this book.", 400));
    }
    borrowedItem.returned = true;
    await user.save();

    res.status(200).json({
        success: true,
        message: fine !== 0
            ? `Book returned successfully. Total charges: Nrs. ${fine + book.price}`
            : `Book returned successfully. Total charges: Nrs. ${book.price}`,
    });
});

export const borrowBooks = catchAsyncErrors(async (req, res, next) => {
    const { borrowedBooks } = req.user;
    res.status(200).json({ success: true, borrowedBooks });
});

export const getBorrowBooksForAdmin = catchAsyncErrors(async (req, res, next) => {
    const borrowedBooks = await Borrow.find();
    res.status(200).json({ success: true, borrowedBooks });
});
