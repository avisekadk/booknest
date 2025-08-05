import React, { useEffect, useState } from "react";
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
import {
  fetchUserBorrowedBooks,
  fetchAllBorrowedBooks,
} from "./store/slices/borrowSlice";
import "react-toastify/dist/ReactToastify.css";

import { fetchMyPrebookings } from "./store/slices/prebookSlice";
import { fetchMyNotifications } from "./store/slices/notificationSlice";

import QRCodePopup from "./popups/QRCodePopup";
import ScannerPopup from "./popups/ScannerPopup";

const App = () => {
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const { qrCodePopup, scannerPopup } = useSelector((state) => state.popup);
  const dispatch = useDispatch();

  const [initialLoadDone, setInitialLoadDone] = useState(false);

  useEffect(() => {
    dispatch(getUser());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user && !initialLoadDone) {
      dispatch(fetchAllBooks());
      if (user.role === "User") {
        dispatch(fetchUserBorrowedBooks());
        dispatch(fetchMyPrebookings());
        dispatch(fetchMyNotifications());
      }
      if (user.role === "Admin") {
        dispatch(fetchAllUsers());
        dispatch(fetchAllBorrowedBooks());
      }
      setInitialLoadDone(true);
    }
    if (!isAuthenticated) {
      setInitialLoadDone(false);
    }
  }, [dispatch, isAuthenticated, user, initialLoadDone]);

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
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </BrowserRouter>
  );
};

export default App;
