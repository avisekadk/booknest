// import React, { useState, useEffect, useMemo } from "react";
// import { PiKeyReturnBold } from "react-icons/pi";
// import { FaSquareCheck } from "react-icons/fa6";
// import { useDispatch, useSelector } from "react-redux";
// import { toast } from "react-toastify";
// import { fetchAllBooks } from "../store/slices/bookSlice";
// import {
//   fetchAllBorrowedBooks,
//   resetBorrowSlice,
// } from "../store/slices/borrowSlice";
// import ReturnBookPopup from "../popups/ReturnBookPopup";
// import Header from "../layout/Header";

// const Catalog = () => {
//   const dispatch = useDispatch();

//   const { loading, error, allBorrowedBooks, message } = useSelector(
//     (state) => state.borrow
//   );
//   // Fetching all books from the book slice to use as a fallback
//   const { allBooks } = useSelector((state) => state.book);

//   const [filter, setFilter] = useState("borrowed");
//   const [searchedKeyword, setSearchedKeyword] = useState("");

//   const [currentPage, setCurrentPage] = useState(1);
//   const [booksPerPage] = useState(10);

//   // Creating a book map for efficient title lookup
//   const bookMap = useMemo(() => {
//     if (!allBooks) return {};
//     return allBooks.reduce((acc, book) => {
//       acc[book._id] = book.title;
//       return acc;
//     }, {});
//   }, [allBooks]);

//   const formatDate = (timeStamp) => {
//     const date = new Date(timeStamp);
//     return `${String(date.getDate()).padStart(2, "0")}-${String(
//       date.getMonth() + 1
//     ).padStart(2, "0")}-${date.getFullYear()}`;
//   };

//   const formatDateAndTime = (timeStamp) => {
//     const date = new Date(timeStamp);
//     return `${String(date.getDate()).padStart(2, "0")}-${String(
//       date.getMonth() + 1
//     ).padStart(2, "0")}-${date.getFullYear()} ${String(
//       date.getHours()
//     ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
//   };

//   const currentDate = new Date();

//   const filteredAndSearchedBooks = allBorrowedBooks?.filter((book) => {
//     const dueDate = new Date(book.dueDate);
//     const isBorrowed = dueDate > currentDate && !book.returnDate;
//     const isOverdue = dueDate <= currentDate && !book.returnDate;

//     const matchesFilter = filter === "borrowed" ? isBorrowed : isOverdue;

//     const matchesSearch = searchedKeyword
//       ? book?.user?.name?.toLowerCase().includes(searchedKeyword.toLowerCase()) ||
//         book?.user?.email?.toLowerCase().includes(searchedKeyword.toLowerCase())
//       : true;

//     return matchesFilter && matchesSearch;
//   });

//   const indexOfLastBook = currentPage * booksPerPage;
//   const indexOfFirstBook = indexOfLastBook - booksPerPage;
//   const currentBooks = filteredAndSearchedBooks?.slice(
//     indexOfFirstBook,
//     indexOfLastBook
//   );
//   const totalPages = Math.ceil(
//     (filteredAndSearchedBooks?.length || 0) / booksPerPage
//   );

//   const paginate = (pageNumber) => {
//     if (pageNumber > 0 && pageNumber <= totalPages) {
//       setCurrentPage(pageNumber);
//     }
//   };

//   const handleFilterChange = (newFilter) => {
//     setFilter(newFilter);
//     setCurrentPage(1);
//   };

//   const handleSearch = (e) => {
//     setSearchedKeyword(e.target.value);
//     setCurrentPage(1);
//   };

//   const [showReturnPopup, setShowReturnPopup] = useState(false);
//   const [borrowedBookId, setBorrowedBookId] = useState("");
//   const [email, setEmail] = useState("");

//   const openReturnBookPopup = (bookId, email) => {
//     setBorrowedBookId(bookId);
//     setEmail(email);
//     setShowReturnPopup(true);
//   };

//   const closeReturnBookPopup = () => {
//     setShowReturnPopup(false);
//     setBorrowedBookId("");
//     setEmail("");
//   };

//   useEffect(() => {
//     dispatch(fetchAllBorrowedBooks());
//     dispatch(fetchAllBooks());
//   }, [dispatch, message]);

//   useEffect(() => {
//     if (message) {
//       toast.success(message);
//       dispatch(fetchAllBooks());
//       dispatch(fetchAllBorrowedBooks());
//       dispatch(resetBorrowSlice());
//     }
//     if (error) {
//       dispatch(resetBorrowSlice());
//     }
//   }, [dispatch, error, message]);

//   if (loading) {
//     return (
//       <div className="text-center mt-20 text-xl font-inter text-gray-700">
//         Loading...
//       </div>
//     );
//   }

