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
import { fetchAllUsers } from "./store/slices/userSlice";
import { fetchAllBooks } from "./store/slices/bookSlice";
import { fetchUserBorrowedBooks } from "./store/slices/borrowSlice";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]); // Run once on mount

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchAllBooks());

      if (user.role === "User") {
        dispatch(fetchUserBorrowedBooks());
      }

      if (user.role === "Admin") {
        dispatch(fetchAllUsers());
      }
    }
  }, [dispatch, isAuthenticated, user]);

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
