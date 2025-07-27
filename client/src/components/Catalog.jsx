import React, { useState, useEffect } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchAllBooks } from "../store/slices/bookSlice";
import {
  fetchAllBorrowedBooks,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";
import ReturnBookPopup from "../popups/ReturnBookPopup";
import Header from "../layout/Header";

const Catalog = () => {
  const dispatch = useDispatch();

  const { loading, error, allBorrowedBooks, message } = useSelector(
    (state) => state.borrow
  );

  const [filter, setFilter] = useState("borrowed");

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

  const currentDate = new Date();

  const borrowedBooks = allBorrowedBooks?.filter((book) => {
    const dueDate = new Date(book.dueDate);
    return dueDate > currentDate && !book.returnDate;
  });

  const overdueBooks = allBorrowedBooks?.filter((book) => {
    const dueDate = new Date(book.dueDate);
    return dueDate <= currentDate && !book.returnDate;
  });

  const booksToDisplay = filter === "borrowed" ? borrowedBooks : overdueBooks;

  // Local state to control popup visibility and data
  const [showReturnPopup, setShowReturnPopup] = useState(false);
  const [borrowedBookId, setBorrowedBookId] = useState("");
  const [email, setEmail] = useState("");

  // Open popup with selected book and user info
  const openReturnBookPopup = (bookId, email) => {
    console.log("Opening popup with bookId:", bookId, "and email:", email); // <-- DEBUG LOG
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
    dispatch(fetchAllBorrowedBooks());
    dispatch(fetchAllBooks());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBorrowSlice());
    }
    if (error) {
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, error, message]);

  return (
    <>
      <main className="relative flex-1 p-6 pt-28 font-inter bg-gray-100 min-h-screen">
        {" "}
        {/* Consistent padding, font, and background */}
        <Header />
        {/* Filter Buttons Header */}
        <header className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
          {" "}
          {/* Increased gap, added mb-6 */}
          <button
            className={`py-3 px-6 rounded-lg font-bold transition duration-300 ease-in-out shadow-lg transform hover:scale-105 w-full sm:w-72
              ${
                filter === "borrowed"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" // Active gradient, white text
                  : "bg-white text-blue-600 border-2 border-black shadow-md hover:bg-gray-100" // Inactive styling: white background, blue text, black border
              }`}
            onClick={() => setFilter("borrowed")}
          >
            Borrowed Books
          </button>
          <button
            className={`py-3 px-6 rounded-lg font-bold transition duration-300 ease-in-out shadow-lg transform hover:scale-105 w-full sm:w-72
              ${
                filter === "overdue"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white" // Active gradient, white text
                  : "bg-white text-blue-600 border-2 border-black shadow-md hover:bg-gray-100" // Inactive styling: white background, blue text, black border
              }`}
            onClick={() => setFilter("overdue")}
          >
            Overdue Borrowers
          </button>
        </header>
        {booksToDisplay && booksToDisplay.length > 0 ? (
          <div className="mt-6 overflow-hidden bg-white rounded-2xl shadow-xl">
            {" "}
            {/* Consistent card styling for table container */}
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-blue-50 text-blue-800 font-semibold text-left">
                  {" "}
                  {/* Consistent header row styling */}
                  <th className="px-6 py-3">ID</th> {/* Increased padding */}
                  <th className="px-6 py-3">User Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Price</th>
                  <th className="px-6 py-3">Due Date</th>{" "}
                  {/* Changed text to Due Date */}
                  <th className="px-6 py-3">Borrowed On</th>{" "}
                  {/* Changed text to Borrowed On */}
                  <th className="px-6 py-3 text-center">Actions</th>{" "}
                  {/* Consistent text to Actions */}
                </tr>
              </thead>
              <tbody>
                {booksToDisplay.map((book, index) => (
                  <tr
                    key={book._id}
                    className={
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } /* Alternating row colors */
                  >
                    <td className="px-6 py-4 text-gray-800">{index + 1}</td>{" "}
                    {/* Increased padding, consistent text color */}
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {book?.user?.name}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {book?.user?.email}
                    </td>
                    <td className="px-6 py-4 text-gray-700">$ {book.price}</td>
                    <td className="px-6 py-4 text-gray-700">
                      {formatDate(book.dueDate)}
                    </td>
                    <td className="px-6 py-4 text-gray-700">
                      {formatDateAndTime(book.createdAt)}
                    </td>
                    <td className="px-6 py-4 flex gap-3 my-auto justify-center">
                      {" "}
                      {/* Increased gap, centered */}
                      {book.returnDate ? (
                        <FaSquareCheck
                          className="w-6 h-6 text-green-600" // Consistent green shade
                          title="Returned"
                        />
                      ) : (
                        <button
                          onClick={() =>
                            openReturnBookPopup(book._id, book?.user?.email)
                          }
                          className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition duration-200 transform hover:scale-110" /* Consistent button styling */
                          title="Return Book"
                          aria-label={`Return book ${book.title}`}
                        >
                          <PiKeyReturnBold className="w-6 h-6" />{" "}
                          {/* Consistent icon size */}
                        </button>
                      )}
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
            No {filter === "borrowed" ? "borrowed" : "overdue"} books found!!
          </h3>
        )}
      </main>

      {/* Render popup only if open and we have valid data */}
      {showReturnPopup && borrowedBookId && email && (
        <ReturnBookPopup
          bookId={borrowedBookId}
          userEmail={email}
          onClose={closeReturnBookPopup}
        />
      )}
    </>
  );
};

export default Catalog;
