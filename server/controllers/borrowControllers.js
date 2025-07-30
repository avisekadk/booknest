import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Borrow } from "../models/borrowModel.js";
import { Book } from "../models/bookModel.js";
import { User } from "../models/userModel.js";
import { calculateFine } from "../utils/fineCalculator.js";

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

  if (book.quantity === 0) {
    return next(new ErrorHandler("Book not available.", 400));
  }

  const isAlreadyBorrowed = user.borrowedBooks.find(
    (b) => b.bookId.toString() === id && b.returned === false
  );

  if (isAlreadyBorrowed) {
    return next(new ErrorHandler("Book already borrowed.", 400));
  }

  book.quantity -= 1;
  book.availability = book.quantity > 0;
  await book.save();

  user.borrowedBooks.push({
    bookId: book._id,
    bookTitle: book.title,
    borrowedDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
  });
  await user.save();

  await Borrow.create({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
    },
    book: book._id,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    price: book.price,
  });

  res.status(200).json({
    success: true,
    message: "Borrowed book has recorded Successfully",
  });
});

export const returnBorrowBooks = catchAsyncErrors(async (req, res, next) => {
  const { borrowId } = req.params; // rename param for clarity
  const { email } = req.body;

  // Find borrow record by_id (borrowId)
  const borrowRecord = await Borrow.findById(borrowId);

  if (!borrowRecord) {
    return next(new ErrorHandler("Borrow record not found.", 404));
  }

  // Check if user email matches and book is not returned yet
  if (borrowRecord.user.email !== email) {
    return next(new ErrorHandler("User email mismatch.", 403));
  }

  if (borrowRecord.returnDate) {
    return next(new ErrorHandler("Book already returned.", 400));
  }

  // Update returnDate and calculate fine
  borrowRecord.returnDate = new Date();
  const fine = calculateFine(borrowRecord.dueDate);
  borrowRecord.fine = fine;
  await borrowRecord.save();

  // Update book quantity and availability
  const book = await Book.findById(borrowRecord.book);

  if (!book) {
    return next(new ErrorHandler("Book not found.", 404));
  }

  book.quantity += 1;
  book.availability = book.quantity > 0;
  await book.save();

  // Update user borrowedBooks array to mark as returned
  const user = await User.findOne({ email, accountVerified: true });
  if (!user) {
    return next(new ErrorHandler("User not found.", 404));
  }

  const borrowedBook = user.borrowedBooks.find(
    (b) => b.bookId.toString() === book._id.toString() && b.returned === false
  );

  if (!borrowedBook) {
    return next(new ErrorHandler("You have not borrowed this book.", 400));
  }

  borrowedBook.returned = true;
  await user.save();

  res.status(200).json({
    success: true,
    message:
      fine !== 0
        ? `The book has been returned successfully. The total charges, including fine, are $${(fine + book.price).toFixed(2)}` // Added toFixed(2)
        : `The book has been returned successfully. The total charges are $${book.price.toFixed(2)}`, // Added toFixed(2)
  });
});

// MODIFIED: getBorrowBooksForAdmin for server-side pagination, filter, and search
export const getBorrowBooksForAdmin = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const filter = req.query.filter || 'borrowed'; // 'borrowed' or 'overdue'
  const keyword = req.query.keyword || ''; // Search by user name or email

  const skip = (page - 1) * limit;
  const currentDate = new Date();

  let query = {};
  if (filter === 'borrowed') {
    query = { dueDate: { $gt: currentDate }, returnDate: null };
  } else if (filter === 'overdue') {
    query = { dueDate: { $lte: currentDate }, returnDate: null };
  }

  // Add keyword search to the query
  if (keyword) {
    // Find users matching the keyword
    const matchingUsers = await User.find({
      $or: [
        { name: { $regex: keyword, $options: 'i' } },
        { email: { $regex: keyword, $options: 'i' } },
      ],
    }).select('_id'); // Only fetch user IDs

    const userIds = matchingUsers.map(user => user._id);

    // If no users match the keyword, return empty results
    if (userIds.length === 0) {
      return res.status(200).json({
        success: true,
        borrowedBooks: [],
        totalCount: 0,
        totalPages: 0,
      });
    }

    // Add user IDs to the existing query
    query['user.id'] = { $in: userIds };
  }

  const totalCount = await Borrow.countDocuments(query);
  const borrowedBooks = await Borrow.find(query)
    .skip(skip)
    .limit(limit)
    .populate('book', 'title author price') // Populate book details if needed
    .sort({ createdAt: -1 }); // Sort by most recent

  const totalPages = Math.ceil(totalCount / limit);

  res.status(200).json({
    success: true,
    borrowedBooks,
    totalCount,
    totalPages,
  });
});

// MODIFIED: borrowBooks for server-side pagination and filter (for 'My Borrowed Books')
export const borrowBooks = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 15;
  const filter = req.query.filter || 'all'; // 'returned', 'nonReturned', 'all'

  const skip = (page - 1) * limit;

  let query = { 'user.id': req.user._id }; // Filter by current authenticated user

  if (filter === 'returned') {
    query.returnDate = { $ne: null }; // Books with a return date
  } else if (filter === 'nonReturned') {
    query.returnDate = null; // Books without a return date
  }
  // 'all' filter doesn't add any specific returnDate condition

  const totalCount = await Borrow.countDocuments(query);
  const userBorrowedBooks = await Borrow.find(query)
    .skip(skip)
    .limit(limit)
    .populate('book', 'title author price description') // Populate book details
    .sort({ createdAt: -1 }); // Sort by most recent

  const totalPages = Math.ceil(totalCount / limit);

  res.status(200).json({
    success: true,
    borrowedBooks: userBorrowedBooks, // Renamed to borrowedBooks for consistency with client
    totalCount,
    totalPages,
  });
});
