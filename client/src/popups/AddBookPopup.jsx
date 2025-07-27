import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addBook, fetchAllBooks } from "../store/slices/bookSlice";
import { toggleAddBookPopup } from "../store/slices/popUpSlice";

const AddBookPopup = () => {
  const dispatch = useDispatch();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [description, setDescription] = useState("");

  const resetForm = () => {
    setTitle("");
    setAuthor("");
    setPrice("");
    setQuantity("");
    setDescription("");
  };

  const handleAddBook = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("author", author);
    formData.append("price", price);
    formData.append("quantity", quantity);
    formData.append("description", description);

    await dispatch(addBook(formData));
    await dispatch(fetchAllBooks());

    dispatch(toggleAddBookPopup());
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    dispatch(toggleAddBookPopup());
  };

  return (
    // Removed 'items-center' and 'justify-center'.
    // Added 'flex flex-col' and kept 'py-24' to explicitly define top and bottom padding,
    // ensuring a visible gap from the viewport edges.
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col z-50 overflow-auto py-24 px-4 font-inter">
      <div className="w-full bg-white rounded-2xl shadow-2xl max-w-lg mx-auto p-8 transition-all">
        <h3 className="text-3xl font-extrabold text-[#2C3E50] mb-6 text-center">
          Add New Book
        </h3>
        <form onSubmit={handleAddBook} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Book Title
            </label>
            <input
              type="text"
              value={title}
              placeholder="Book title"
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Book Author
            </label>
            <input
              type="text"
              value={author}
              placeholder="Book Author"
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
              placeholder="Price"
              onChange={(e) => setPrice(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Quantity
            </label>
            <input
              type="number"
              value={quantity}
              placeholder="Book Quantity"
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              placeholder="Book Description"
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 resize-none"
            />
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
              onClick={handleClose}
            >
              Close
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg font-bold text-white
                         bg-gradient-to-r from-blue-500 to-blue-600
                         hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out
                         shadow-lg transform hover:scale-105"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBookPopup;
