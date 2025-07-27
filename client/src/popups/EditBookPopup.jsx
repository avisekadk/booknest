import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { updateBook } from "../store/slices/bookSlice";
import { toggleEditBookPopup } from "../store/slices/popUpSlice";
import { X } from "lucide-react"; // Assuming lucide-react is installed

const EditBookPopup = ({ book, onClose }) => {
  const dispatch = useDispatch();
  const [title, setTitle] = useState(book.title || "");
  const [author, setAuthor] = useState(book.author || "");
  const [description, setDescription] = useState(book.description || "");
  const [genre, setGenre] = useState(book.genre || "");
  const [quantity, setQuantity] = useState(book.quantity || 0);
  const [price, setPrice] = useState(book.price || 0);

  // Effect to update state if the 'book' prop changes (though ideally, it shouldn't once opened)
  useEffect(() => {
    if (book) {
      setTitle(book.title || "");
      setAuthor(book.author || "");
      setDescription(book.description || "");
      setGenre(book.genre || "");
      setQuantity(book.quantity || 0);
      setPrice(book.price || 0);
    }
  }, [book]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (
      !title ||
      !author ||
      !description ||
      !genre ||
      quantity <= 0 ||
      price <= 0
    ) {
      toast.error(
        "Please fill all fields and ensure quantity/price are positive."
      );
      return;
    }

    const updatedBookData = {
      title,
      author,
      description,
      genre,
      quantity,
      price,
    };

    try {
      await dispatch(updateBook(book._id, updatedBookData));
      toast.success("Book updated successfully!");
      onClose(); // Close popup on success
    } catch (error) {
      toast.error("Failed to update book. Please try again.");
      console.error("Update book failed:", error);
    }
  };

  return (
    // Outer container for the popup overlay, consistent with ReadBookPopup
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col z-50 overflow-auto py-24 px-4 font-inter">
      {/* Inner white popup container, consistent with ReadBookPopup */}
      <div className="w-full bg-white rounded-2xl shadow-2xl max-w-lg mx-auto p-8 transition-all relative">
        {/* Close Button - positioned absolutely for consistent placement */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold cursor-pointer"
          onClick={onClose}
          aria-label="Close Edit Book Popup"
        >
          <X size={24} /> {/* Using Lucide icon for consistency */}
        </button>
        {/* Header - Adjusted to match ReadBookPopup's centered heading */}
        <h3 className="text-3xl font-extrabold text-[#2C3E50] mb-6 text-center">
          Edit Book
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="mb-4">
            {" "}
            {/* Added mb-4 for consistent spacing */}
            <label
              htmlFor="title"
              className="block text-sm font-semibold text-gray-700 mb-1" // Consistent label styling
            >
              Book Title
            </label>
            <input
              type="text"
              id="title"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white" // Consistent input styling
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            {" "}
            {/* Added mb-4 for consistent spacing */}
            <label
              htmlFor="author"
              className="block text-sm font-semibold text-gray-700 mb-1" // Consistent label styling
            >
              Author
            </label>
            <input
              type="text"
              id="author"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white" // Consistent input styling
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            {" "}
            {/* Added mb-4 for consistent spacing */}
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700 mb-1" // Consistent label styling
            >
              Description
            </label>
            <textarea
              id="description"
              rows="7"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white" // Consistent input styling
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="mb-4">
            {" "}
            {/* Added mb-4 for consistent spacing */}
            <label
              htmlFor="genre"
              className="block text-sm font-semibold text-gray-700 mb-1" // Consistent label styling
            >
              Genre
            </label>
            <input
              type="text"
              id="genre"
              className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white" // Consistent input styling
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4 mb-8">
            {" "}
            {/* Adjusted margin-bottom for consistency */}
            <div>
              <label
                htmlFor="quantity"
                className="block text-sm font-semibold text-gray-700 mb-1" // Consistent label styling
              >
                Quantity
              </label>
              <input
                type="number"
                id="quantity"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white" // Consistent input styling
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                min="0"
                required
              />
            </div>
            <div>
              <label
                htmlFor="price"
                className="block text-sm font-semibold text-gray-700 mb-1" // Consistent label styling
              >
                Price
              </label>
              <input
                type="number"
                id="price"
                className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white" // Consistent input styling
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                min="0"
                step="0.01" // Allows decimal prices
                required
              />
            </div>
          </div>
          {/* Footer with Buttons - Consistent styling */}
          <div className="flex justify-end pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105 mr-3" // Consistent button styling, added mr-3 for spacing
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg font-semibold text-white bg-blue-600 hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-105" // Consistent primary button styling
            >
              Update Book
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBookPopup;
