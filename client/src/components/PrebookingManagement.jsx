// client/src/components/PrebookingManagement.jsx

import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../layout/Header";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { recordBorrowBook } from "../store/slices/borrowSlice";

const PrebookingManagement = () => {
  const [prebookings, setPrebookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();

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
    // Dispatch the existing action to record the borrow
    await dispatch(recordBorrowBook(userEmail, bookId));
    // After dispatching, refresh the list of pre-bookings
    fetchPrebookings();
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <main className="relative flex-1 p-6 pt-28 font-inter bg-gray-100 min-h-screen">
      <Header />
      <h2 className="text-3xl font-extrabold text-[#2C3E50] mb-6">
        Pre-booking Requests
      </h2>
      <div className="mt-6 overflow-x-auto bg-white rounded-2xl shadow-xl">
        <table className="min-w-full border-collapse">
          <thead>
            {/* ... table head remains the same ... */}
            <tr className="bg-blue-50 text-blue-800 font-semibold text-left">
              <th className="px-6 py-3">Book Title</th>
              <th className="px-6 py-3">User Name</th>
              <th className="px-6 py-3">User Email</th>
              <th className="px-6 py-3">Pre-booked At</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Filter out items with null bookId or userId before mapping */}
            {prebookings
              .filter((item) => item.bookId && item.userId)
              .map((item) => (
                <tr key={item._id}>
                  {/* Use optional chaining on bookId and provide a fallback */}
                  <td className="px-6 py-4">
                    {item.bookId?.title || (
                      <span className="text-red-500">[Book Deleted]</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {item.userId?.name || (
                      <span className="text-red-500">[User Deleted]</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {item.userId?.email || (
                      <span className="text-red-500">[User Deleted]</span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    {new Date(item.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      onClick={() =>
                        handleRecordBorrow(item.bookId._id, item.userId.email)
                      }
                      className="px-4 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                      // Disable button if book is deleted
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
    </main>
  );
};

export default PrebookingManagement;
