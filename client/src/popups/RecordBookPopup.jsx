import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { recordBorrowBook } from "../store/slices/borrowSlice";
import { toggleRecordBookPopup } from "../store/slices/popUpSlice";
import { toast } from "react-toastify";

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
          // This endpoint needs to be created on the backend
          const { data } = await axios.get(`/api/v1/prebook/users/${bookId}`, {
            withCredentials: true,
          });
          const users = data?.users || [];
          setPrebookingUsers(users);
          // If no users are returned, switch to manual entry mode
          if (users.length === 0) {
            setManualEntry(true);
            setSelectedUserEmail(""); // Clear any previous selection
          } else {
            setSelectedUserEmail(users[0].email);
            setManualEntry(false); // Ensure we are not in manual mode
          }
        } catch (error) {
          console.error("Could not fetch prebooking users", error);
          // On error, default to manual entry and clear any prebooking data
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
    } catch (error) {
      console.error("Failed to record book:", error); // Log the full error
      toast.error(error.response?.data?.message || "Failed to record book.");
    } finally {
      dispatch(toggleRecordBookPopup());
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4 font-inter">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-8">
        <h3 className="text-3xl font-extrabold text-center mb-6 text-[#2C3E50]">
          Record Borrow
        </h3>
        <form onSubmit={handleRecordBook}>
          {prebookingUsers.length > 0 && !manualEntry ? (
            <div className="mb-4">
              <label className="block font-semibold mb-2">
                Select a user from the notification list:
              </label>
              <select
                value={selectedUserEmail}
                onChange={(e) => setSelectedUserEmail(e.target.value)}
                className="w-full p-3 border rounded-lg"
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
                  setSelectedUserEmail(""); // Clear selection when switching
                }}
                className="text-sm text-blue-600 mt-2 hover:underline"
              >
                Or enter a different email manually
              </button>
            </div>
          ) : (
            <div className="mb-8">
              <label className="block font-semibold mb-2">User Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Borrower's Email"
                className="w-full p-3 border rounded-lg"
                required
              />
              {prebookingUsers.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setManualEntry(false);
                    setEmail(""); // Clear email when switching
                  }}
                  className="text-sm text-blue-600 mt-2 hover:underline"
                >
                  Or select from the notification list
                </button>
              )}
            </div>
          )}
          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={() => dispatch(toggleRecordBookPopup())}
              className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
            >
              Close
            </button>
            <button
              type="submit"
              className="px-6 py-2 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
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
