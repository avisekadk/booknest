import React, { useState, useEffect } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchAllBooks } from "../store/slices/bookSlice"; // Still needed for popups
import {
  fetchAllBorrowedBooks,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";
import ReturnBookPopup from "../popups/ReturnBookPopup";
import Header from "../layout/Header";

const Catalog = () => {
  const dispatch = useDispatch();

  // MODIFIED: Get totalBorrowedBooksCount and totalPages from Redux state
  const {
    loading,
    error,
    allBorrowedBooks,
    message,
    totalBorrowedBooksCount,
    totalPages,
  } = useSelector((state) => state.borrow);

  const [filter, setFilter] = useState("borrowed");
  const [searchedKeyword, setSearchedKeyword] = useState(""); // State for search keyword

  // Pagination states (still client-side for managing current page)
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(15); // This value is sent to the server

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const formatDateAndTime = (timeStamp) => {
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  // REMOVED: currentDate and filteredAndSearchedBooks logic
  // This filtering/searching is now done on the server.
  // 'allBorrowedBooks' from Redux is already the paginated and filtered list.

  // Pagination calculations (now based on server-provided totalPages)
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 3; // Number of visible numeric page buttons around current page (excluding 1st and last)

    if (totalPages <= maxPageButtons + 2) {
      // If total pages are few, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1); // Always show the first page

      // Determine the range of middle pages to show
      let startRange = Math.max(
        2,
        currentPage - Math.floor(maxPageButtons / 2)
      );
      let endRange = Math.min(
        totalPages - 1,
        currentPage + Math.floor(maxPageButtons / 2)
      );

      // Adjust start/end range if current page is near the boundaries
      if (currentPage - 1 <= Math.floor(maxPageButtons / 2)) {
        endRange = maxPageButtons + 1; // Show more pages at the beginning
      } else if (totalPages - currentPage <= Math.floor(maxPageButtons / 2)) {
        startRange = totalPages - maxPageButtons; // Show more pages at the end
      }

      // Add leading ellipsis
      if (startRange > 2) {
        pageNumbers.push("...");
      }

      // Add middle pages
      for (let i = startRange; i <= endRange; i++) {
        pageNumbers.push(i);
      }

      // Add trailing ellipsis
      if (endRange < totalPages - 1) {
        pageNumbers.push("...");
      }

      // Always show the last page
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
                          ? "bg-blue-600 text-white shadow-md border-blue-600" // Active state
                          : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300" // Inactive state
                      }`}
        >
          {number}
        </button>
      )
    );
  };

  // Local state to control popup visibility and data
  const [showReturnPopup, setShowReturnPopup] = useState(false);
  const [borrowedBookId, setBorrowedBookId] = useState("");
  const [email, setEmail] = useState("");

  // Open popup with selected book and user info
  const openReturnBookPopup = (bookId, email) => {
    console.log("Opening popup with bookId:", bookId, "and email:", email);
    setBorrowedBookId(bookId);
    setEmail(email);
    setShowReturnPopup(true);
  };

  // Close popup and clear local state
  const closeReturnBookPopup = () => {
    setShowReturnPopup(false);
    setBorrowedBookId("");
    setEmail("");
  };

  useEffect(() => {
    // MODIFIED: Pass pagination, filter, and search keyword to fetchAllBorrowedBooks
    dispatch(
      fetchAllBorrowedBooks(currentPage, booksPerPage, filter, searchedKeyword)
    );
    dispatch(fetchAllBooks()); // Still needed for popups, etc.
  }, [dispatch, currentPage, booksPerPage, filter, searchedKeyword]); // Added dependencies

  useEffect(() => {
    // Reset page to 1 when filter or search keyword changes
    setCurrentPage(1);
  }, [filter, searchedKeyword]); // Trigger re-fetch via main useEffect

  useEffect(() => {
    if (message) {
      toast.success(message);
      // Re-fetch after successful action to update the list
      dispatch(
        fetchAllBorrowedBooks(
          currentPage,
          booksPerPage,
          filter,
          searchedKeyword
        )
      );
      dispatch(fetchAllBooks());
      dispatch(resetBorrowSlice());
    }
    if (error) {
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, error, message]);

  // Calculate display indices for "Results: X - Y of Z"
  const indexOfFirstBookDisplay = (currentPage - 1) * booksPerPage + 1;
  const indexOfLastBookDisplay = Math.min(
    currentPage * booksPerPage,
    totalBorrowedBooksCount
  );

  return (
    <>
      <main className="relative flex-1 p-6 pt-28 font-inter bg-gray-100 min-h-screen">
        <Header />
        {/* Filter Buttons and Search Bar Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
          <button
            className={`py-3 px-6 rounded-lg font-bold transition duration-300 ease-in-out shadow-lg transform hover:scale-105 w-full sm:w-72
              ${
                filter === "borrowed"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  : "bg-white text-blue-600 border-2 border-black shadow-md hover:bg-gray-100"
              }`}
            onClick={() => setFilter("borrowed")}
          >
            Borrowed Books
          </button>
          <button
            className={`py-3 px-6 rounded-lg font-bold transition duration-300 ease-in-out shadow-lg transform hover:scale-105 w-full sm:w-72
              ${
                filter === "overdue"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  : "bg-white text-blue-600 border-2 border-black shadow-md hover:bg-gray-100"
              }`}
            onClick={() => setFilter("overdue")}
          >
            Overdue Borrowers
          </button>
          {/* Search Input for User Name or Email */}
          <input
            type="text"
            placeholder="Search by user name or email..."
            className="w-full sm:w-72 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            value={searchedKeyword}
            onChange={(e) => setSearchedKeyword(e.target.value)}
          />
        </header>
        {loading ? (
          <p className="mt-5 text-center text-xl font-inter text-gray-700">
            Loading catalog data...
          </p>
        ) : totalBorrowedBooksCount > 0 ? ( // MODIFIED: Check total count from Redux
          <div className="mt-6 overflow-x-auto bg-white rounded-2xl shadow-xl">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-blue-50 text-blue-800 font-semibold text-left">
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">User Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3 hidden sm:table-cell">Price</th>
                  <th className="px-6 py-3 hidden md:table-cell">Due Date</th>
                  <th className="px-6 py-3 hidden lg:table-cell">
                    Borrowed On
                  </th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allBorrowedBooks.map(
                  (
                    book,
                    index // MODIFIED: Map over allBorrowedBooks (which is now paginated)
                  ) => (
                    <tr
                      key={book._id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 text-gray-800">
                        {indexOfFirstBookDisplay + index}{" "}
                        {/* Corrected ID for pagination */}
                      </td>
                      <td className="px-6 py-4 text-gray-800 font-medium">
                        {book?.user?.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {book?.user?.email}
                      </td>
                      <td className="px-6 py-4 text-gray-700 hidden sm:table-cell">
                        $ {book.price}
                      </td>
                      <td className="px-6 py-4 text-gray-700 hidden md:table-cell">
                        {formatDate(book.dueDate)}
                      </td>
                      <td className="px-6 py-4 text-gray-700 hidden lg:table-cell">
                        {formatDateAndTime(book.createdAt)}
                      </td>
                      <td className="px-6 py-4 flex gap-2 my-auto justify-center">
                        {book.returnDate ? (
                          <FaSquareCheck
                            className="w-6 h-6 text-green-600"
                            title="Returned"
                          />
                        ) : (
                          <button
                            onClick={() =>
                              openReturnBookPopup(book._id, book?.user?.email)
                            }
                            className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition duration-200 transform hover:scale-110"
                            title="Return Book"
                            aria-label={`Return book ${book.title}`}
                          >
                            <PiKeyReturnBold className="w-6 h-6" />
                          </button>
                        )}
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="text-3xl mt-5 font-extrabold text-[#2C3E50] text-center">
            No {filter === "borrowed" ? "borrowed" : "overdue"} books found
            matching your search!!
          </h3>
        )}

        {/* Pagination Controls - MODIFIED: Use totalBorrowedBooksCount */}
        {totalBorrowedBooksCount > 0 && ( // Only show pagination if there are filtered books
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
            <div className="text-gray-700 text-lg font-semibold">
              Results: {indexOfFirstBookDisplay} - {indexOfLastBookDisplay} of{" "}
              {totalBorrowedBooksCount}
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

      {/* Render popup only if open and we have valid data */}
      {showReturnPopup && borrowedBookId && email && (
        <ReturnBookPopup
          bookId={borrowedBookId}
          userEmail={email}
          onClose={() => {
            closeReturnBookPopup();
            // Re-fetch after return to update the list
            dispatch(
              fetchAllBorrowedBooks(
                currentPage,
                booksPerPage,
                filter,
                searchedKeyword
              )
            );
          }}
        />
      )}
    </>
  );
};

export default Catalog;
