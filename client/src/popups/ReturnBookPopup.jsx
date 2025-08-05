import React from "react";
import { useDispatch } from "react-redux";
import { returnBook } from "../store/slices/borrowSlice";
import { X } from "lucide-react";

const ReturnBookPopup = ({ bookId, userEmail, onClose }) => {
  const dispatch = useDispatch();

  const handleReturnBook = (e) => {
    e.preventDefault();
    dispatch(returnBook({ email: userEmail, id: bookId }));
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 font-inter">
      <div className="w-full bg-white rounded-2xl shadow-2xl max-w-sm mx-auto p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold cursor-pointer"
          onClick={onClose}
          aria-label="Close Return Book Popup"
        >
          <X size={24} />
        </button>

        <h3 className="text-2xl font-extrabold text-[#2C3E50] mb-6 text-center">
          Return Book
        </h3>

        <form onSubmit={handleReturnBook} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              User Email
            </label>
            <input
              type="email"
              value={userEmail}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-gray-100 text-gray-700 cursor-not-allowed"
              disabled
              readOnly
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
              onClick={onClose}
            >
              Close
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
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
