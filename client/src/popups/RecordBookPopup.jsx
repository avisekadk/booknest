import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { recordBorrowBook } from "../store/slices/borrowSlice";
import { toggleRecordBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";
import { X } from "lucide-react";

const RecordBookPopup = ({ bookId }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [prebookingUsers, setPrebookingUsers] = useState([]);
  const [selectedUserEmail, setSelectedUserEmail] = useState("");
  const [manualEntry, setManualEntry] = useState(false);

  useEffect(() => {
    const fetchPrebookingUsers = async () => {
      if (bookId) {
        try {
          const { data } = await axios.get(
            `http://localhost:4000/api/v1/prebook/users/${bookId}`,
            {
              withCredentials: true,
            }
          );
          const users = data?.users || [];
          setPrebookingUsers(users);
          if (users.length === 0) {
            setManualEntry(true);
            setSelectedUserEmail("");
          } else {
            setSelectedUserEmail(users[0].email);
            setManualEntry(false);
          }
        } catch (error) {
          console.error("Could not fetch prebooking users", error);
          setPrebookingUsers([]);
          setManualEntry(true);
          setSelectedUserEmail("");
        }
      }
    };
    fetchPrebookingUsers();
  }, [bookId]);

  const handleRecordBook = async (e) => {
    e.preventDefault();
    const finalEmail = manualEntry ? email : selectedUserEmail;
    if (!finalEmail) {
      toast.error("Please select a user or enter an email.");
      return;
    }

    try {
      await dispatch(recordBorrowBook(finalEmail, bookId));
      toast.success("Book recorded successfully!");
      dispatch(toggleRecordBookPopup());
    } catch (error) {
      console.error("Failed to record book:", error);
      toast.error(error.response?.data?.message || "Failed to record book.");
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 font-inter">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold cursor-pointer"
          onClick={() => dispatch(toggleRecordBookPopup())}
          aria-label="Close"
        >
          <X size={24} />
        </button>
        <h3 className="text-3xl font-extrabold text-[#2C3E50] mb-6 text-center">
          Record Borrow
        </h3>
        <form onSubmit={handleRecordBook}>
          {prebookingUsers.length > 0 && !manualEntry ? (
            <div className="mb-4">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select a user from the pre-booking list:
              </label>
              <select
                value={selectedUserEmail}
                onChange={(e) => setSelectedUserEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
              >
                {prebookingUsers.map((user) => (
                  <option key={user._id} value={user.email}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => {
                  setManualEntry(true);
                  setSelectedUserEmail("");
                }}
                className="text-sm text-blue-600 mt-2 hover:underline"
              >
                Or enter a different email manually
              </button>
            </div>
          ) : (
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Borrower's Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email address"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
                required
              />
              {prebookingUsers.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setManualEntry(false);
                    setEmail("");
                  }}
                  className="text-sm text-blue-600 mt-2 hover:underline"
                >
                  Or select from the pre-booking list
                </button>
              )}
            </div>
          )}
          <div className="flex justify-end gap-4 pt-4">
            <button
              type="button"
              onClick={() => dispatch(toggleRecordBookPopup())}
              className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
            >
              Record
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RecordBookPopup;
