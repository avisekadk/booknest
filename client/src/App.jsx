import React, { useState, useEffect } from "react";
import "./App.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import OTP from "./pages/OTP";
import ResetPassword from "./pages/ResetPassword";
import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./store/slices/authSlice";
// MODIFIED: Import fetchAllUsers with its new parameters
import { fetchAllUsers } from "./store/slices/userSlice";
// MODIFIED: Import fetchAllBooks with its new parameters
import { fetchAllBooks } from "./store/slices/bookSlice";
// MODIFIED: Import fetchUserBorrowedBooks with its new parameters
import {
  fetchUserBorrowedBooks,
  fetchAllBorrowedBooks,
} from "./store/slices/borrowSlice"; // Added fetchAllBorrowedBooks
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]); // Run once on mount

  useEffect(() => {
    if (isAuthenticated && user) {
      // Dispatch fetchAllBooks with default pagination parameters
      dispatch(fetchAllBooks(1, 15, ""));

      if (user.role === "User") {
        // Dispatch fetchUserBorrowedBooks with default pagination parameters
        dispatch(fetchUserBorrowedBooks(1, 15, "all"));
      }

      if (user.role === "Admin") {
        // Dispatch fetchAllUsers with default pagination parameters
        dispatch(fetchAllUsers(1, 15, ""));
        // Also fetch all borrowed books for admin catalog view with default pagination and filter
        dispatch(fetchAllBorrowedBooks(1, 15, "borrowed", ""));
      }
    }
  }, [dispatch, isAuthenticated, user]); // Re-run when auth state or user changes

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/otp-verification/:email" element={<OTP />} />
        {/*
          IMPORTANT CHANGE HERE:
          Add ':token' to the path to capture the dynamic reset token.
          This tells React Router that anything after /password/reset/ will be
          captured as a parameter named 'token'.
        */}
        <Route path="/password/reset/:token" element={<ResetPassword />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} />
    </BrowserRouter>
  );
};

export default App;
