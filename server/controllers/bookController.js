import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Book } from "../models/bookModel.js";
import { Borrow } from "../models/borrowModel.js";
import { Prebooking } from "../models/prebookingModel.js";
import { User } from "../models/userModel.js";
import { sendEmail } from "../utils/sendEmail.js";
import { Notification } from "../models/notificationModel.js";

export const getPublicBooks = catchAsyncErrors(async (req, res, next) => {
    const books = await Book.find().sort({ title: 1 });
    res.status(200).json({ success: true, books });
});

export const getSingleBook = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;
  const book = await Book.findById(id).lean();
  if (!book) {
    return next(new ErrorHandler("Book not found.", 404));
  }

  const prebookingCount = await Prebooking.countDocuments({ bookId: id });
  book.prebookingCount = prebookingCount;

  res.status(200).json({ success: true, book });
});

export const getAllBook = catchAsyncErrors(async (req, res, next) => {
  let books = await Book.find().lean();

  const borrowCounts = await Borrow.aggregate([
    { $group: { _id: "$book", count: { $sum: 1 } } },
  ]);
  const borrowCountMap = new Map();
  borrowCounts.forEach((item) => {
    borrowCountMap.set(item._id.toString(), item.count);
  });

  const prebookingCounts = await Prebooking.aggregate([
    { $group: { _id: "$bookId", count: { $sum: 1 } } },
  ]);
  const prebookingCountMap = new Map();
  prebookingCounts.forEach((item) => {
    prebookingCountMap.set(item._id.toString(), item.count);
  });

  books = books.map((book) => ({
    ...book,
    borrowCount: borrowCountMap.get(book._id.toString()) || 0,
    prebookingCount: prebookingCountMap.get(book._id.toString()) || 0,
  }));

  res.status(200).json({ success: true, books });
});

export const addBook = catchAsyncErrors(async (req, res, next) => {
    const { title, author, description, price, quantity, totalCopies } = req.body;

    if (!title || !author || !description || price === undefined || quantity === undefined || totalCopies === undefined) {
        return next(new ErrorHandler("Please enter all required fields.", 400));
    }

    if (title.trim() === "" || author.trim() === "" || description.trim() === "") {
        return next(new ErrorHandler("Title, author, and description cannot be empty.", 400));
    }

    if (isNaN(price) || price < 0) {
        return next(new ErrorHandler("Price must be a non-negative number.", 400));
    }

    if (isNaN(quantity) || !Number.isInteger(quantity) || quantity < 0) {
        return next(new ErrorHandler("Quantity must be a non-negative integer.", 400));
    }

    if (isNaN(totalCopies) || !Number.isInteger(totalCopies) || totalCopies < 0) {
        return next(new ErrorHandler("Total copies must be a non-negative integer.", 400));
    }

    if (quantity > totalCopies) {
        return next(new ErrorHandler("Available quantity cannot exceed total copies.", 400));
    }

    await Book.create({ title, author, description, price, quantity, totalCopies });
    res.status(201).json({
        success: true,
        message: "Book Added Successfully.",
    });
});

export const updateBook = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { title, author, description, price } = req.body;

    let book = await Book.findById(id);
    if (!book) {
        return next(new ErrorHandler("Book not found.", 404));
    }

    if (!title || !author || !description || price === undefined) {
        return next(new ErrorHandler("Please enter all required fields for update.", 400));
    }

    if (title.trim() === "" || author.trim() === "" || description.trim() === "") {
        return next(new ErrorHandler("Title, author, and description cannot be empty.", 400));
    }

    if (isNaN(price) || price < 0) {
        return next(new ErrorHandler("Price must be a non-negative number.", 400));
    }

    book.title = title.trim();
    book.author = author.trim();
    book.description = description.trim();
    book.price = price;

    await book.save();

    res.status(200).json({
        success: true,
        message: "Book details updated successfully.",
    });
});

export const incrementBookQuantity = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) { return next(new ErrorHandler("Book not found", 404)); }

    const wasUnavailable = book.quantity === 0;

    book.quantity += 1;
    book.totalCopies += 1;
    await book.save();

    const isNowAvailable = wasUnavailable && book.quantity > 0;

    if (isNowAvailable && book.subscribers.length > 0) {
        const subscribers = await User.find({ '_id': { $in: book.subscribers } }).select('email name');
        for (const sub of subscribers) {
            const message = `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                    <h2>Book Back in Stock!</h2>
                    <p>Hello ${sub.name},</p>
                    <p>Great news! The book "<strong>${book.title}</strong>" you were waiting for is now back in stock.</p>
                    <p>Hurry up and pre-book your copy before it's gone again!</p>
                    <a href="${process.env.FRONTEND_URL}/book/${book._id}" style="display: inline-block; padding: 10px 20px; background-color: #2f80ed; color: white; text-decoration: none; border-radius: 5px; margin-top: 20px;">
                        View Book
                    </a>
                </div>`;
            await sendEmail({
                email: sub.email,
                subject: `BookNest: "${book.title}" is Available!`,
                message,
            });
            await Notification.create({
                userId: sub._id,
                message: `The book "${book.title}" is now available!`,
                bookId: book._id,
                type: 'availability'
            });
        }
        book.subscribers = [];
        await book.save();
    }

    res.status(200).json({ success: true, message: "Quantity increased", book });
});

export const decrementBookQuantity = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) { return next(new ErrorHandler("Book not found", 404)); }
    if (book.quantity <= 0) { return next(new ErrorHandler("Cannot decrease quantity below zero", 400)); }

    book.quantity -= 1;
    book.totalCopies -= 1;
    await book.save();

    res.status(200).json({ success: true, message: "Quantity decreased", book });
});

export const deleteBook = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) { return next(new ErrorHandler("Book not found.", 404)); }
    await book.deleteOne();
    res.status(200).json({
        success: true,
        message: "Book deleted successfully.",
    });
});