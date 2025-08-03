import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; // Import Link for navigation
import { useSelector } from "react-redux";
import { Pie } from "react-chartjs-2";
import Header from "../layout/Header";

// Import icons and images
import logo_with_title from "../assets/logo-with-title-black.png";
import returnIcon from "../assets/redo.png";
import browseIcon from "../assets/pointing.png";
import bookIcon from "../assets/book-square.png";
import logo from "../assets/black-logo.png";

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
  const { settingPopup } = useSelector((state) => state.popup || {});
  const { userBorrowedBooks = [] } = useSelector((state) => state.borrow || {});

  // Safely destructure prebookings and notifications from the Redux store
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
        {/* LEFT SIDE - User Stats and Quote */}
        <div className="flex-[4] flex flex-col gap-6 lg:py-4 justify-between">
          <div className="flex flex-col gap-6">
            {/* Top Row Cards */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Borrowed Books Card */}
              <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-2xl flex-1 cursor-pointer">
                <span className="w-[2px] bg-[#0003CB] h-14 rounded-full"></span>
                <span className="bg-blue-100 h-14 w-14 flex justify-center items-center rounded-xl p-4 shadow-md">
                  <img src={bookIcon} alt="book-icon" className="w-6 h-6" />
                </span>
                <div className="flex flex-col">
                  <p className="text-3xl font-extrabold text-[#2C3E50]">
                    {totalBorrowedBooks}
                  </p>
                  <span className="text-base text-gray-600 font-medium">
                    Borrowed Books
                  </span>
                </div>
              </div>
              {/* Returned Books Card */}
              <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-2xl flex-1 cursor-pointer">
                <span className="w-[2px] bg-[#2079C2] h-14 rounded-full"></span>
                <span className="bg-blue-100 h-14 w-14 flex justify-center items-center rounded-xl p-4 shadow-md">
                  <img src={returnIcon} alt="return-icon" className="w-6 h-6" />
                </span>
                <div className="flex flex-col">
                  <p className="text-3xl font-extrabold text-[#2C3E50]">
                    {totalReturnedBooks}
                  </p>
                  <span className="text-base text-gray-600 font-medium">
                    Returned Books
                  </span>
                </div>
              </div>
            </div>
            {/* Bottom Row Cards */}
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Browse Books Inventory Card */}
              <div className="flex items-center gap-4 bg-white p-6 rounded-2xl shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-2xl flex-1 cursor-pointer">
                <span className="w-[2px] bg-gray-300 h-14 rounded-full"></span>
                <span className="bg-blue-100 h-14 w-14 flex justify-center items-center rounded-xl p-4 shadow-md">
                  <img src={browseIcon} alt="browse-icon" className="w-6 h-6" />
                </span>
                <p className="text-lg xl:text-xl font-semibold text-[#2C3E50]">
                  Let's browse books inventory
                </p>
              </div>
            </div>
          </div>
          {/* Quote Card */}
          <div className="bg-white p-6 text-xl font-semibold text-[#2C3E50] relative flex justify-center items-center rounded-2xl shadow-xl min-h-40">
            <h4 className="overflow-y-hidden text-center">
              “Reading is to the mind what exercise is to the body.”
            </h4>
            <p className="text-gray-600 text-sm absolute right-6 bottom-3">
              ~ Book Nest Developers
            </p>
          </div>
        </div>
        {/* RIGHT SIDE - Pie Chart and Legend */}
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
      {/* --- NEW SECTION FOR PRE-BOOKINGS AND NOTIFICATIONS --- */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
        {/* Pre-Booked Books Card */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-bold mb-4">My Pre-Bookings</h3>
          {/* Map through prebookings here */}
          {prebookings.length > 0 ? (
            prebookings.map((prebook) => (
              <div key={prebook.id} className="border-b last:border-b-0 py-2">
                <p>{prebook.title}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">You have no active pre-bookings.</p>
          )}
        </div>

        {/* Notification List Card */}
        <div className="bg-white p-6 rounded-2xl shadow-xl">
          <h3 className="text-xl font-bold mb-4">My Notification List</h3>
          {/* Map through notifications here */}
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <div
                key={notification.id}
                className="flex justify-between items-center py-2 border-b last:border-b-0"
              >
                <p>
                  {notification.isAvailable ? (
                    <span className="font-semibold text-green-700">
                      {notification.title} is now available!
                    </span>
                  ) : (
                    <span>{notification.title}</span>
                  )}
                </p>
                {notification.isAvailable ? (
                  <Link
                    to={`/book/${notification.bookId}`}
                    className="text-sm text-green-700 font-bold"
                  >
                    Pre-Book Now!
                  </Link>
                ) : (
                  <span className="text-sm text-gray-500">Waiting</span>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              You are not subscribed to any book notifications.
            </p>
          )}
        </div>
      </div>
      {/* --- END OF NEW SECTION --- */}
    </main>
  );
};

export default UserDashboard;
