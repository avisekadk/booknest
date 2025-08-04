import React from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { deleteBook } from "../store/slices/bookSlice";
import { toggleDeleteBookPopup } from "../store/slices/popUpSlice";
import { X } from "lucide-react";

const DeleteBookConfirmation = ({ bookId, bookTitle, onClose }) => {
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      await dispatch(deleteBook(bookId));
      onClose();
    } catch (error) {
      toast.error(error.message || "Failed to delete book.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 font-inter">
      <div className="w-full bg-white rounded-2xl shadow-2xl max-w-md mx-auto p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold cursor-pointer"
          onClick={onClose}
          aria-label="Close Delete Book Confirmation Popup"
        >
          <X size={24} />
        </button>
        <h3 className="text-3xl font-extrabold text-[#2C3E50] mb-6 text-center">
          Confirm Deletion
        </h3>
        <p className="mb-8 text-gray-700 text-center text-lg">
          Are you sure you want to delete "
          <span className="font-semibold text-red-600">{bookTitle}</span>"? This
          action cannot be undone.
        </p>
        <div className="flex justify-end gap-4 pt-4">
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-6 py-2 rounded-lg font-bold text-white bg-red-600 hover:bg-red-700 transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBookConfirmation;
