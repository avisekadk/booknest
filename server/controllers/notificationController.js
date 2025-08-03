// server/controllers/notificationController.js
import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Book } from "../models/bookModel.js";

export const subscribeToBook = catchAsyncErrors(async (req, res, next) => {
    const { bookId } = req.params;
    const userId = req.user._id;

    const book = await Book.findById(bookId);
    if (!book) {
        return next(new ErrorHandler("Book not found.", 404));
    }

    if (book.quantity > 0) {
        return next(new ErrorHandler("Book is already available.", 400));
    }
    
    // Add user to subscribers list if not already there
    if (!book.subscribers.includes(userId)) {
        book.subscribers.push(userId);
        await book.save();
    }

    res.status(200).json({
        success: true,
        message: "You will be notified when this book is back in stock."
    });
});