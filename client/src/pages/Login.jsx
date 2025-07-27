import React, { useEffect, useState } from "react";
import logo from "../assets/black-logo.png";
import logoWith_title from "../assets/logo-with-title.png";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { Link, Navigate } from "react-router-dom";
import { login, resetAuthSlice } from "../store/slices/authSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();

  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleLogin = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append("email", email);
    data.append("password", password);
    dispatch(login(data));
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
        <div className="w-full md:w-1/2 flex items-center justify-center bg-white p-10 md:p-16">
          <div className="w-full max-w-md">
            <div className="flex justify-center mb-10">
              <img src={logo} alt="logo" className="h-20 w-auto" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-center text-blue-600 mb-4">
              Welcome Back!
            </h1>
            <p className="text-center text-gray-600 font-medium mb-8">
              Enter your credentials to access your account
            </p>
            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Email"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Password"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div className="text-right">
                <Link
                  to={"/password/forgot"}
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  Forgot Password?
                </Link>
              </div>
              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-blue-500 hover:bg-blue-700 text-white font-bold shadow-md transition-all duration-200"
              >
                LOG IN
              </button>
              <div className="block md:hidden text-center mt-6">
                <p className="text-sm text-gray-600">
                  New to our platform?{" "}
                  <Link
                    to={"/register"}
                    className="text-blue-600 font-semibold hover:underline"
                  >
                    Sign Up
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="hidden md:flex w-full md:w-1/2 bg-gradient-to-br from-blue-500 to-blue-600 text-white items-center justify-center p-10 rounded-tl-[80px] rounded-bl-[80px] shadow-xl">
          <div className="text-center max-w-md">
            <div className="mb-6">
              <img
                src={logoWith_title}
                alt="logo with title"
                className="h-40 w-auto mx-auto"
              />
            </div>
            <p className="text-lg mb-8 text-gray-100">
              New to our platform? Sign up and get started today.
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

export default Login;
