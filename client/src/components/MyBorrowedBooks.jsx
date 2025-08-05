import React, { useState, useEffect, useMemo } from "react";
import { BookA } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { toggleReadBookPopup } from "../store/slices/popUpSlice";
import { fetchAllBorrowedBooks } from "../store/slices/borrowSlice";
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

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(10); // Number of books to display per page

  // Fetch borrowed books on mount and when 'message' changes
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
    if (!timeStamp) return "N/A";
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}`;
    return `${formattedDate} ${formattedTime}`;
  };

  const calculateFine = (dueDate) => {
    const finePerHour = 0.1;
    const now = new Date();
    const due = new Date(dueDate);
    if (now > due) {
      const lateHours = Math.ceil((now - due) / (1000 * 60 * 60));
      return (lateHours * finePerHour).toFixed(2);
    }
    return "0.00";
  };

  // Filter and sort books based on the 'returned' state and most recent borrow date
  const filteredBooks = useMemo(() => {
    const booksToSort = (userBorrowedBooks || []).filter((book) =>
      filter === "returned" ? book.returned : !book.returned
    );
    // Sort by most recent borrow date on top
    booksToSort.sort(
      (a, b) => new Date(b.borrowedDate) - new Date(a.borrowedDate)
    );
    return booksToSort;
  }, [userBorrowedBooks, filter]);

  // Pagination logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredBooks.slice(indexOfFirstBook, indexOfLastBook);
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to the first page when the filter changes
  };

  // Close popup handler: toggle popup and clear selected book
  const closeReadPopup = () => {
    dispatch(toggleReadBookPopup());
    setReadBook(null);
  };

  // Pagination style logic
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

  return (
    <>
      <main className="relative flex-1 p-6 pt-28 font-inter bg-gray-100 min-h-screen">
        <Header />
        <h2 className="text-2xl font-extrabold text-[#2C3E50] mb-6">
          {filter === "returned" ? "Returned Books" : "Non-Returned Books"}
        </h2>
        <div className="flex flex-col gap-4 sm:flex-row mb-6">
          <button
            className={`py-3 px-6 rounded-lg font-semibold transition duration-300 ease-in-out w-full sm:w-auto text-sm
              ${
                filter === "returned"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-300 shadow-md hover:bg-gray-100"
              }`}
            onClick={() => handleFilterChange("returned")}
          >
            Returned Books
          </button>
          <button
            className={`py-3 px-6 rounded-lg font-semibold transition duration-300 ease-in-out w-full sm:w-auto text-sm
              ${
                filter === "nonReturned"
                  ? "bg-blue-600 text-white shadow-lg"
                  : "bg-white text-gray-700 border border-gray-300 shadow-md hover:bg-gray-100"
              }`}
            onClick={() => handleFilterChange("nonReturned")}
          >
            Non-Returned Books
          </button>
        </div>
        {loading ? (
          <p className="mt-5 text-center text-xl font-inter text-gray-700">
            Loading borrowed books...
          </p>
        ) : currentBooks && currentBooks.length > 0 ? (
          <div className="mt-6 overflow-x-auto bg-white rounded-2xl shadow-xl">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-blue-50 text-blue-800 font-semibold text-left text-sm">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">Book Title</th>
                  <th className="px-4 py-3 hidden md:table-cell">
                    Borrowed Date
                  </th>
                  <th className="px-4 py-3 hidden lg:table-cell">Due Date</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">View</th>
                </tr>
              </thead>
              <tbody>
                {currentBooks.map((book, index) => {
                  const isOverdue =
                    !book.returned && new Date() > new Date(book.dueDate);
                  const fine = isOverdue ? calculateFine(book.dueDate) : "0.00";
                  return (
                    <tr
                      key={book.borrowId || index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 text-gray-800 text-sm">
                        {indexOfFirstBook + index + 1}
                      </td>
                      <td className="px-4 py-3 text-gray-800 font-medium text-sm">
                        {book.bookTitle}
                      </td>
                      <td className="px-4 py-3 text-gray-700 text-sm hidden md:table-cell">
                        {formatDate(book.borrowedDate)}
                      </td>
                      <td className="px-4 py-3 text-gray-700 text-sm hidden lg:table-cell">
                        {formatDate(book.dueDate)}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            book.returned
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {book.returned ? "Returned" : "Non-Returned"}
                        </span>
                        {isOverdue && (
                          <span className="text-red-600 font-bold text-xs ml-2">
                            Fine: Nrs. {fine}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() => openReadPopup(book.bookId)}
                          aria-label={`View ${book.bookTitle}`}
                          className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition duration-200 transform hover:scale-110"
                        >
                          <BookA className="w-5 h-5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="text-3xl mt-5 font-extrabold text-[#2C3E50] text-center">
            {filter === "returned"
              ? "No returned books found!"
              : "No non-returned books found!"}
          </h3>
        )}

        {/* Pagination Controls */}
        {filteredBooks.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
            <div className="text-gray-700 text-lg font-semibold">
              Results: {Math.min(indexOfFirstBook + 1, filteredBooks.length)} -{" "}
              {Math.min(indexOfLastBook, filteredBooks.length)} of{" "}
              {filteredBooks.length}
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

      {/* Render popup if open and book is selected */}
      {readBookPopup && readBook && (
        <ReadBookPopup book={readBook} onClose={closeReadPopup} />
      )}
    </>
  );
};

export default MyBorrowedBooks;