//   return (
//     <>
//       <main className="relative flex-1 p-6 pt-28 font-inter bg-gray-100 min-h-screen">
//         <Header />
//         <header className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
//           <button
//             className={`py-3 px-6 rounded-lg font-bold transition duration-300 ease-in-out shadow-lg transform hover:scale-105 w-full sm:w-72
//               ${
//                 filter === "borrowed"
//                   ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
//                   : "bg-white text-blue-600 border-2 border-black shadow-md hover:bg-gray-100"
//               }`}
//             onClick={() => handleFilterChange("borrowed")}
//           >
//             Borrowed Books
//           </button>
//           <button
//             className={`py-3 px-6 rounded-lg font-bold transition duration-300 ease-in-out shadow-lg transform hover:scale-105 w-full sm:w-72
//               ${
//                 filter === "overdue"
//                   ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
//                   : "bg-white text-blue-600 border-2 border-black shadow-md hover:bg-gray-100"
//               }`}
//             onClick={() => handleFilterChange("overdue")}
//           >
//             Overdue Borrowers
//           </button>
//           <input
//             type="text"
//             placeholder="Search by user name or email..."
//             className="w-full sm:w-72 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
//             value={searchedKeyword}
//             onChange={handleSearch}
//           />
//         </header>

//         {currentBooks && currentBooks.length > 0 ? (
//           <div className="mt-6 overflow-x-auto bg-white rounded-2xl shadow-xl">
//             <table className="min-w-full border-collapse">
//               <thead>
//                 <tr className="bg-blue-50 text-blue-800 font-semibold text-left">
//                   <th className="px-6 py-3">ID</th>
//                   <th className="px-6 py-3">User Name</th>
//                   <th className="px-6 py-3">Email</th>
//                   <th className="px-6 py-3">Book</th>
//                   <th className="px-6 py-3 hidden sm:table-cell">Price</th>
//                   <th className="px-6 py-3 hidden md:table-cell">Due Date</th>
//                   <th className="px-6 py-3 hidden lg:table-cell">Borrowed On</th>
//                   <th className="px-6 py-3 text-center">Actions</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 {currentBooks.map((book, index) => (
//                   <tr
//                     key={book._id}
//                     className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
//                   >
//                     <td className="px-6 py-4 text-gray-800">
//                       {indexOfFirstBook + index + 1}
//                     </td>
//                     <td className="px-6 py-4 text-gray-800 font-medium">
//                       {book?.user?.name}
//                     </td>
//                     <td className="px-6 py-4 text-gray-700">
//                       {book?.user?.email}
//                     </td>
//                     <td className="px-6 py-4 text-gray-700 font-medium">
//                       {/* Using the bookMap for a more reliable lookup */}
//                       {book?.book?.title || bookMap[book?.book?._id] || "N/A"}
//                     </td>
//                     <td className="px-6 py-4 text-gray-700 hidden sm:table-cell">
//                       $ {book.price}
//                     </td>
//                     <td className="px-6 py-4 text-gray-700 hidden md:table-cell">
//                       {formatDate(book.dueDate)}
//                     </td>
//                     <td className="px-6 py-4 text-gray-700 hidden lg:table-cell">
//                       {formatDateAndTime(book.createdAt)}
//                     </td>
//                     <td className="px-6 py-4 flex gap-2 my-auto justify-center">
//                       {book.returnDate ? (
//                         <FaSquareCheck
//                           className="w-6 h-6 text-green-600"
//                           title="Returned"
//                         />
//                       ) : (
//                         <button
//                           onClick={() =>
//                             openReturnBookPopup(book._id, book?.user?.email)
//                           }
//                           className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition duration-200 transform hover:scale-110"
//                           title="Return Book"
//                           aria-label={`Return book ${book?.book?.title}`}
//                         >
//                           <PiKeyReturnBold className="w-6 h-6" />
//                         </button>
//                       )}
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ) : (
//           <h3 className="text-3xl mt-5 font-extrabold text-[#2C3E50] text-center">
//             No {filter === "borrowed" ? "borrowed" : "overdue"} books found
//             matching your search!!
//           </h3>
//         )}

//         {filteredAndSearchedBooks?.length > booksPerPage && (
//           <div className="flex justify-center items-center mt-8 space-x-2">
//             <button
//               onClick={() => paginate(currentPage - 1)}
//               disabled={currentPage === 1}
//               className="py-2 px-4 rounded-lg font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Previous
//             </button>
//             {Array.from({ length: totalPages }, (_, i) => (
//               <button
//                 key={i + 1}
//                 onClick={() => paginate(i + 1)}
//                 className={`py-2 px-4 rounded-lg font-bold transition duration-300
//                 ${
//                   currentPage === i + 1
//                     ? "bg-blue-600 text-white shadow-md"
//                     : "bg-gray-200 text-gray-700 hover:bg-gray-300"
//                 }`}
//               >
//                 {i + 1}
//               </button>
//             ))}
//             <button
//               onClick={() => paginate(currentPage + 1)}
//               disabled={currentPage === totalPages}
//               className="py-2 px-4 rounded-lg font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               Next
//             </button>
//           </div>
//         )}
//       </main>

//       {showReturnPopup && borrowedBookId && email && (
//         <ReturnBookPopup
//           bookId={borrowedBookId}
//           userEmail={email}
//           onClose={closeReturnBookPopup}
//         />
//       )}
//     </>
//   );
// };

// export default Catalog;

import React, { useState, useEffect, useMemo } from "react";
import { PiKeyReturnBold } from "react-icons/pi";
import { FaSquareCheck } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { fetchAllBooks } from "../store/slices/bookSlice";
import {
  fetchAllBorrowedBooks,
  resetBorrowSlice,
} from "../store/slices/borrowSlice";
import ReturnBookPopup from "../popups/ReturnBookPopup";
import Header from "../layout/Header";

const Catalog = () => {
  const dispatch = useDispatch();

  const { loading, error, allBorrowedBooks, message } = useSelector(
    (state) => state.borrow
  );
  // Fetching all books from the book slice
  const { books: allBooks } = useSelector((state) => state.book);

  const [filter, setFilter] = useState("borrowed");
  const [searchedKeyword, setSearchedKeyword] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [booksPerPage] = useState(10);

  // Creating a book map for efficient title lookup
  // This map will store book IDs and their titles
  const bookMap = useMemo(() => {
    // Return an empty object if allBooks is not available
    if (!allBooks || allBooks.length === 0) return {};
    return allBooks.reduce((acc, book) => {
      acc[book._id] = book.title;
      return acc;
    }, {});
  }, [allBooks]);

  const formatDate = (timeStamp) => {
    if (!timeStamp) return "N/A";
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()}`;
  };

  const formatDateAndTime = (timeStamp) => {
    if (!timeStamp) return "N/A";
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const currentDate = new Date();

  // Ensure allBorrowedBooks is an array before filtering
  const filteredAndSearchedBooks = (allBorrowedBooks || []).filter((book) => {
    const dueDate = book.dueDate ? new Date(book.dueDate) : null;
    const isBorrowed = dueDate && dueDate > currentDate && !book.returnDate;
    const isOverdue = dueDate && dueDate <= currentDate && !book.returnDate;

    const matchesFilter = filter === "borrowed" ? isBorrowed : isOverdue;

    const matchesSearch = searchedKeyword
      ? book?.user?.name?.toLowerCase().includes(searchedKeyword.toLowerCase()) ||
        book?.user?.email?.toLowerCase().includes(searchedKeyword.toLowerCase())
      : true;

    return matchesFilter && matchesSearch;
  });

  const indexOfLastBook = currentPage * booksPerPage;
  const indexOfFirstBook = indexOfLastBook - booksPerPage;
  const currentBooks = filteredAndSearchedBooks?.slice(
    indexOfFirstBook,
    indexOfLastBook
  );
  const totalPages = Math.ceil(
    (filteredAndSearchedBooks?.length || 0) / booksPerPage
  );

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1);
  };

  const handleSearch = (e) => {
    setSearchedKeyword(e.target.value);
    setCurrentPage(1);
  };

  const [showReturnPopup, setShowReturnPopup] = useState(false);
  const [borrowedBookId, setBorrowedBookId] = useState("");
  const [email, setEmail] = useState("");

  const openReturnBookPopup = (bookId, email) => {
    setBorrowedBookId(bookId);
    setEmail(email);
    setShowReturnPopup(true);
  };

  const closeReturnBookPopup = () => {
    setShowReturnPopup(false);
    setBorrowedBookId("");
    setEmail("");
  };

  useEffect(() => {
    // This effect runs once on component mount to fetch initial data
    dispatch(fetchAllBorrowedBooks());
    dispatch(fetchAllBooks());
  }, [dispatch]);

  useEffect(() => {
    if (message) {
      toast.success(message);
      // Re-fetch data after a successful action to update the UI
      dispatch(fetchAllBooks());
      dispatch(fetchAllBorrowedBooks());
      dispatch(resetBorrowSlice());
    }
    if (error) {
      toast.error(error); // Add a toast for the error
      dispatch(resetBorrowSlice());
    }
  }, [dispatch, error, message]);

  // Check if all data is loaded before rendering the table
  const isLoadingData = loading || !allBorrowedBooks || !allBooks || allBooks.length === 0;

  if (isLoadingData) {
    return (
      <div className="text-center mt-20 text-xl font-inter text-gray-700">
        Loading...
      </div>
    );
  }

  return (
    <>
      <main className="relative flex-1 p-6 pt-28 font-inter bg-gray-100 min-h-screen">
        <Header />
        <header className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
          <button
            className={`py-3 px-6 rounded-lg font-bold transition duration-300 ease-in-out shadow-lg transform hover:scale-105 w-full sm:w-72
              ${
                filter === "borrowed"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  : "bg-white text-blue-600 border-2 border-black shadow-md hover:bg-gray-100"
              }`}
            onClick={() => handleFilterChange("borrowed")}
          >
            Borrowed Books
          </button>
          <button
            className={`py-3 px-6 rounded-lg font-bold transition duration-300 ease-in-out shadow-lg transform hover:scale-105 w-full sm:w-72
              ${
                filter === "overdue"
                  ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white"
                  : "bg-white text-blue-600 border-2 border-black shadow-md hover:bg-gray-100"
              }`}
            onClick={() => handleFilterChange("overdue")}
          >
            Overdue Borrowers
          </button>
          <input
            type="text"
            placeholder="Search by user name or email..."
            className="w-full sm:w-72 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
            value={searchedKeyword}
            onChange={handleSearch}
          />
        </header>

        {currentBooks && currentBooks.length > 0 ? (
          <div className="mt-6 overflow-x-auto bg-white rounded-2xl shadow-xl">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-blue-50 text-blue-800 font-semibold text-left">
                  <th className="px-6 py-3">ID</th>
                  <th className="px-6 py-3">User Name</th>
                  <th className="px-6 py-3">Email</th>
                  <th className="px-6 py-3">Book</th>
                  <th className="px-6 py-3 hidden sm:table-cell">Price</th>
                  <th className="px-6 py-3 hidden md:table-cell">Due Date</th>
                  <th className="px-6 py-3 hidden lg:table-cell">Borrowed On</th>
                  <th className="px-6 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentBooks.map((book, index) => {
                  // Determine the book ID correctly, handling cases where it's an object or a string
                  const bookId = book?.book?._id || book?.book;
                  const bookTitle = bookMap[bookId];

                  return (
                    <tr
                      key={book._id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 text-gray-800">
                        {indexOfFirstBook + index + 1}
                      </td>
                      <td className="px-6 py-4 text-gray-800 font-medium">
                        {book?.user?.name || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {book?.user?.email || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-700 font-medium">
                        {bookTitle || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-700 hidden sm:table-cell">
                        $ {book.price || "N/A"}
                      </td>
                      <td className="px-6 py-4 text-gray-700 hidden md:table-cell">
                        {formatDate(book.dueDate)}
                      </td>
                      <td className="px-6 py-4 text-gray-700 hidden lg:table-cell">
                        {formatDateAndTime(book.createdAt)}
                      </td>
                      <td className="px-6 py-4 flex gap-2 my-auto justify-center">
                        {book.returnDate ? (
                          <FaSquareCheck
                            className="w-6 h-6 text-green-600"
                            title="Returned"
                          />
                        ) : (
                          <button
                            onClick={() =>
                              openReturnBookPopup(book._id, book?.user?.email)
                            }
                            className="p-2 rounded-full hover:bg-blue-100 text-blue-600 transition duration-200 transform hover:scale-110"
                            title="Return Book"
                            aria-label={`Return book ${bookTitle || ""}`}
                          >
                            <PiKeyReturnBold className="w-6 h-6" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <h3 className="text-3xl mt-5 font-extrabold text-[#2C3E50] text-center">
            No {filter === "borrowed" ? "borrowed" : "overdue"} books found
            matching your search!!
          </h3>
        )}

        {filteredAndSearchedBooks?.length > booksPerPage && (
          <div className="flex justify-center items-center mt-8 space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="py-2 px-4 rounded-lg font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i + 1}
                onClick={() => paginate(i + 1)}
                className={`py-2 px-4 rounded-lg font-bold transition duration-300
                ${
                  currentPage === i + 1
                    ? "bg-blue-600 text-white shadow-md"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="py-2 px-4 rounded-lg font-bold text-gray-700 bg-gray-200 hover:bg-gray-300 transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}
      </main>

      {showReturnPopup && borrowedBookId && email && (
        <ReturnBookPopup
          bookId={borrowedBookId}
          userEmail={email}
          onClose={closeReturnBookPopup}
        />
      )}
    </>
  );
};

export default Catalog;

