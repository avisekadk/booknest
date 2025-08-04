import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Book, LogIn } from "lucide-react";
import logo from "../assets/black-logo.png";

const LandingPage = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(25); // Display 25 books per page

  useEffect(() => {
    const fetchPublicBooks = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/book/public/all"
        );
        setBooks(data.books);
      } catch (error) {
        toast.error("Could not fetch the book catalog.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublicBooks();
  }, []);

  // Pagination Logic
  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = useMemo(() => {
    return books.slice(indexOfFirstBook, indexOfLastBook);
  }, [books, indexOfFirstBook, indexOfLastBook]);

  const totalPages = Math.ceil(books.length / booksPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 3;

    if (totalPages <= maxPageButtons + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);

      let startRange = Math.max(
        2,
        currentPage - Math.floor(maxPageButtons / 2)
      );
      let endRange = Math.min(
        totalPages - 1,
        currentPage + Math.floor(maxPageButtons / 2)
      );

      if (currentPage - 1 <= Math.floor(maxPageButtons / 2)) {
        endRange = maxPageButtons + 1;
      } else if (totalPages - currentPage <= Math.floor(maxPageButtons / 2)) {
        startRange = totalPages - maxPageButtons;
      }

      if (startRange > 2) {
        pageNumbers.push("...");
      }

      for (let i = startRange; i <= endRange; i++) {
        pageNumbers.push(i);
      }

      if (endRange < totalPages - 1) {
        pageNumbers.push("...");
      }

      if (!pageNumbers.includes(totalPages)) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers.map((number, idx) =>
      number === "..." ? (
        <span
          key={`dots-${idx}`}
          className="h-10 w-10 flex items-center justify-center text-gray-700"
        >
          ...
        </span>
      ) : (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`h-10 w-10 flex items-center justify-center rounded-lg font-semibold transition duration-200 ease-in-out border
                      ${
                        currentPage === number
                          ? "bg-blue-600 text-white shadow-md border-blue-600"
                          : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                      }`}
        >
          {number}
        </button>
      )
    );
  };

  return (
    <div className="bg-gray-50 min-h-screen font-inter flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center">
          <img src={logo} alt="BookNest Logo" className="h-10 w-auto" />
        </div>
        <Link
          to="/login"
          className="flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 shadow-md"
        >
          <LogIn size={20} />
          <span>Login / Register</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10">
        <section className="text-center mb-12 py-10 bg-gradient-to-r from-blue-50 to-blue-100 rounded-2xl shadow-lg">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4 leading-tight">
            Welcome to <span className="text-blue-600">BookNest</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto px-4">
            Your premier digital library for borrowing and reading books.
            Explore our vast collection, discover new worlds, and join a
            community of passionate readers.
          </p>
        </section>

        <section className="mt-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Book size={30} className="text-blue-600" />
            Our Collection
          </h2>
          {isLoading ? (
            <div className="text-center p-10 text-gray-700 text-lg">
              Loading books...
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {currentBooks.length > 0 ? (
                  currentBooks.map((book) => (
                    <Link
                      to={`/book/${book._id}`}
                      key={book._id}
                      className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group border border-gray-200"
                    >
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600">
                          {book.title}
                        </h3>
                        <p className="text-sm text-gray-600">
                          by {book.author}
                        </p>
                      </div>
                    </Link>
                  ))
                ) : (
                  <p className="col-span-full text-center text-gray-600 text-lg">
                    No books found in the collection.
                  </p>
                )}
              </div>
              {books.length > 0 && (
                <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
                  <div className="text-gray-700 text-lg font-semibold">
                    Results: {Math.min(indexOfFirstBook + 1, books.length)} -{" "}
                    {Math.min(indexOfLastBook, books.length)} of {books.length}
                  </div>
                  <div className="flex justify-center items-center gap-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="h-10 w-10 flex items-center justify-center rounded-lg bg-white text-gray-700 border border-gray-300 font-semibold shadow-sm
                               hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed
                               transition duration-200 ease-in-out"
                    >
                      &lt;
                    </button>
                    {renderPageNumbers()}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="h-10 w-10 flex items-center justify-center rounded-lg bg-white text-gray-700 border border-gray-300 font-semibold shadow-sm
                               hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed
                               transition duration-200 ease-in-out"
                    >
                      &gt;
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white mt-12 p-8 border-t border-gray-700">
        <div className="container mx-auto text-center">
          <h3 className="font-bold text-xl mb-3">Contact Us</h3>
          <p className="text-gray-300 mb-1">
            Email:{" "}
            <a
              href="mailto:yoyohey2025@gmail.com"
              className="text-blue-400 hover:underline"
            >
              yoyohey2025@gmail.com
            </a>
          </p>
          <p className="text-gray-300">
            Phone:{" "}
            <a
              href="tel:+9779812345678"
              className="text-blue-400 hover:underline"
            >
              9812345678
            </a>
          </p>
          <p className="mt-6 text-sm text-gray-400">
            &copy; {new Date().getFullYear()} BookNest. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
