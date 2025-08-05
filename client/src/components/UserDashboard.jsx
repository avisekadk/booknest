import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Pie } from "react-chartjs-2";
import Header from "../layout/Header";

// Import icons and images
import { Book, RotateCcw, Trash2 } from "lucide-react";
import { deleteNotification } from "../store/slices/notificationSlice";

// Chart.js imports and registration
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement,
} from "chart.js";
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  LineElement,
  PointElement,
  ArcElement
);

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { userBorrowedBooks = [] } = useSelector((state) => state.borrow || {});
  const { prebookings = [] } = useSelector((state) => state.prebook || {});
  const { notifications = [] } = useSelector(
    (state) => state.notification || {}
  );

  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);

  useEffect(() => {
    const numberOfTotalBorrowedBooks = userBorrowedBooks.filter(
      (book) => book.returned === false
    );
    const numberOfTotalReturnedBooks = userBorrowedBooks.filter(
      (book) => book.returned === true
    );

    setTotalBorrowedBooks(numberOfTotalBorrowedBooks.length);
    setTotalReturnedBooks(numberOfTotalReturnedBooks.length);
  }, [userBorrowedBooks]);

  const data = {
    labels: ["Borrowed Books", "Returned Books"],
    datasets: [
      {
        data: [totalBorrowedBooks, totalReturnedBooks],
        backgroundColor: ["#1619cc", "#2079c2"],
        hoverOffset: 4,
      },
    ],
  };

  const hasChartData = totalBorrowedBooks > 0 || totalReturnedBooks > 0;

  return (
    <main className="relative flex-1 p-6 pt-28 font-inter bg-gray-100 min-h-screen">
      <Header />
      <h2 className="text-2xl font-extrabold text-[#2C3E50] mb-8">
        Welcome, {user?.name}!
      </h2>
      <div className="flex flex-col-reverse xl:flex-row gap-6">
        {/* LEFT SIDE */}
        <div className="flex-[4] flex flex-col gap-6 lg:py-4">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center gap-6">
              <div className="p-4 rounded-xl bg-blue-500 text-white">
                <Book className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Books Currently Borrowed
                </p>
                <h3 className="text-3xl font-bold text-blue-700">
                  {totalBorrowedBooks}
                </h3>
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow-xl flex items-center gap-6">
              <div className="p-4 rounded-xl bg-cyan-500 text-white">
                <RotateCcw className="h-8 w-8" />
              </div>
              <div>
                <p className="text-sm text-gray-500 font-medium">
                  Books Returned
                </p>
                <h3 className="text-3xl font-bold text-cyan-700">
                  {totalReturnedBooks}
                </h3>
              </div>
            </div>
          </div>
          {/* Content Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Pre-Booked Books Card */}
            <div className="bg-white p-6 rounded-2xl shadow-xl min-h-[250px] flex flex-col">
              <h3 className="text-xl font-bold mb-4">My Pre-Bookings</h3>
              <div className="flex-1 overflow-y-auto">
                {prebookings.length > 0 ? (
                  prebookings.map((prebook) => (
                    <div
                      key={prebook._id}
                      className="border-b last:border-b-0 py-2"
                    >
                      <p className="text-sm font-medium text-gray-800">
                        {prebook.bookId?.title}
                      </p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm mt-2">
                    You have no active pre-bookings.
                  </p>
                )}
              </div>
            </div>

            {/* Notification List Card */}
            <div className="bg-white p-6 rounded-2xl shadow-xl min-h-[250px] flex flex-col">
              <h3 className="text-xl font-bold mb-4">My Notifications</h3>
              <div className="flex-1 overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((notification) => (
                    <div
                      key={notification._id}
                      className="flex justify-between items-center py-2 border-b last:border-b-0"
                    >
                      <p className="text-sm flex-1">
                        {/* MODIFIED LOGIC HERE */}
                        {notification.type === "availability" &&
                        notification.bookId ? (
                          <>
                            <span className="font-semibold text-green-700">
                              {notification.message}
                            </span>
                            <Link
                              to={`/book/${notification.bookId}`}
                              className="text-xs text-green-700 hover:underline font-bold ml-2 whitespace-nowrap"
                            >
                              Pre-Book Now!
                            </Link>
                          </>
                        ) : notification.type === "overdue" ? (
                          <span className="font-semibold text-red-700">
                            {notification.message}
                          </span>
                        ) : (
                          <span className="text-gray-800">
                            {notification.message}
                          </span>
                        )}
                      </p>
                      <button
                        onClick={() =>
                          dispatch(deleteNotification(notification._id))
                        }
                        className="text-red-500 hover:text-red-700 ml-2"
                        title="Clear Notification"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm mt-2">
                    You have no new notifications.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* RIGHT SIDE */}
        <div className="flex-[2] flex flex-col gap-6 lg:flex-row lg:items-center xl:flex-col justify-between py-4">
          {/* Pie Chart Container */}
          <div className="bg-white rounded-2xl shadow-xl p-6 flex-1 flex flex-col justify-center items-center w-full min-h-[300px]">
            <h3 className="text-xl font-semibold text-[#2C3E50] mb-4">
              Book Borrowing Overview
            </h3>
            {hasChartData ? (
              <div className="w-full h-auto max-w-[300px]">
                <Pie data={data} options={{ cutout: 0 }} />
              </div>
            ) : (
              <p className="text-gray-600 text-center text-lg">
                No borrowing data available to display the chart.
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};
export default UserDashboard;
