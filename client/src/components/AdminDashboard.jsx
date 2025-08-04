import React, { useState, useEffect } from "react";
import { Pie } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
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
import { fetchAllBorrowedBooks } from "../store/slices/borrowSlice";

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
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth || {});
  const { users = [] } = useSelector((state) => state.user || {});
  const { books = [] } = useSelector((state) => state.book || {});
  const { allBorrowedBooks = [] } = useSelector((state) => state.borrow || {});

  const [totalUsers, setTotalUsers] = useState(0);
  const [totalAdmin, setTotalAdmin] = useState(0);
  const [totalBooks, setTotalBooks] = useState(books.length || 0);
  const [totalBorrowedBooks, setTotalBorrowedBooks] = useState(0);
  const [totalReturnedBooks, setTotalReturnedBooks] = useState(0);

  useEffect(() => {
    dispatch(fetchAllBorrowedBooks());
  }, [dispatch]);

  useEffect(() => {
    setTotalUsers(users.filter((u) => u.role === "User").length);
    setTotalAdmin(users.filter((u) => u.role === "Admin").length);
    setTotalBorrowedBooks(
      allBorrowedBooks.filter((b) => b.returnDate === null).length
    );
    setTotalReturnedBooks(
      allBorrowedBooks.filter((b) => b.returnDate !== null).length
    );
  }, [users, allBorrowedBooks]);

  const data = {
    labels: ["Total Borrowed Books", "Total Returned Books"],
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
    <main className="relative flex-1 pt-28 font-inter bg-gray-100 min-h-screen">
      <Header />
      <div className="flex flex-col xl:flex-row gap-6 p-6">
        {/* Left: Chart + Stats */}
        <div className="flex-[2] flex flex-col gap-6 py-4">
          {/* Chart Container */}
          <div className="bg-white rounded-2xl shadow-xl p-6 min-h-[300px] flex flex-col justify-center items-center">
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
        </div>
        {/* Right: Summary Cards + Admin Info */}
        <div className="flex-[4] flex flex-col gap-6 py-4">
          <div className="flex flex-col-reverse lg:flex-row gap-6">
            <div className="flex flex-col gap-6 flex-1">
              {/* Users Card */}
              <div className="flex items-center bg-white p-6 rounded-2xl shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-2xl cursor-pointer">
                <div className="bg-blue-100 p-4 rounded-xl flex items-center justify-center shadow-md">
                  <img src={usersIcon} alt="users" className="w-7 h-7" />
                </div>
                <div className="ml-4">
                  <p className="text-3xl font-extrabold text-[#2C3E50]">
                    {totalUsers}
                  </p>
                  <span className="text-base text-gray-600 font-medium">
                    Users
                  </span>
                </div>
              </div>
              {/* Books Card */}
              <div className="flex items-center bg-white p-6 rounded-2xl shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-2xl cursor-pointer">
                <div className="bg-blue-100 p-4 rounded-xl flex items-center justify-center shadow-md">
                  <img src={bookIcon} alt="books" className="w-7 h-7" />
                </div>
                <div className="ml-4">
                  <p className="text-3xl font-extrabold text-[#2C3E50]">
                    {totalBooks}
                  </p>
                  <span className="text-base text-gray-600 font-medium">
                    Books
                  </span>
                </div>
              </div>
              {/* Admins Card */}
              <div className="flex items-center bg-white p-6 rounded-2xl shadow-xl transition duration-300 ease-in-out transform hover:scale-[1.02] hover:shadow-2xl cursor-pointer">
                <div className="bg-blue-100 p-4 rounded-xl flex items-center justify-center shadow-md">
                  <img src={adminIcon} alt="admins" className="w-7 h-7" />
                </div>
                <div className="ml-4">
                  <p className="text-3xl font-extrabold text-[#2C3E50]">
                    {totalAdmin}
                  </p>
                  <span className="text-base text-gray-600 font-medium">
                    Admins
                  </span>
                </div>
              </div>
            </div>
            {/* Admin Profile Card */}
            <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center flex-1 text-center">
              <img
                src={
                  user?.avatar?.url ||
                  "https://placehold.co/96x96/e0e0e0/ffffff?text=User"
                }
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 shadow-sm"
              />
              <h3 className="text-xl font-extrabold text-[#2C3E50] mt-4 mb-2">
                {user?.name || "Admin"}
              </h3>
              <p className="text-sm text-gray-600 font-medium">
                Welcome back, here's a snapshot of current stats.
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AdminDashboard;
