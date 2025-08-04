// client/src/popups/EditBookPopup.jsx

import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
// Import the new quantity actions
import {
  updateBook,
  incrementQuantity,
  decrementQuantity,
} from "../store/slices/bookSlice";
import { X } from "lucide-react";

const EditBookPopup = ({ book, onClose }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(book.title || "");
  const [author, setAuthor] = useState(book.author || "");
  const [description, setDescription] = useState(book.description || "");
  // Quantity is now managed via Redux state from the book prop
  const [price, setPrice] = useState(book.price || 0);

  useEffect(() => {
    if (book) {
      setTitle(book.title || "");
      setAuthor(book.author || "");
      setDescription(book.description || "");
      setPrice(book.price || 0);
    }
  }, [book]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !author || !description || price <= 0) {
      toast.error("Please fill all fields and ensure price is positive.");
      return;
    }
    // The main update is now only for text fields and price.
    const updatedBookData = { title, author, description, price };
    try {
      await dispatch(updateBook(book._id, updatedBookData));
      onClose();
    } catch (error) {
      toast.error("Failed to update book. Please try again.");
    }
  };

  // New handlers for the + and - buttons
  const handleIncrement = () => {
    dispatch(incrementQuantity(book._id));
  };
  const handleDecrement = () => {
    if (book.quantity > 0) {
      dispatch(decrementQuantity(book._id));
    } else {
      toast.error("Quantity cannot be less than zero.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col z-50 overflow-auto py-24 px-4 font-inter">
      <div className="w-full bg-white rounded-2xl shadow-2xl max-w-lg mx-auto p-8 transition-all relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900"
          onClick={onClose}
        >
          <X size={24} />
        </button>
        <h3 className="text-3xl font-extrabold text-[#2C3E50] mb-6 text-center">
          Edit Book
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title, Author, Description, Price inputs remain the same */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Book Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Author
            </label>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              rows="7"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg"
              required
            />
          </div>

          {/* New UI for quantity management */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Quantity
              </label>
              <div className="flex items-center gap-4 mt-1">
                <button
                  type="button"
                  onClick={handleDecrement}
                  className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg"
                >
                  -
                </button>
                <span className="text-xl font-bold w-12 text-center">
                  {book.quantity}
                </span>
                <button
                  type="button"
                  onClick={handleIncrement}
                  className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg"
                >
                  +
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Price
              </label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-gray-400 mr-3"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg font-semibold text-white bg-blue-600"
            >
              Update Details
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookPopup;
