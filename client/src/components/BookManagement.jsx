import React, { useState, useEffect } from "react";
import { BookA, NotebookPen } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  toggleAddBookPopup,
  openReadBookPopup,
  closeReadBookPopup,
  toggleRecordBookPopup,
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

const BookManagement = () => {
  const dispatch = useDispatch();

  const { loading, error, message, books } = useSelector((state) => state.book);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { addBookPopup, readBookPopup, recordBookPopup } = useSelector(
    (state) => state.popup
  );
  const {
    loading: borrowSliceLoading,
    error: borrowSliceError,
    message: borrowSliceMessage,
  } = useSelector((state) => state.borrow);

  const [readBook, setReadBook] = useState({});
  const [borrowBookId, setBorrowBookId] = useState("");
  const [searchedKeyword, setSearchedKeyword] = useState("");

  useEffect(() => {
    dispatch(fetchAllBooks());
    dispatch(fetchAllBorrowedBooks());
  }, [dispatch]);

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
    dispatch(openReadBookPopup()); // use explicit open here
  };

  const openRecordBookPopup = (bookId) => {
    setBorrowBookId(bookId);
    dispatch(toggleRecordBookPopup());
  };

  const handleSearch = (e) => {
    setSearchedKeyword(e.target.value.toLowerCase());
  };

  const searchedBooks = books.filter((book) =>
    book.title.toLowerCase().includes(searchedKeyword)
  );

  if (loading || borrowSliceLoading) {
    return (
      <div className="text-center mt-20 text-xl font-inter text-gray-700">
        Loading...
      </div>
    ); /* Consistent font and color */
  }

  return (
    <>
      <main className="relative flex-1 p-6 pt-28 font-inter bg-gray-100 min-h-screen">
        {" "}
        {/* Consistent padding, font, and background */}
        <Header />
        {/* Sub Header */}
        <header className="flex flex-col gap-6 md:flex-row md:justify-between md:items-center mb-6">
          {" "}
          {/* Increased gap, added mb-6 */}
          <h2 className="text-3xl font-extrabold text-[#2C3E50]">
            {" "}
            {/* Consistent heading style */}
            {user && user.role === "Admin" ? "Book Management" : "Books"}
          </h2>
          <div className="flex flex-col lg:flex-row gap-4">
            {" "}
            {/* Changed space-y/x to gap */}
            {isAuthenticated && user?.role === "Admin" && (
              <button
                onClick={() => dispatch(toggleAddBookPopup())}
                className="py-3 px-6 rounded-lg font-bold text-white
                           bg-gradient-to-r from-blue-500 to-blue-600
                           hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out
                           shadow-lg transform hover:scale-105 flex items-center justify-center gap-2" /* Consistent button styling */
              >
                <span className="text-white text-3xl leading-none">+</span>{" "}
                {/* Adjusted size for better visual */}
                Add Book
              </button>
            )}
            <input
              type="text"
              placeholder="Search books..."
              className="w-full sm:w-52 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400" /* Consistent input styling */
              value={searchedKeyword}
              onChange={handleSearch}
            />
          </div>
        </header>
        {/* Table or No Books */}
        {books && books.length > 0 ? (
          searchedBooks.length > 0 ? (
            <div className="mt-6 overflow-x-auto bg-white rounded-2xl shadow-xl">
              {" "}
              {/* Consistent card styling for table container */}
              <table className="min-w-full border-collapse">
                <thead>
                  <tr className="bg-blue-50 text-blue-800 font-semibold text-left">
                    {" "}
                    {/* Consistent header row styling */}
                    <th className="px-4 py-3 sm:px-6">ID</th>{" "}
                    {/* Adjusted padding for mobile */}
                    <th className="px-4 py-3 sm:px-6">Name</th>
                    <th className="px-4 py-3 sm:px-6">Author</th>
                    {isAuthenticated && user?.role === "Admin" && (
                      <th className="px-4 py-3 sm:px-6 hidden sm:table-cell">
                        Quantity
                      </th>
                    )}
                    <th className="px-4 py-3 sm:px-6 hidden md:table-cell">
                      Price
                    </th>{" "}
                    {/* Hide on small screens */}
                    <th className="px-4 py-3 sm:px-6">Availability</th>
                    {isAuthenticated && user?.role === "Admin" && (
                      <th className="px-4 py-3 sm:px-6 text-center">Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {searchedBooks.map((book, index) => (
                    <tr
                      key={book._id}
                      className={
                        index % 2 === 0 ? "bg-white" : "bg-gray-50"
                      } /* Alternating row colors */
                    >
                      <td className="px-4 py-4 sm:px-6 text-gray-800">
                        {index + 1}
                      </td>{" "}
                      {/* Adjusted padding */}
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
                          {/* Adjusted gap for mobile, centered */}
                          <button
                            onClick={() => openReadPopup(book._id)}
                            title="Read Book"
                            aria-label={`Read details for ${book.title}`}
                            className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition duration-200 transform hover:scale-110" /* Consistent button styling */
                          >
                            <BookA className="w-5 h-5" />{" "}
                            {/* Adjusted icon size */}
                          </button>
                          <button
                            onClick={() => {
                              console.log("Button clicked", book._id);
                              openRecordBookPopup(book._id);
                            }}
                            title="Record Book"
                            aria-label={`Record book activity for ${book.title}`}
                            className="p-2 rounded-full hover:bg-green-100 text-green-600 transition duration-200 transform hover:scale-110" /* Consistent button styling */
                          >
                            <NotebookPen className="w-5 h-5" />{" "}
                            {/* Adjusted icon size */}
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
            </p> /* Consistent text style and centering */
          )
        ) : (
          <h3 className="text-3xl mt-5 font-extrabold text-[#2C3E50] text-center">
            {" "}
            {/* Consistent heading style and centering */}
            No books found in library!
          </h3>
        )}
      </main>

      {/* Popups */}
      {addBookPopup && <AddBookPopup />}
      {readBookPopup && (
        <ReadBookPopup
          book={readBook}
          onClose={() => dispatch(closeReadBookPopup())} // Explicit close action
        />
      )}
      {recordBookPopup && <RecordBookPopup bookId={borrowBookId} />}
    </>
  );
};

export default BookManagement;
