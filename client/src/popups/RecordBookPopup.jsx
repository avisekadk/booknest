import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { recordBorrowBook } from "../store/slices/borrowSlice";
import {
  toggleReadBookPopup, // Keeping this import as it was in the original code, though not used in this component
  toggleRecordBookPopup,
} from "../store/slices/popUpSlice";

const RecordBookPopup = ({ bookId }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");

  const handleRecordBook = (e) => {
    e.preventDefault();
    dispatch(recordBorrowBook(email, bookId));
    dispatch(toggleRecordBookPopup());
  };

  return (
    // Outer container for the popup overlay, consistent with previous popups
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col z-50 overflow-auto py-24 px-4 font-inter">
      {/* Inner white popup container, consistent with previous popups */}
      <div className="w-full bg-white rounded-2xl shadow-2xl max-w-lg mx-auto p-8 transition-all relative">
        {/* Close Button - positioned absolutely for consistent placement (using a simple 'x' for now) */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold cursor-pointer"
          onClick={() => {
            dispatch(toggleRecordBookPopup());
          }}
          aria-label="Close Record Book Popup"
        >
          &times;
        </button>

        {/* Header - Adjusted to match consistent heading style */}
        <h3 className="text-3xl font-extrabold text-[#2C3E50] mb-6 text-center">
          Record Book
        </h3>

        <form onSubmit={handleRecordBook}>
          <div className="mb-8">
            {" "}
            {/* Increased bottom margin for consistency */}
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {" "}
              {/* Consistent label styling */}
              User Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Borrower's Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400" /* Consistent input styling */
              required
            />
          </div>

          {/* Buttons - Consistent styling and layout */}
          <div className="flex justify-end gap-4 pt-4">
            {" "}
            {/* Changed space-x-4 to gap-4 and added pt-4 */}
            <button
              className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105" /* Consistent button styling */
              type="button"
              onClick={() => {
                dispatch(toggleRecordBookPopup());
              }}
            >
              Close
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg font-bold text-white
                         bg-gradient-to-r from-blue-500 to-blue-600
                         hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out
                         shadow-lg transform hover:scale-105" /* Consistent button styling */
            >
              Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordBookPopup;
