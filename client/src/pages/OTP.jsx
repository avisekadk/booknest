import React, { useEffect, useState } from "react";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { Navigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { otpVerification, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

const OTP = () => {
  const { email } = useParams();
  const [otp, setOtp] = useState("");
  const dispatch = useDispatch();

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleOtpVerification = (e) => {
    e.preventDefault();
    dispatch(otpVerification({ email, otp }));
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading]);

  if (isAuthenticated) {
    return <Navigate to={"/"} />;
  }

  return (
    <>
      <div className="flex flex-col justify-center md:flex-row h-screen bg-gray-100">
        {/* LEFT SIDE */}
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-10 md:p-16 relative">
          <Link
            to={"/register"}
            className="absolute top-6 left-6 border border-gray-800 text-gray-800 font-semibold px-5 py-2 rounded-lg hover:bg-black hover:text-white transition"
          >
            Back
          </Link>
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-10">
              <img src={logo} alt="logo" className="h-20 w-auto" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-600 mb-4">
              Check Your Mailbox
            </h1>
            <p className="text-center text-gray-600 font-medium mb-8">
              Please enter the OTP to proceed
            </p>
            <form onSubmit={handleOtpVerification} className="space-y-6">
              <div>
                <input
                  type="number"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-700 text-white font-bold shadow-md transition-all duration-200"
              >
                VERIFY
              </button>
            </form>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-600 text-white items-center justify-center p-10 rounded-tl-[80px] rounded-bl-[80px] shadow-xl">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <img
                src={logo_with_title}
                alt="logo with title"
                className="h-40 w-auto mx-auto mb-6"
              />
            </div>
            <p className="text-lg mb-8 text-gray-100">
              New to our platform? Sign up now.
            </p>
            <Link
              to={"/register"}
              className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:bg-blue-100 transition-all duration-200"
            >
              SIGN UP
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OTP;
