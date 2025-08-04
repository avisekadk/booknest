import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
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
    const updatedBookData = { title, author, description, price };
    try {
      await dispatch(updateBook(book._id, updatedBookData));
      onClose();
    } catch (error) {
      toast.error("Failed to update book. Please try again.");
    }
  };

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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto p-4 font-inter">
      <div className="w-full bg-white rounded-2xl shadow-2xl max-w-4xl mx-auto p-8 transition-all relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold cursor-pointer"
          onClick={onClose}
          aria-label="Close Edit Book Popup"
        >
          <X size={24} />
        </button>
        <h3 className="text-3xl font-extrabold text-[#2C3E50] mb-6 text-center">
          Edit Book
        </h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
            {/* Title spans both columns */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Book Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                required
              />
            </div>

            {/* Left Column for Author, Price, and Quantity */}
            <div className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Author
                </label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Price
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                  min="0"
                  step="0.01"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Quantity
                </label>
                <div className="flex items-center gap-4 mt-1">
                  <button
                    type="button"
                    onClick={handleDecrement}
                    className="px-4 py-2 bg-red-500 text-white font-bold rounded-lg hover:bg-red-600 transition"
                  >
                    -
                  </button>
                  <span className="text-xl font-bold w-12 text-center text-gray-800">
                    {book.quantity}
                  </span>
                  <button
                    type="button"
                    onClick={handleIncrement}
                    className="px-4 py-2 bg-green-500 text-white font-bold rounded-lg hover:bg-green-600 transition"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column for Description */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Description
              </label>
              <textarea
                rows={10} // Adjusted rows to better fit the new layout
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none"
                required
              />
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
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
