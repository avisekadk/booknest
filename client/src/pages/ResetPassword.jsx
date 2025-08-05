import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { resetPassword, resetAuthSlice } from "../store/slices/authSlice";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { token } = useParams();

  const dispatch = useDispatch();

  const { loading, error, message, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleResetPassword = (e) => {
    e.preventDefault();
    console.log("Token from URL:", token);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!token) {
      toast.error("Invalid or missing reset token");
      return;
    }

    dispatch(resetPassword({ password, confirmPassword, token }));
  };

  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, message]);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col justify-center md:flex-row h-screen font-inter">
      <div className="hidden w-full md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px] shadow-2xl">
        <div className="text-center h-full flex flex-col justify-center items-center">
          <div className="flex justify-center mb-6">
            <img
              src={logo_with_title}
              alt="logo with title"
              className="mb-4 h-48 w-auto"
            />
          </div>
          <p className="text-gray-200 text-lg mb-8 max-w-[320px] mx-auto">
            "Your premier digital library for borrowing and reading books"
          </p>
        </div>
      </div>

      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">
        <Link
          to={"/login"}
          className="absolute top-8 left-8 text-blue-600 font-semibold hover:underline text-sm"
        >
          &larr; Back to Login
        </Link>
        <div className="max-w-sm w-full text-center">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="logo" className="h-28 w-auto" />
          </div>
          <h1 className="text-4xl font-extrabold text-[#2C3E50] mb-4 overflow-hidden">
            Reset Password
          </h1>
          <p className="text-gray-600 text-base mb-8">
            Please enter your new password
          </p>
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>
            <div className="mb-8">
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-white
                         bg-gradient-to-r from-blue-500 to-blue-600
                         hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out
                         shadow-lg transform hover:scale-105"
            >
              RESET PASSWORD
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
