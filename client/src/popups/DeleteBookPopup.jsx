import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { deleteBook } from "../store/slices/bookSlice"; // Make sure the path is correct
import { toggleDeleteBookPopup } from "../store/slices/popUpSlice"; // Make sure the path is correct
import { X } from "lucide-react"; // Assuming lucide-react is installed

const DeleteBookConfirmation = ({ bookId, bookTitle, onClose }) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      const message = await dispatch(deleteBook(bookId));
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to delete book.");
    }
  };

  return (
    // Outer container for the popup overlay, consistent with EditBookPopup
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col z-50 overflow-auto py-24 px-4 font-inter">
      {/* Inner white popup container, consistent with EditBookPopup */}
      <div className="w-full bg-white rounded-2xl shadow-2xl max-w-lg mx-auto p-8 transition-all relative">
        {/* Close Button - positioned absolutely for consistent placement */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold cursor-pointer"
          onClick={onClose}
          aria-label="Close Delete Book Confirmation Popup"
        >
          <X size={24} /> {/* Using Lucide icon for consistency */}
        </button>
        {/* Header - Adjusted to match EditBookPopup's centered heading */}
        <h3 className="text-3xl font-extrabold text-[#2C3E50] mb-6 text-center">
          Confirm Deletion
        </h3>
        <p className="mb-6 text-gray-700 text-center">
          {" "}
          {/* Centered text for consistency */}
          Are you sure you want to delete "
          <span className="font-semibold">{bookTitle}</span>"? This action
          cannot be undone.
        </p>
        {/* Footer with Buttons - Consistent styling and alignment */}
        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105 mr-3" // Consistent button styling, added mr-3 for spacing
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-6 py-2 rounded-lg font-semibold text-white bg-red-600 hover:bg-red-700 transition duration-300 ease-in-out transform hover:scale-105" // Consistent primary button styling, but red for delete
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBookConfirmation;
