import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Pie } from "react-chartjs-2";
import Header from "../layout/Header";

// Import icons and images
import returnIcon from "../assets/redo.png";
import browseIcon from "../assets/pointing.png";
import bookIcon from "../assets/book-square.png";
import logo from "../assets/black-logo.png";
import { deleteNotification } from "../store/slices/notificationSlice"; // This import should now work

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
      <div className="flex flex-col-reverse xl:flex-row gap-6">
        {/* LEFT SIDE */}
        <div className="flex-[4] flex flex-col gap-6 lg:py-4 justify-between">
          {/* ... Cards ... */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            {/* Pre-Booked Books Card */}
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold mb-4">My Pre-Bookings</h3>
              {prebookings.length > 0 ? (
                prebookings.map((prebook) => (
                  <div
                    key={prebook._id}
                    className="border-b last:border-b-0 py-2"
                  >
                    <p>{prebook.bookId?.title}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">
                  You have no active pre-bookings.
                </p>
              )}
            </div>

            {/* Notification List Card */}
            <div className="bg-white p-6 rounded-2xl shadow-xl">
              <h3 className="text-xl font-bold mb-4">My Notification List</h3>
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className="flex justify-between items-center py-2 border-b last:border-b-0"
                  >
                    <p>
                      {notification.type === "availability" &&
                      notification.bookId ? (
                        <>
                          <span className="font-semibold text-green-700">
                            {notification.message}
                          </span>
                          <Link
                            to={`/book/${notification.bookId}`}
                            className="text-sm text-green-700 font-bold ml-2"
                          >
                            Pre-Book Now!
                          </Link>
                        </>
                      ) : (
                        <span>{notification.message}</span>
                      )}
                    </p>
                    <button
                      onClick={() =>
                        dispatch(deleteNotification(notification._id))
                      }
                      className="text-sm text-red-500 hover:text-red-700 font-bold"
                    >
                      Clear
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">You have no new notifications.</p>
              )}
            </div>
          </div>
        </div>
        {/* RIGHT SIDE */}
        <div className="flex-[2] flex flex-col gap-6 lg:flex-row lg:items-center xl:flex-col justify-between py-4">
          {/* Pie Chart Container */}
          <div className="bg-white rounded-2xl shadow-xl p-6 flex-1 flex flex-col justify-center items-center min-h-[300px]">
            <h3 className="text-xl font-semibold text-[#2C3E50] mb-4">
              Book Borrowing Overview
            </h3>
            {hasChartData ? (
              <Pie
                data={data}
                options={{ cutout: 0 }}
                className="w-full h-auto max-w-[300px]"
              />
            ) : (
              <p className="text-gray-600 text-center text-lg">
                No borrowing data available to display the chart.
              </p>
            )}
          </div>
          {/* Legend/Info Card */}
          <div className="flex items-center bg-white rounded-2xl shadow-xl p-6 gap-4 w-full">
            <img src={logo} alt="logo" className="w-12 h-12" />
            <span className="w-[2px] bg-gray-300 h-16 rounded-full"></span>
            <div className="flex flex-col gap-2 text-base">
              <p className="flex gap-2 items-center text-gray-700 font-medium">
                <span className="w-3 h-3 rounded-full bg-[#1619cc] shadow-sm"></span>
                Borrowed Books
              </p>
              <p className="flex gap-2 items-center text-gray-700 font-medium">
                <span className="w-3 h-3 rounded-full bg-[#2079c2] shadow-sm"></span>
                Returned Books
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};
export default UserDashboard;
