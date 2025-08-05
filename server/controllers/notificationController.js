import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Book } from "../models/bookModel.js";
import { Notification } from "../models/notificationModel.js";
import { User } from "../models/userModel.js";
import { Prebooking } from "../models/prebookingModel.js"; // Import Prebooking model

export const subscribeToBook = catchAsyncErrors(async (req, res, next) => {
    const { bookId } = req.params;
    const userId = req.user._id;

    const book = await Book.findById(bookId);
    if (!book) {
        return next(new ErrorHandler("Book not found.", 404));
    }

    // FIX: Check if the book is truly available by comparing quantity with pre-bookings
    const prebookingCount = await Prebooking.countDocuments({ bookId });
    if (book.quantity > 0 && prebookingCount < book.quantity) {
        return next(new ErrorHandler("This book is currently available for pre-booking.", 400));
    }

    if (!book.subscribers.includes(userId)) {
        book.subscribers.push(userId);
        await book.save();
    }

    res.status(200).json({
        success: true,
        message: "You will be notified when this book is back in stock."
    });
});

export const getMyNotifications = catchAsyncErrors(async (req, res, next) => {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, notifications });
});

export const deleteNotification = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const notification = await Notification.findById(id);

    if (!notification) {
        return next(new ErrorHandler("Notification not found.", 404));
    }

    if (notification.userId.toString() !== req.user._id.toString()) {
        return next(new ErrorHandler("You are not authorized to delete this notification.", 403));
    }

    await notification.deleteOne();
    res.status(200).json({ success: true, message: "Notification deleted." });
});