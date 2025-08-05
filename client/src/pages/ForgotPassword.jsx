import React, { useState } from "react";
import { useEffect } from "react";
import logo from "../assets/black-logo.png";
import logoWithTitle from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { resetAuthSlice } from "../store/slices/authSlice";
import { Link, Navigate } from "react-router-dom";
import { forgotPassword } from "../store/slices/authSlice";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const dispatch = useDispatch();

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleForgotPassword = (e) => {
    e.preventDefault();
    dispatch(forgotPassword(email));
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
  }, [dispatch, isAuthenticated, error, loading]);

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <div className="flex flex-col justify-center md:flex-row h-screen font-inter">
      <div className="hidden w-full md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 text-white md:flex flex-col items-center justify-center p-8 rounded-tr-[80px] rounded-br-[80px] shadow-2xl">
        <div className="text-center h-full flex flex-col justify-center items-center">
          <div className="flex justify-center mb-6">
            <img
              src={logoWithTitle}
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
        <div className="max-w-sm w-full text-center pt-16 sm:pt-24">
          <div className="flex justify-center mb-8">
            <img src={logo} alt="logo" className="h-28 w-auto" />
          </div>
          <h1 className="text-4xl font-extrabold text-[#2C3E50] mb-4 overflow-hidden">
            Forgot Password
          </h1>
          <p className="text-gray-600 text-base mb-8">
            Please enter your email
          </p>
          <form onSubmit={handleForgotPassword}>
            <div className="mb-8">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
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
              {loading ? "Sending..." : "RESET PASSWORD"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
