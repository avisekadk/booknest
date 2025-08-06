import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../layout/Header";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { recordBorrowBook } from "../store/slices/borrowSlice";

const PrebookingManagement = () => {
  const [prebookings, setPrebookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchPrebookings = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/prebook/admin/all",
        { withCredentials: true }
      );
      setPrebookings(data.prebookings);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch pre-bookings.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPrebookings();
  }, [dispatch]);

  const handleRecordBorrow = async (bookId, userEmail) => {
    if (!bookId || !userEmail) {
      toast.error("Missing book or user information to record the borrow.");
      return;
    }
    await dispatch(recordBorrowBook(userEmail, bookId));
    fetchPrebookings();
  };

  const formatDate = (timeStamp) => {
    if (!timeStamp) return "N/A";
    const date = new Date(timeStamp);
    return `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${date.getFullYear()} ${String(
      date.getHours()
    ).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const filteredPrebookings = prebookings.filter(
    (item) =>
      item.bookId?.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userId?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.userId?.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPrebookings.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(filteredPrebookings.length / itemsPerPage);

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

  if (isLoading)
    return (
      <div className="text-center mt-20 text-xl font-inter text-gray-700">
        Loading...
      </div>
    );

  return (
    <main className="relative flex-1 p-6 pt-28 font-inter bg-gray-100 min-h-screen">
      <Header />
      <h2 className="text-2xl font-extrabold text-[#2C3E50] mb-6">
        Pre-booking Requests
      </h2>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search by book title, user name, or email..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="w-1/2 max-w-sm px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      {filteredPrebookings.length > 0 ? (
        <>
          <div className="mt-6 overflow-x-auto bg-white rounded-2xl shadow-xl">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-blue-50 text-blue-800 font-semibold text-left text-sm">
                  <th className="px-4 py-3">Book Title</th>
                  <th className="px-4 py-3 min-w-[150px]">User</th>
                  <th className="px-4 py-3">Pre-booked At</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems
                  .filter((item) => item.bookId && item.userId)
                  .map((item, index) => (
                    <tr
                      key={item._id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 text-gray-800 font-medium text-sm">
                        {item.bookId?.title || (
                          <span className="text-red-500">[Book Deleted]</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex flex-col">
                          <p className="font-medium text-gray-800">
                            {item.userId?.name || (
                              <span className="text-red-500">
                                [User Deleted]
                              </span>
                            )}
                          </p>
                          <p className="text-gray-600 text-xs mt-1">
                            {item.userId?.email || (
                              <span className="text-red-500">
                                [User Deleted]
                              </span>
                            )}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700 text-sm">
                        {formatDate(item.createdAt)}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <button
                          onClick={() =>
                            handleRecordBorrow(
                              item.bookId._id,
                              item.userId.email
                            )
                          }
                          className="px-3 py-1.5 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition text-sm"
                          disabled={!item.bookId}
                        >
                          Record Borrow
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
            <div className="text-gray-700 text-lg font-semibold">
              Results:{" "}
              {Math.min(indexOfFirstItem + 1, filteredPrebookings.length)} -{" "}
              {Math.min(indexOfLastItem, filteredPrebookings.length)} of{" "}
              {filteredPrebookings.length}
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
        </>
      ) : (
        <h3 className="text-3xl mt-5 font-extrabold text-[#2C3E50] text-center">
          No pre-booking requests found!
        </h3>
      )}
    </main>
  );
};

export default PrebookingManagement;
