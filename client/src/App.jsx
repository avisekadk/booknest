// client/src/App.jsx

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
import KycPage from "./components/KycForm";

import { ToastContainer } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { getUser } from "./store/slices/authSlice";
import { fetchAllUsers } from "./store/slices/userSlice";
import { fetchAllBooks } from "./store/slices/bookSlice";
import { fetchUserBorrowedBooks } from "./store/slices/borrowSlice";
import "react-toastify/dist/ReactToastify.css";

// Import actions for prebookings and notifications
import { fetchMyPrebookings } from "./store/slices/prebookSlice";
import { fetchMyNotifications } from "./store/slices/notificationSlice";

// Import the new popups to render them at the top level
import QRCodePopup from "./popups/QRCodePopup";
import ScannerPopup from "./popups/ScannerPopup";

const App = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { qrCodePopup, scannerPopup } = useSelector((state) => state.popup);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(fetchAllBooks());
      if (user.role === "User") {
        dispatch(fetchUserBorrowedBooks());
        // FIX: Fetch pre-bookings and notifications for the user
        dispatch(fetchMyPrebookings());
        dispatch(fetchMyNotifications());
      }
      if (user.role === "Admin") {
        dispatch(fetchAllUsers());
      }
    }
  }, [dispatch, isAuthenticated, user]);

  return (
    <BrowserRouter>
      {qrCodePopup && <QRCodePopup />}
      {scannerPopup && <ScannerPopup />}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/password/forgot" element={<ForgotPassword />} />
        <Route path="/otp-verification/:email" element={<OTP />} />
        <Route path="/password/reset/:token" element={<ResetPassword />} />
        <Route path="/book/:id" element={<BookDetails />} />
        <Route path="/kyc" element={<KycPage />} />
      </Routes>
      <ToastContainer position="top-right" autoClose={5000} />
    </BrowserRouter>
  );
};

export default App;
