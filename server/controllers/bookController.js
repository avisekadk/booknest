import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Book } from "../models/bookModel.js";
import { Borrow } from "../models/borrowModel.js"; // Import Borrow for borrow counts

// --- PUBLIC CONTROLLERS ---

/**
 * @desc Get all books, sorted alphabetically by title.
 * This controller is for public, non-authenticated access,
 * typically used for a landing page or public catalog.
 * @route GET /api/v1/book/public/all
 * @access Public
 */
export const getPublicBooks = catchAsyncErrors(async (req, res, next) => {
    const books = await Book.find().sort({ title: 1 }); // Sort alphabetically
    res.status(200).json({
        success: true,
        books,
    });
});

/**
 * @desc Get a single book by its ID.
 * This is a public route, allowing anyone to view book details.
 * @route GET /api/v1/book/:id
 * @access Public
 */
export const getSingleBook = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const book = await Book.findById(id);

    if (!book) {
        return next(new ErrorHandler("Book not found.", 404));
    }

    res.status(200).json({
        success: true,
        book,
    });
});


// --- AUTHENTICATED CONTROLLERS ---

/**
 * @desc Get all books and their borrow counts.
 * This controller is for authenticated users and provides more data
 * for sorting and management within the application.
 * @route GET /api/v1/book/all
 * @access Authenticated
 */
export const getAllBook = catchAsyncErrors(async (req, res, next) => {
    let books = await Book.find().lean(); // Use .lean() for plain JS objects for efficiency

    // Aggregate borrow counts from the Borrow collection
    const borrowCounts = await Borrow.aggregate([
        { $group: { _id: "$book", count: { $sum: 1 } } }
    ]);

    const borrowCountMap = new Map();
    borrowCounts.forEach(item => {
        borrowCountMap.set(item._id.toString(), item.count);
    });

    // Add borrowCount to each book object for front-end sorting
    books = books.map(book => ({
        ...book,
        borrowCount: borrowCountMap.get(book._id.toString()) || 0
    }));

    res.status(200).json({
        success: true,
        books,
    });
});

/**
 * @desc Add a new book to the database.
 * This action is restricted to users with an 'Admin' role.
 * @route POST /api/v1/book/admin/add
 * @access Admin
 */
export const addBook = catchAsyncErrors(async (req, res, next) => {
    const { title, author, description, price, quantity, totalCopies } = req.body;
    if (!title || !author || !description || !price || !quantity || !totalCopies) {
        return next(new ErrorHandler("Please enter all fields.", 400));
    }
    await Book.create({ title, author, description, price, quantity, totalCopies });
    res.status(201).json({
        success: true,
        message: "Book Added Successfully.",
    });
});

/**
 * @desc Update an existing book's details.
 * This action is restricted to users with an 'Admin' role.
 * @route PUT /api/v1/book/admin/update/:id
 * @access Admin
 */
export const updateBook = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    });

    if (!book) {
        return next(new ErrorHandler("Book not found.", 404));
    }
    res.status(200).json({
        success: true,
        message: "Book updated successfully.",
    });
});

/**
 * @desc Increment a book's quantity and totalCopies by one.
 * This is an administrative action.
 * @route PUT /api/v1/book/admin/increment/:id
 * @access Admin
 */
export const incrementBookQuantity = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const book = await Book.findByIdAndUpdate(id, { $inc: { quantity: 1, totalCopies: 1 } }, { new: true });
    if (!book) return next(new ErrorHandler("Book not found", 404));

    // Placeholder for future logic, e.g., notifying users on availability
    if (book.quantity === 1) {
        // Notification logic would go here
    }

    res.status(200).json({ success: true, message: "Quantity increased", book });
});

/**
 * @desc Decrement a book's quantity and totalCopies by one.
 * This is an administrative action and includes a check for quantity.
 * @route PUT /api/v1/book/admin/decrement/:id
 * @access Admin
 */
export const decrementBookQuantity = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const book = await Book.findById(id);
    if (!book) return next(new ErrorHandler("Book not found", 404));
    if (book.quantity <= 0) return next(new ErrorHandler("Cannot decrease quantity below zero", 400));

    book.quantity -= 1;
    book.totalCopies -=1;
    await book.save();

    res.status(200).json({ success: true, message: "Quantity decreased", book });
});


/**
 * @desc Delete a book by its ID.
 * This action is restricted to users with an 'Admin' role.
 * @route DELETE /api/v1/book/admin/delete/:id
 * @access Admin
 */
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
