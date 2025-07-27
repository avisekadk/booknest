import React from "react";
import { useDispatch } from "react-redux";
import { returnBook } from "../store/slices/borrowSlice";

const ReturnBookPopup = ({ bookId, userEmail, onClose }) => {
  const dispatch = useDispatch();

  const handleReturnBook = (e) => {
    e.preventDefault();
    console.log("ReturnBookPopup - returning book with id:", bookId);
    console.log("ReturnBookPopup - user email:", userEmail);
    // dispatch with object {email, id}
    dispatch(returnBook({ email: userEmail, id: bookId }));
    onClose();
  };

  return (
    // Outer container for the popup overlay, consistent with previous popups
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col z-50 overflow-auto py-24 px-4 font-inter">
      {/* Inner white popup container, consistent with previous popups */}
      <div className="w-full bg-white rounded-2xl shadow-2xl max-w-lg mx-auto p-8 transition-all relative">
        {/* Close Button - positioned absolutely for consistent placement */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold cursor-pointer"
          onClick={onClose}
          aria-label="Close Return Book Popup"
        >
          &times;
        </button>

        {/* Header - Adjusted to match consistent heading style */}
        <h3 className="text-3xl font-extrabold text-[#2C3E50] mb-6 text-center">
          Return Book
        </h3>

        <form onSubmit={handleReturnBook}>
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
              value={userEmail}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-gray-100" /* Consistent input styling, keeping disabled/readOnly */
              disabled
              readOnly
            />
          </div>

          {/* Buttons - Consistent styling and layout */}
          <div className="flex justify-end gap-4 pt-4">
            {" "}
            {/* Changed space-x-4 to gap-4 and added pt-4 */}
            <button
              type="button"
              className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105" /* Consistent button styling */
              onClick={onClose}
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
              Return
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReturnBookPopup;
