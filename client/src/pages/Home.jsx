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

const Home = () => {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState("");

  const { user, isAuthenticated } = useSelector((state) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to={"/login"} />;
  }

  return (
    <div className="relative md:pl-64 flex min-h-screen bg-gray-100 text-gray-800 transition-all duration-200">
      {/* Mobile Hamburger Button */}
      <div
        className="md:hidden z-20 fixed top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg shadow-md cursor-pointer transition-all"
        onClick={() => setIsSideBarOpen(!isSideBarOpen)}
        role="button"
        aria-label="Toggle sidebar"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ")
            setIsSideBarOpen(!isSideBarOpen);
        }}
      >
        <GiHamburgerMenu className="text-xl" />
      </div>

      {/* Sidebar */}
      <SideBar
        isSideBarOpen={isSideBarOpen}
        setIsSideBarOpen={setIsSideBarOpen}
        setSelectedComponent={setSelectedComponent}
      />

      {/* Main Content */}
      <div className="flex-grow p-4 md:p-6 transition-all w-full overflow-auto">
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
