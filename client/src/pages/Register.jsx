import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import logo from "../assets/black-logo.png";
import logo_with_title from "../assets/logo-with-title.png";
import { register, resetAuthSlice } from "../store/slices/authSlice";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const navigateTo = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("name", name);
    data.append("email", email);
    data.append("password", password);
    dispatch(register(data));
  };

  useEffect(() => {
    if (message) {
      dispatch(resetAuthSlice());
      navigateTo(`/otp-verification/${email}`);
    }
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
  }, [message, error, dispatch, email, navigateTo]);

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100 ">
      {/* LEFT SIDE */}
      <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-700 text-white items-center justify-center p-10 rounded-tr-[80px] rounded-br-[80px] shadow-xl h-full">
        <div className="text-center max-w-md pt-16 sm:pt-24">
          <img
            src={logo_with_title}
            alt="logo with title"
            className="h-40 w-auto mx-auto mb-6"
          />
          <p className="text-gray-100 mb-8">
            Already have an account? Sign in now.
          </p>
          <Link
            to={"/login"}
            className="inline-block px-8 py-3 bg-white text-blue-600 font-bold rounded-xl shadow-lg hover:bg-blue-100 transition-all duration-200"
          >
            LOG IN
          </Link>
        </div>
      </div>

      {/* RIGHT SIDE */}
      <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-10 md:p-16 h-full">
        <div className="w-full max-w-md">
          <div className="flex justify-center mb-10">
            <div className="flex flex-col-reverse sm:flex-row items-center gap-4">
              <h3 className="text-4xl font-bold text-blue-700">Sign Up</h3>
              <img src={logo} alt="logo" className="h-20 w-auto" />
            </div>
          </div>
          <p className="text-center text-gray-600 font-medium mb-8">
            Please provide your information to sign up.
          </p>

          <form onSubmit={handleRegister} className="space-y-6">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold shadow-md transition-all duration-200"
              disabled={loading}
            >
              {loading ? "Signing up..." : "SIGN UP"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
