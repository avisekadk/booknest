import React, { useState, useEffect, useMemo } from "react";
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
import { Link } from "react-router-dom";

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

  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(10);
  const [sortOrder, setSortOrder] = useState("title_asc");

  // *** CORRECTED useEffect HOOK ***
  useEffect(() => {
    dispatch(fetchAllBooks());

    // This section is corrected to only fetch all borrowed books if the user is an admin.
    // This prevents a standard user from making a request to an admin-only endpoint.
    if (user && user.role === "Admin") {
      dispatch(fetchAllBorrowedBooks());
    }
  }, [dispatch, message, user]); // Added `user` to the dependency array

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
    setCurrentPage(1);
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchedKeyword) ||
      book.author.toLowerCase().includes(searchedKeyword)
  );

  const sortedAndFilteredBooks = useMemo(() => {
    let sorted = [...filteredBooks];
    switch (sortOrder) {
      case "price_asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "most_borrowed":
        sorted.sort((a, b) => (b.borrowCount || 0) - (a.borrowCount || 0));
        break;
      case "title_asc":
      default:
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }
    return sorted;
  }, [filteredBooks, sortOrder]);

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = sortedAndFilteredBooks.slice(
    indexOfFirstBook,
    indexOfLastBook
  );

  const totalPages = Math.ceil(sortedAndFilteredBooks.length / booksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 3;

    if (totalPages <= maxPageButtons + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      let startRange = Math.max(
        2,
        currentPage - Math.floor(maxPageButtons / 2)
      );
      let endRange = Math.min(
        totalPages - 1,
        currentPage + Math.floor(maxPageButtons / 2)
      );

      if (currentPage - 1 <= Math.floor(maxPageButtons / 2)) {
        endRange = maxPageButtons + 1;
      } else if (totalPages - currentPage <= Math.floor(maxPageButtons / 2)) {
        startRange = totalPages - maxPageButtons;
      }

      if (startRange > 2) {
        pageNumbers.push("...");
      }

      for (let i = startRange; i <= endRange; i++) {
        pageNumbers.push(i);
      }

      if (endRange < totalPages - 1) {
        pageNumbers.push("...");
      }

      if (!pageNumbers.includes(totalPages)) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers.map((number, idx) =>
      number === "..." ? (
        <span
          key={`dots-${idx}`}
          className="h-10 w-10 flex items-center justify-center text-gray-700"
        >
          ...
        </span>
      ) : (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`h-10 w-10 flex items-center justify-center rounded-lg font-semibold transition duration-200 ease-in-out border
                      ${
            currentPage === number
              ? "bg-blue-600 text-white shadow-md border-blue-600"
              : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
          }`}
        >
          {number}
        </button>
      )
    );
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
          <h2 className="text-2xl font-extrabold text-[#2C3E50]">
            {user && user.role === "Admin" ? "Book Management" : "Books"}
          </h2>
          <div className="flex flex-col lg:flex-row gap-4">
            {isAuthenticated && user?.role === "Admin" && (
              <button
                onClick={() => dispatch(toggleAddBookPopup())}
                className="py-2 px-4 rounded-lg font-bold text-white
                           bg-gradient-to-r from-blue-500 to-blue-600
                           hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out
                           shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
              >
                <span className="text-white text-2xl leading-none">+</span>
                Add Book
              </button>
            )}

            <div className="flex items-center">
              <label
                htmlFor="sortOrder"
                className="mr-2 font-semibold text-gray-700 whitespace-nowrap"
              >
                Sort by:
              </label>
              <select
                id="sortOrder"
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              >
                <option value="title_asc">Title (A-Z)</option>
                <option value="price_asc">Price (Low to High)</option>
                <option value="price_desc">Price (High to Low)</option>
                <option value="most_borrowed">Most Borrowed</option>
              </select>
            </div>
            <input
              type="text"
              placeholder="Search books by title or author..."
              className="w-full sm:w-52 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              value={searchedKeyword}
              onChange={handleSearch}
            />
          </div>
        </header>

        {sortedAndFilteredBooks.length > 0 ? (
          currentBooks.length > 0 ? (
            <div className="mt-6 overflow-x-auto bg-white rounded-2xl shadow-xl">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-blue-50 text-blue-800 text-sm font-semibold text-left">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">Name</th>
                    <th className="px-4 py-3">Author</th>
                    {isAuthenticated && user?.role === "Admin" && (
                      <th className="px-4 py-3 hidden sm:table-cell">
                        Available
                      </th>
                    )}
                    <th className="px-4 py-3 hidden md:table-cell">Price</th>
                    <th className="px-4 py-3">Availability</th>
                    {isAuthenticated && user?.role === "Admin" && (
                      <th className="px-4 py-3 text-center">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {currentBooks.map((book, index) => (
                    <tr
                      key={book._id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 text-gray-800 text-sm">
                        {indexOfFirstBook + index + 1}
                      </td>
                      <td className="px-4 py-3 text-gray-800 font-medium text-sm">
                        <Link
                          to={`/book/${book._id}`}
                          className="hover:underline text-blue-600"
                        >
                          {book.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3 text-gray-700 text-sm">
                        {book.author}
                      </td>
                      {isAuthenticated && user?.role === "Admin" && (
                        <td className="px-4 py-3 text-gray-700 hidden sm:table-cell text-sm">
                          {book.quantity}
                        </td>
                      )}
                      <td className="px-4 py-3 text-gray-700 hidden md:table-cell text-sm">
                        Nrs. {book.price}
                      </td>

                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            book.quantity > 0 &&
                            book.prebookingCount < book.quantity
                              ? "bg-green-100 text-green-800"
                              : book.quantity > 0 &&
                                book.prebookingCount >= book.quantity
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {book.quantity > 0 &&
                          book.prebookingCount < book.quantity
                            ? "Available"
                            : book.quantity > 0 &&
                              book.prebookingCount >= book.quantity
                            ? "Booked"
                            : "Unavailable"}
                        </span>
                      </td>

                      {isAuthenticated && user?.role === "Admin" && (
                        <td className="px-4 py-3 flex gap-2 my-auto justify-center">
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

        {sortedAndFilteredBooks.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
            <div className="text-gray-700 text-lg font-semibold">
              Results:{" "}
              {Math.min(indexOfFirstBook + 1, sortedAndFilteredBooks.length)} -{" "}
              {Math.min(indexOfLastBook, sortedAndFilteredBooks.length)} of{" "}
              {sortedAndFilteredBooks.length}
            </div>
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-10 w-10 flex items-center justify-center rounded-lg bg-white text-gray-700 border border-gray-300 font-semibold shadow-sm
                           hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed
                           transition duration-200 ease-in-out"
              >
                &lt;
              </button>
              {renderPageNumbers()}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-10 w-10 flex items-center justify-center rounded-lg bg-white text-gray-700 border border-gray-300 font-semibold shadow-sm
                           hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed
                           transition duration-200 ease-in-out"
              >
                &gt;
              </button>
            </div>
          </div>
        )}
      </main>

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
