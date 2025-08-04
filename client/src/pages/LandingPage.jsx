import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { Book, LogIn } from "lucide-react";
import logo from "../assets/black-logo.png";

const LandingPage = () => {
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPublicBooks = async () => {
      try {
        // This is a new public endpoint that doesn't require authentication
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

  return (
    <div className="bg-gray-50 min-h-screen font-inter">
      {/* Header */}
      <header className="bg-white shadow-md p-4 flex justify-between items-center sticky top-0 z-40">
        <div className="flex items-center">
          <img src={logo} alt="BookNest Logo" className="h-10 w-auto" />
        </div>
        <Link
          to="/login"
          className="flex items-center gap-2 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
        >
          <LogIn size={20} />
          <span>Login / Register</span>
        </Link>
      </header>

      {/* Main Content */}
      <main className="p-6 md:p-10">
        <section className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-4">
            Welcome to BookNest
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your premier digital library for borrowing and reading books.
            Explore our vast collection, discover new worlds, and join a
            community of passionate readers.
          </p>
        </section>

        <section>
          <h2 className="text-3xl font-bold text-gray-800 mb-6 flex items-center gap-3">
            <Book size={30} />
            Our Collection
          </h2>
          {isLoading ? (
            <div className="text-center p-10">Loading books...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {books.map((book) => (
                <Link
                  to={`/book/${book._id}`}
                  key={book._id}
                  className="bg-white rounded-lg shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group"
                >
                  <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-900 truncate group-hover:text-blue-600">
                      {book.title}
                    </h3>
                    <p className="text-sm text-gray-600">by {book.author}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white mt-12 p-6 border-t">
        <div className="text-center text-gray-600">
          <h3 className="font-bold text-lg mb-2">Contact Us</h3>
          <p>Email: support@booknest.com</p>
          <p>Phone: (123) 456-7890</p>
          <p className="mt-4 text-sm">
            &copy; {new Date().getFullYear()} BookNest. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
