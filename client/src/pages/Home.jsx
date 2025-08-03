// src/pages/Home.jsx
import React, { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import SideBar from "../layout/SideBar";
import UserDashboard from "../components/UserDashboard";
import AdminDashboard from "../components/AdminDashboard";
import BookManagement from "../components/BookManagement";
import Catalog from "../components/Catalog";
import MyBorrowedBooks from "../components/MyBorrowedBooks";
import Users from "../components/Users";
import KycForm from "../components/KycForm"; // User's KYC form component
import KycManagement from "../components/KycManagement"; // Admin's KYC management component
import Prebookings from "../components/PrebookingManagement"; // Import the Prebookings component

const Home = () => {
  // State to manage the visibility of the mobile sidebar
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  // State to determine which main content component to display
  const [selectedComponent, setSelectedComponent] = useState("Dashboard");

  // Get user and authentication status from the Redux store
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  // If the user is not authenticated, redirect them to the login page
  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="relative md:pl-64 flex min-h-screen bg-gray-100 text-gray-800 transition-all duration-200">
      {/* Hamburger menu button for mobile views */}
      <div
        className="md:hidden z-20 fixed top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-md cursor-pointer transition-all"
        onClick={() => setIsSideBarOpen(!isSideBarOpen)}
        role="button"
        aria-label="Toggle sidebar"
      >
        <GiHamburgerMenu className="text-xl" />
      </div>

      {/* The Sidebar component, which controls the selectedComponent state */}
      <SideBar
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
        setSelectedComponent={setSelectedComponent}
      />

      {/* Main content area */}
      <div className="flex-grow p-4 md:p-6 transition-all w-full overflow-auto">
        {/* Conditional rendering of components based on selectedComponent and user role */}
        {(() => {
          switch (selectedComponent) {
            case "Dashboard":
              return user?.role === "User" ? (
                <UserDashboard />
              ) : (
                <AdminDashboard />
              );
            case "Books":
              return <BookManagement />;
            case "Catalog":
              return user?.role === "Admin" ? <Catalog /> : null;
            case "Users":
              return user?.role === "Admin" ? <Users /> : null;
            case "My Borrowed Books":
              return user?.role === "User" ? <MyBorrowedBooks /> : null;
            case "KYC Verification":
              return user?.role === "User" ? <KycForm /> : null;
            case "KYC Management":
              return user?.role === "Admin" ? <KycManagement /> : null;
            case "Pre-bookings":
              return user?.role === "Admin" ? <Prebookings /> : null;
            default:
              return user?.role === "User" ? (
                <UserDashboard />
              ) : (
                <AdminDashboard />
              );
          }
        })()}
      </div>
    </div>
  );
};

export default Home;
