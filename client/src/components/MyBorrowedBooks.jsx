import React, { useState, useEffect } from "react";
import { BookA } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import { fetchAllBorrowedBooks } from "../store/slices/borrowSlice"; // Import your fetch action
import Header from "../layout/Header";
import ReadBookPopup from "../popups/ReadBookPopup";

const MyBorrowedBooks = () => {
  const dispatch = useDispatch();

  const { books } = useSelector((state) => state.book);
  const { userBorrowedBooks, message, loading } = useSelector(
    (state) => state.borrow
  );
  const { readBookPopup } = useSelector((state) => state.popup);

  const [readBook, setReadBook] = useState(null);
  const [filter, setFilter] = useState("returned");

  // Fetch borrowed books on mount and when 'message' changes (e.g., book added)
  useEffect(() => {
    dispatch(fetchAllBorrowedBooks());
  }, [dispatch, message]);

  // Open popup only if readBook is set and popup is currently closed
  useEffect(() => {
    if (readBook && !readBookPopup) {
      dispatch(toggleReadBookPopup());
    }
  }, [readBook, readBookPopup, dispatch]);

  // Function to open popup and set the book to read
  const openReadPopup = (id) => {
    const bookToRead = books.find((book) => book._id === id);
    if (!bookToRead) {
      console.warn("Book not found for id:", id);
      return;
    }
    setReadBook(bookToRead);
  };

  // Format timestamp to readable string
  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    return `${formattedDate} ${formattedTime}`;
  };

  const returnedBooks = userBorrowedBooks?.filter((book) => book.returned);
  const nonReturnedBooks = userBorrowedBooks?.filter((book) => !book.returned);
  const booksToDisplay =
    filter === "returned" ? returnedBooks : nonReturnedBooks;

  // Close popup handler: toggle popup and clear selected book
  const closeReadPopup = () => {
    dispatch(toggleReadBookPopup());
    setReadBook(null);
  };

  return (
    <>
      <main className="relative flex-1 p-6 pt-28 font-inter bg-gray-100 min-h-screen">
        {" "}
        {/* Consistent padding, font, and background */}
        <Header />
        {/* Main Header for the page */}
        <header className="flex flex-col gap-6 md:flex-row md:justify-between md:items-center mb-6">
          {" "}
          {/* Consistent gap, added mb-6 */}
          <h2 className="text-3xl font-extrabold text-[#2C3E50]">
            {" "}
            {/* Consistent heading style */}
            {filter === "returned" ? "Returned Books" : "Non-Returned Books"}
          </h2>
        </header>
        {/* Filter Buttons Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
          {" "}
          {/* Consistent gap, added mb-6 */}
          <button
            className={`py-3 px-6 rounded-lg font-bold transition duration-300 ease-in-out shadow-lg transform hover:scale-105 w-full sm:w-72
              ${
                filter === "returned"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" // Active gradient, white text
                  : "bg-white text-blue-600 border-2 border-black shadow-md hover:bg-gray-100" // Inactive styling: white background, blue text, black border
              }`}
            onClick={() => setFilter("returned")}
          >
            Returned Books
          </button>
          <button
            className={`py-3 px-6 rounded-lg font-bold transition duration-300 ease-in-out shadow-lg transform hover:scale-105 w-full sm:w-72
              ${
                filter === "nonReturned"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" // Active gradient, white text
                  : "bg-white text-blue-600 border-2 border-black shadow-md hover:bg-gray-100" // Inactive styling: white background, blue text, black border
              }`}
            onClick={() => setFilter("nonReturned")}
          >
            Non-Returned Books
          </button>
        </header>
        {loading ? (
          <p className="mt-5 text-center text-xl font-inter text-gray-700">
            Loading borrowed books...
          </p>
        ) : booksToDisplay && booksToDisplay.length > 0 ? (
          <div className="mt-6 overflow-x-auto bg-white rounded-2xl shadow-xl">
            {" "}
            {/* Added overflow-x-auto for horizontal scroll on small screens */}
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-blue-50 text-blue-800 font-semibold text-left">
                  {" "}
                  {/* Consistent header row styling */}
                  <th className="px-4 py-3 sm:px-6">ID</th>{" "}
                  {/* Adjusted padding for mobile */}
                  <th className="px-4 py-3 sm:px-6">Book Title</th>
                  <th className="px-4 py-3 sm:px-6 hidden md:table-cell">
                    Date and Time
                  </th>{" "}
                  {/* Hide on small/medium, show on md and up */}
                  <th className="px-4 py-3 sm:px-6 hidden lg:table-cell">
                    Due Date
                  </th>{" "}
                  {/* Hide on small/medium/large, show on lg and up */}
                  <th className="px-4 py-3 sm:px-6">Returned</th>
                  <th className="px-4 py-3 sm:px-6 text-center">View</th>{" "}
                  {/* Consistent text to Actions */}
                </tr>
              </thead>
              <tbody>
                {booksToDisplay.map((book, index) => (
                  <tr
                    key={book.borrowId || index}
                    className={
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } /* Alternating row colors */
                  >
                    <td className="px-4 py-4 sm:px-6 text-gray-800">
                      {index + 1}
                    </td>{" "}
                    {/* Adjusted padding, consistent text color */}
                    <td className="px-4 py-4 sm:px-6 text-gray-800 font-medium">
                      {book.bookTitle}
                    </td>
                    <td className="px-4 py-4 sm:px-6 text-gray-700 hidden md:table-cell">
                      {formatDate(book.borrowedDate)}
                    </td>
                    <td className="px-4 py-4 sm:px-6 text-gray-700 hidden lg:table-cell">
                      {formatDate(book.dueDate)}
                    </td>
                    <td className="px-4 py-4 sm:px-6">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          book.returned
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {book.returned ? "Yes" : "No"}
                      </span>
                    </td>
                    <td className="px-4 py-4 sm:px-6 flex justify-center">
                      {" "}
                      {/* Consistent centering */}
                      <button
                        onClick={() => openReadPopup(book.bookId)}
                        aria-label={`View ${book.bookTitle}`}
                        className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition duration-200 transform hover:scale-110" /* Consistent button styling */
                      >
                        <BookA className="w-5 h-5" />{" "}
                        {/* Consistent icon size */}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="text-3xl mt-5 font-extrabold text-[#2C3E50] text-center">
            {" "}
            {/* Consistent heading style and centering */}
            {filter === "returned"
              ? "No returned books found!"
              : "No non-returned books found!"}
          </h3>
        )}
      </main>

      {/* Render popup if open and book is selected */}
      {readBookPopup && readBook && (
        <ReadBookPopup book={readBook} onClose={closeReadPopup} />
      )}
    </>
  );
};

export default MyBorrowedBooks;
