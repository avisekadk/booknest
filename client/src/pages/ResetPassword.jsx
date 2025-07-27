import React, { useEffect, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import logo from "../assets/black-logo.png"; // Assuming this is the feather-book logo
import logo_with_title from "../assets/logo-with-title.png"; // Assuming this is the feather-book logo with "BOOK nest" text
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
    // Main container for the entire reset password page, ensuring full screen height and responsiveness
    <div className="flex flex-col justify-center md:flex-row h-screen font-inter">
      {/* LEFT SIDE - Promotional Section (hidden on mobile) */}
      <div className="hidden w-full md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px] shadow-2xl">
        {" "}
        {/* Consistent gradient, rounded corners, and shadow */}
        <div className="text-center h-full flex flex-col justify-center items-center">
          {" "}
          {/* Ensure content is vertically centered */}
          {/* Logo with title */}
          <div className="flex justify-center mb-6">
            <img
              src={logo_with_title}
              alt="logo with title"
              className="mb-4 h-48 w-auto" // Adjusted size to be prominent
            />
          </div>
          {/* Tagline text */}
          <p className="text-gray-200 text-lg mb-8 max-w-[320px] mx-auto">
            {" "}
            {/* Adjusted text size and color */}
            "Your premier digital library for borrowing and reading books"
          </p>
        </div>
      </div>

      {/* RIGHT SIDE - Reset Password Form Section */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-8 relative">
        {/* Back to Login Link - Positioned subtly at the top left */}
        <Link
          to={"/login"}
          className="absolute top-8 left-8 text-blue-600 font-semibold hover:underline text-sm" // Consistent with ForgotPassword
        >
          &larr; Back to Login
        </Link>
        <div className="max-w-sm w-full text-center">
          {" "}
          {/* Added text-center for overall alignment */}
          {/* Logo container */}
          <div className="flex justify-center mb-8">
            {" "}
            {/* Increased bottom margin for spacing */}
            <img src={logo} alt="logo" className="h-28 w-auto" />{" "}
            {/* Slightly increased logo size */}
          </div>
          {/* Reset Password Heading */}
          <h1 className="text-4xl font-extrabold text-[#2C3E50] mb-4 overflow-hidden">
            {" "}
            {/* Adjusted color and margin */}
            Reset Password
          </h1>
          {/* Subtitle */}
          <p className="text-gray-600 text-base mb-8">
            {" "}
            {/* Adjusted color and margin */}
            Please enter your new password
          </p>
          {/* Reset Password Form */}
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400" // Consistent input styling
              />
            </div>
            <div className="mb-8">
              {" "}
              {/* Increased bottom margin for spacing */}
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-400" // Consistent input styling
              />
            </div>

            {/* Reset Password Button - Styled with consistent gradient and effects */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg font-bold text-white
                         bg-gradient-to-r from-blue-500 to-blue-600
                         hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out
                         shadow-lg transform hover:scale-105" // Consistent button styling
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
