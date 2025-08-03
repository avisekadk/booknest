import React, { useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import OTP from "./pages/OTP";
import ResetPassword from "./pages/ResetPassword";
import LandingPage from "./pages/LandingPage";
import BookDetails from "./pages/BookDetails";

import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./store/slices/authSlice";
import { fetchAllUsers } from "./store/slices/userSlice";
import { fetchAllBooks } from "./store/slices/bookSlice";
import { fetchUserBorrowedBooks } from "./store/slices/borrowSlice";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  // Select user and authentication state from the Redux store
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  // Effect to get the user on initial component mount
  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  // Effect to fetch books and user data when authenticated
  // This runs whenever the authentication state or user object changes
  useEffect(() => {
    if (isAuthenticated && user) {
      // Fetch all books for all authenticated users
      dispatch(fetchAllBooks());

      // If the user is a regular "User", fetch their borrowed books
      if (user.role === "User") {
        dispatch(fetchUserBorrowedBooks());
      }

      // If the user is an "Admin", fetch all users
      if (user.role === "Admin") {
        dispatch(fetchAllUsers());
      }
    }
  }, [dispatch, isAuthenticated, user]);

  return (
    <BrowserRouter>
      <Routes>
        {/* The root path is for the LandingPage */}
        <Route path="/" element={<LandingPage />} />
        {/* The dashboard path is for the Home component */}
        <Route path="/dashboard" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/otp-verification/:email" element={<OTP />} />
        {/* Route for resetting password, correctly capturing the dynamic token */}
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        {/* Route for showing detailed information about a book */}
        <Route path="/book/:id" element={<BookDetails />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} />
    </BrowserRouter>
  );
};

export default App;
