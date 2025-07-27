import React from "react";

const ReadBookPopup = ({ book, onClose }) => {
  return (
    // Outer container for the popup overlay, consistent with AddBookPopup
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col z-50 overflow-auto py-24 px-4 font-inter">
      {/* Inner white popup container, consistent with AddBookPopup */}
      <div className="w-full bg-white rounded-2xl shadow-2xl max-w-lg mx-auto p-8 transition-all relative">
        {" "}
        {/* Added 'relative' for absolute positioning of close button */}
        {/* Close Button - positioned absolutely for consistent placement */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold cursor-pointer" /* Adjusted styling for close button */
          onClick={onClose}
          aria-label="Close Read Book Popup"
        >
          &times;
        </button>
        {/* Header - Adjusted to match AddBookPopup's centered heading */}
        <h3 className="text-3xl font-extrabold text-[#2C3E50] mb-6 text-center">
          View Book Info
        </h3>
        <div className="p-0">
          {" "}
          {/* Removed padding as p-8 is on the parent div */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {" "}
              {/* Consistent label styling */}
              Book Title
            </label>
            <p className="border border-gray-300 rounded-lg shadow-sm px-4 py-3 bg-white">
              {" "}
              {/* Consistent display field styling */}
              {book?.title || "N/A"}
            </p>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {" "}
              {/* Consistent label styling */}
              Author
            </label>
            <p className="border border-gray-300 rounded-lg shadow-sm px-4 py-3 bg-white">
              {" "}
              {/* Consistent display field styling */}
              {book?.author || "N/A"}
            </p>
          </div>
          <div className="mb-8">
            {" "}
            {/* Increased bottom margin for consistency */}
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {" "}
              {/* Consistent label styling */}
              Description
            </label>
            <p className="border border-gray-300 rounded-lg shadow-sm px-4 py-3 bg-white">
              {" "}
              {/* Consistent display field styling */}
              {book?.description || "N/A"}
            </p>
          </div>
        </div>
        {/* Footer with Close Button - Consistent styling */}
        <div className="flex justify-end pt-4">
          {" "}
          {/* Removed bg-gray-100 and px-6 py-4 from here, added pt-4 */}
          <button
            className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105" /* Consistent button styling */
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
