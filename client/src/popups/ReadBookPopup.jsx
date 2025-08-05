import React from "react";

const ReadBookPopup = ({ book, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-auto p-4 font-inter">
      <div className="w-full bg-white rounded-2xl shadow-2xl max-w-4xl mx-auto p-8 transition-all relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold cursor-pointer"
          onClick={onClose}
          aria-label="Close Read Book Popup"
        >
          &times;
        </button>
        <h3 className="text-3xl font-extrabold text-[#2C3E50] mb-6 text-center">
          View Book Info
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-5">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Book Title
              </label>
              <p className="border border-gray-300 rounded-lg shadow-sm px-4 py-3 bg-gray-50 text-gray-800">
                {book?.title || "N/A"}
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">
                Author
              </label>
              <p className="border border-gray-300 rounded-lg shadow-sm px-4 py-3 bg-gray-50 text-gray-800">
                {book?.author || "N/A"}
              </p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              Description
            </label>
            <div className="border border-gray-300 rounded-lg shadow-sm px-4 py-3 bg-gray-50 text-gray-800 h-full overflow-y-auto">
              {book?.description || "N/A"}
            </div>
          </div>
        </div>
        <div className="flex justify-end pt-8">
          <button
            className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
            type="button"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReadBookPopup;