import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux"; // Import useDispatch
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

import adminIcon from "../assets/pointing.png";
import usersIcon from "../assets/people-black.png";
import bookIcon from "../assets/book-square.png";
import logo from "../assets/black-logo.png";
import Header from "../layout/Header";
import { fetchAllBorrowedBooks } from "../store/slices/borrowSlice"; // Import the fetch action

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

const AdminDashboard = () => {
  const dispatch = useDispatch(); // Initialize useDispatch
  const { user } = useSelector((state) => state.auth || {});
  const { users = [] } = useSelector((state) => state.user || {});
  const { books = [] } = useSelector((state) => state.book || {});
  const { allBorrowedBooks = [] } = useSelector((state) => state.borrow || {});

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdmin, setTotalAdmin] = useState(0);
  const [totalBooks, setTotalBooks] = useState(books.length || 0);
  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);

  // Fetch borrowed books when component mounts
  useEffect(() => {
    dispatch(fetchAllBorrowedBooks());
  }, [dispatch]); // Dependency array ensures it runs only once on mount

  useEffect(() => {
    setTotalUsers(users.filter((u) => u.role === "User").length);
    setTotalAdmin(users.filter((u) => u.role === "Admin").length);
    setTotalBorrowedBooks(
      allBorrowedBooks.filter((b) => b.returnDate === null).length
    );
    setTotalReturnedBooks(
      allBorrowedBooks.filter((b) => b.returnDate !== null).length
    );

    // --- DEBUGGING LOGS ---
    console.log("AdminDashboard - allBorrowedBooks:", allBorrowedBooks);
    console.log("AdminDashboard - totalBorrowedBooks:", totalBorrowedBooks);
    console.log("AdminDashboard - totalReturnedBooks:", totalReturnedBooks);
    // --- END DEBUGGING LOGS ---
  }, [users, allBorrowedBooks, totalBorrowedBooks, totalReturnedBooks]); // Added totalBorrowedBooks and totalReturnedBooks to dependencies for re-calculation on change

  const data = {
    labels: ["Total Borrowed Books", "Total Returned Books"],
    datasets: [
      {
        data: [totalBorrowedBooks, totalReturnedBooks],
        backgroundColor: ["#1619cc", "#2079c2"], // Keeping original chart colors
        hoverOffset: 4,
      },
    ],
  };

  // Check if there's any data to display in the pie chart
  const hasChartData = totalBorrowedBooks > 0 || totalReturnedBooks > 0;

  return (
    <main className="relative flex-1 p-6 pt-28 font-inter bg-gray-100 min-h-screen">
      {" "}
      {/* Adjusted padding, added font, and a light background */}
      <Header />
      <div className="flex flex-col-reverse xl:flex-row gap-6">
        {" "}
        {/* Consistent gap */}
        {/* Left: Chart + Stats */}
        <div className="flex-[2] flex flex-col gap-6 py-4">
          {/* Chart Container - Applied consistent card styling */}
          <div className="bg-white rounded-2xl shadow-xl p-6 min-h-[300px] flex flex-col justify-center items-center">
            {" "}
            {/* Added min-h and flex properties for centering content */}
            <h3 className="text-xl font-semibold text-[#2C3E50] mb-4">
              Book Borrowing Overview
            </h3>{" "}
            {/* Added a title for the chart */}
            {hasChartData ? (
              <Pie
                data={data}
                options={{ cutout: 0 }}
                className="w-full h-auto max-w-[300px]" // Added max-width for better control
              />
            ) : (
              <p className="text-gray-600 text-center text-lg">
                No borrowing data available to display the chart.
              </p>
            )}
          </div>

          {/* Legend/Info Card - Applied consistent card styling */}
          <div className="flex items-center bg-white rounded-2xl shadow-xl p-6 gap-4">
            {" "}
            {/* Consistent card styling */}
            <img src={logo} alt="logo" className="w-12 h-12" />{" "}
            {/* Slightly larger logo */}
            <span className="w-[2px] bg-gray-300 h-16 rounded-full"></span>{" "}
            {/* Adjusted separator */}
            <div className="flex flex-col gap-2 text-base">
              {" "}
              {/* Adjusted text size */}
              <p className="flex gap-2 items-center text-gray-700 font-medium">
                <span className="w-3 h-3 rounded-full bg-[#1619cc] shadow-sm"></span>{" "}
                Borrowed Books
              </p>
              <p className="flex gap-2 items-center text-gray-700 font-medium">
                <span className="w-3 h-3 rounded-full bg-[#2079c2] shadow-sm"></span>{" "}
                Returned Books
              </p>
            </div>
          </div>
        </div>
        {/* Right: Summary Cards + Admin Info */}
        <div className="flex-[4] flex flex-col gap-6 xl:px-6 xl:py-4">
          <div className="flex flex-col-reverse lg:flex-row gap-6">
            {" "}
            {/* Consistent gap */}
            <div className="flex flex-col gap-6 flex-1">
              {" "}
              {/* Consistent gap */}
              {/* Users Card - UPDATED HOVER EFFECT AND GAP */}
              <div className="flex items-center bg-white p-6 rounded-2xl shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-2xl cursor-pointer">
                <div className="bg-blue-100 p-4 rounded-xl flex items-center justify-center shadow-md">
                  <img src={usersIcon} alt="users" className="w-7 h-7" />
                </div>
                <div className="ml-4">
                  {" "}
                  {/* Added ml-4 for gap */}
                  <p className="text-3xl font-extrabold text-[#2C3E50]">
                    {totalUsers}
                  </p>
                  <span className="text-base text-gray-600 font-medium">
                    Users
                  </span>
                </div>
              </div>
              {/* Books Card - UPDATED HOVER EFFECT AND GAP */}
              <div className="flex items-center bg-white p-6 rounded-2xl shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-2xl cursor-pointer">
                <div className="bg-blue-100 p-4 rounded-xl flex items-center justify-center shadow-md">
                  <img src={bookIcon} alt="books" className="w-7 h-7" />
                </div>
                <div className="ml-4">
                  {" "}
                  {/* Added ml-4 for gap */}
                  <p className="text-3xl font-extrabold text-[#2C3E50]">
                    {totalBooks}
                  </p>
                  <span className="text-base text-gray-600 font-medium">
                    Books
                  </span>
                </div>
              </div>
              {/* Admins Card - UPDATED HOVER EFFECT AND GAP */}
              <div className="flex items-center bg-white p-6 rounded-2xl shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-2xl cursor-pointer">
                <div className="bg-blue-100 p-4 rounded-xl flex items-center justify-center shadow-md">
                  <img src={adminIcon} alt="admins" className="w-7 h-7" />
                </div>
                <div className="ml-4">
                  {" "}
                  {/* Added ml-4 for gap */}
                  <p className="text-3xl font-extrabold text-[#2C3E50]">
                    {totalAdmin}
                  </p>
                  <span className="text-base text-gray-600 font-medium">
                    Admins
                  </span>
                </div>
              </div>
            </div>
            {/* Admin Profile Card - Applied consistent card styling */}
            <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center flex-1 text-center">
              {" "}
              {/* Consistent card styling */}
              <img
                src={
                  user?.avatar?.url ||
                  "https://placehold.co/96x96/e0e0e0/ffffff?text=User"
                } /* Added placeholder fallback */
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 shadow-sm" /* Consistent avatar styling */
              />
              <h3 className="text-xl font-extrabold text-[#2C3E50] mt-4 mb-2">
                {user?.name || "Admin"}
              </h3>{" "}
              {/* Consistent heading style, adjusted margin */}
              <p className="text-sm text-gray-600 font-medium">
                Welcome back, here's a snapshot of current stats.
              </p>
            </div>
          </div>

          {/* Quote Card - Applied consistent card styling */}
          <div className="bg-white p-6 rounded-2xl shadow-xl text-center text-lg font-semibold text-gray-800 relative">
            {" "}
            {/* Consistent card styling */}
            <h4>
              “Empowering through knowledge. Lead with wisdom, grow with books.”
            </h4>
            <p className="text-sm text-gray-500 absolute bottom-2 right-4"></p>{" "}
            {/* Kept original quote attribution style */}
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
