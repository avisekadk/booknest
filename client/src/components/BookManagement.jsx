import React, { useState, useEffect } from "react";
import { BookA, NotebookPen, Pencil, Trash2 } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleAddBookPopup,
  openReadBookPopup,
  closeReadBookPopup,
  toggleRecordBookPopup,
  toggleEditBookPopup,
  toggleDeleteBookPopup,
} from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { fetchAllBooks, resetBookSlice } from "../store/slices/bookSlice";
import {
  fetchAllBorrowedBooks,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";
import Header from "../layout/Header";
import AddBookPopup from "../popups/AddBookPopup";
import ReadBookPopup from "../popups/ReadBookPopup";
import RecordBookPopup from "../popups/RecordBookPopup";
import EditBookPopup from "../popups/EditBookPopup";
import DeleteBookConfirmation from "../popups/DeleteBookPopup";

const BookManagement = () => {
  const dispatch = useDispatch();

  const { loading, error, message, books } = useSelector((state) => state.book);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const {
    addBookPopup,
    readBookPopup,
    recordBookPopup,
    editBookPopup,
    deleteBookPopup,
  } = useSelector((state) => state.popup);
  const {
    loading: borrowSliceLoading,
    error: borrowSliceError,
    message: borrowSliceMessage,
  } = useSelector((state) => state.borrow);

  const [readBook, setReadBook] = useState({});
  const [borrowBookId, setBorrowBookId] = useState("");
  const [searchedKeyword, setSearchedKeyword] = useState("");
  const [editBook, setEditBook] = useState(null);
  const [deleteBookId, setDeleteBookId] = useState(null);
  const [deleteBookTitle, setDeleteBookTitle] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(15); // Set to 15 books per page

  useEffect(() => {
    dispatch(fetchAllBooks());
    dispatch(fetchAllBorrowedBooks());
  }, [dispatch, message]);

  useEffect(() => {
    if (message || borrowSliceMessage) {
      toast.success(message || borrowSliceMessage);
      dispatch(resetBookSlice());
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, message, borrowSliceMessage]);

  const openReadPopup = (id) => {
    const book = books.find((book) => book._id === id);
    setReadBook(book);
    dispatch(openReadBookPopup());
  };

  const openRecordBookPopup = (bookId) => {
    setBorrowBookId(bookId);
    dispatch(toggleRecordBookPopup());
  };

  const openEditBookPopup = (id) => {
    const bookToEdit = books.find((book) => book._id === id);
    setEditBook(bookToEdit);
    dispatch(toggleEditBookPopup());
  };

  const openDeleteBookConfirmation = (id, title) => {
    setDeleteBookId(id);
    setDeleteBookTitle(title);
    dispatch(toggleDeleteBookPopup());
  };

  const handleSearch = (e) => {
    setSearchedKeyword(e.target.value.toLowerCase());
    setCurrentPage(1); // Reset to first page on new search
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchedKeyword) ||
      book.author.toLowerCase().includes(searchedKeyword)
  );

  // Pagination calculations
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);

  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    // Show a limited range of page numbers around the current page
    const maxPageNumbersToShow = 5; // e.g., current, and 2 before/2 after
    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxPageNumbersToShow / 2)
    );
    let endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxPageNumbersToShow) {
      startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ease-in-out
                      ${
                        currentPage === i
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

  if (loading || borrowSliceLoading) {
    return (
      <div className="text-center mt-20 text-xl font-inter text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <>
      <main className="relative flex-1 p-6 pt-28 font-inter bg-gray-100 min-h-screen">
        <Header />
        <header className="flex flex-col gap-6 md:flex-row md:justify-between md:items-center mb-6">
          <h2 className="text-3xl font-extrabold text-[#2C3E50]">
            {user && user.role === "Admin" ? "Book Management" : "Books"}
          </h2>
          <div className="flex flex-col lg:flex-row gap-4">
            {isAuthenticated && user?.role === "Admin" && (
              <button
                onClick={() => dispatch(toggleAddBookPopup())}
                className="py-3 px-6 rounded-lg font-bold text-white
                           bg-gradient-to-r from-blue-500 to-blue-600
                           hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out
                           shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span className="text-white text-3xl leading-none">+</span>
                Add Book
              </button>
            )}
            <input
              type="text"
              placeholder="Search books by title or author..."
              className="w-full sm:w-52 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              value={searchedKeyword}
              onChange={handleSearch}
            />
          </div>
        </header>

        {filteredBooks.length > 0 ? (
          currentBooks.length > 0 ? (
            <div className="mt-6 overflow-x-auto bg-white rounded-2xl shadow-xl">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-blue-50 text-blue-800 font-semibold text-left">
                    <th className="px-4 py-3 sm:px-6">ID</th>
                    <th className="px-4 py-3 sm:px-6">Name</th>
                    <th className="px-4 py-3 sm:px-6">Author</th>
                    {isAuthenticated && user?.role === "Admin" && (
                      <th className="px-4 py-3 sm:px-6 hidden sm:table-cell">
                        Quantity
                      </th>
                    )}
                    <th className="px-4 py-3 sm:px-6 hidden md:table-cell">
                      Price
                    </th>
                    <th className="px-4 py-3 sm:px-6">Availability</th>
                    {isAuthenticated && user?.role === "Admin" && (
                      <th className="px-4 py-3 sm:px-6 text-center">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentBooks.map((book, index) => (
                    <tr
                      key={book._id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-4 sm:px-6 text-gray-800">
                        {indexOfFirstBook + index + 1}{" "}
                        {/* Corrected ID for pagination */}
                      </td>
                      <td className="px-4 py-4 sm:px-6 text-gray-800 font-medium">
                        {book.title}
                      </td>
                      <td className="px-4 py-4 sm:px-6 text-gray-700">
                        {book.author}
                      </td>
                      {isAuthenticated && user?.role === "Admin" && (
                        <td className="px-4 py-4 sm:px-6 text-gray-700 hidden sm:table-cell">
                          {book.quantity}
                        </td>
                      )}
                      <td className="px-4 py-4 sm:px-6 text-gray-700 hidden md:table-cell">
                        $ {book.price}
                      </td>
                      <td className="px-4 py-4 sm:px-6">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            book.availability
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {book.availability ? "Available" : "Unavailable"}
                        </span>
                      </td>
                      {isAuthenticated && user?.role === "Admin" && (
                        <td className="px-4 py-4 sm:px-6 flex gap-2 sm:gap-3 my-auto justify-center">
                          <button
                            onClick={() => openReadPopup(book._id)}
                            title="Read Book"
                            aria-label={`Read details for ${book.title}`}
                            className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition duration-200 transform hover:scale-110"
                          >
                            <BookA className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => {
                              console.log("Button clicked", book._id);
                              openRecordBookPopup(book._id);
                            }}
                            title="Record Book"
                            aria-label={`Record book activity for ${book.title}`}
                            className="p-2 rounded-full hover:bg-green-100 text-green-600 transition duration-200 transform hover:scale-110"
                          >
                            <NotebookPen className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => openEditBookPopup(book._id)}
                            title="Edit Book"
                            aria-label={`Edit details for ${book.title}`}
                            className="p-2 rounded-full hover:bg-yellow-100 text-yellow-600 transition duration-200 transform hover:scale-110"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() =>
                              openDeleteBookConfirmation(book._id, book.title)
                            }
                            title="Delete Book"
                            aria-label={`Delete ${book.title}`}
                            className="p-2 rounded-full hover:bg-red-100 text-red-600 transition duration-200 transform hover:scale-110"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      )}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="mt-5 text-gray-600 text-lg text-center">
              No books match your search.
            </p>
          )
        ) : (
          <h3 className="text-3xl mt-5 font-extrabold text-[#2C3E50] text-center">
            No books found in library!
          </h3>
        )}

        {/* Pagination Controls */}
        {filteredBooks.length > booksPerPage && (
          <div className="flex justify-center items-center gap-2 mt-8">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold shadow-md
                         hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed
                         transition duration-200 ease-in-out"
            >
              Previous
            </button>
            {renderPageNumbers()}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold shadow-md
                         hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed
                         transition duration-200 ease-in-out"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {/* Popups */}
      {addBookPopup && <AddBookPopup />}
      {readBookPopup && (
        <ReadBookPopup
          book={readBook}
          onClose={() => dispatch(closeReadBookPopup())}
        />
      )}
      {recordBookPopup && <RecordBookPopup bookId={borrowBookId} />}
      {editBookPopup && editBook && (
        <EditBookPopup
          book={editBook}
          onClose={() => {
            dispatch(toggleEditBookPopup());
            setEditBook(null);
            dispatch(fetchAllBooks());
          }}
        />
      )}
      {deleteBookPopup && deleteBookId && (
        <DeleteBookConfirmation
          bookId={deleteBookId}
          bookTitle={deleteBookTitle}
          onClose={() => {
            dispatch(toggleDeleteBookPopup());
            setDeleteBookId(null);
            setDeleteBookTitle("");
            dispatch(fetchAllBooks());
          }}
        />
      )}
    </>
  );
};

export default BookManagement;
