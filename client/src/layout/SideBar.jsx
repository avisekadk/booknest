// src/layout/SideBar.jsx
import React, { useEffect } from "react";
import logo_with_title from "../assets/logo-with-title.png";
import logoutIcon from "../assets/logout.png";
import closeIcon from "../assets/white-close-icon.png";
import dashboardIcon from "../assets/element.png";
import bookIcon from "../assets/book.png";
import catalogIcon from "../assets/catalog.png";
import settingIcon from "../assets/setting-white.png";
import usersIcon from "../assets/people.png";
import { RiAdminFill } from "react-icons/ri";
import { ShieldCheck } from "lucide-react"; // Icon for KYC Management/Verification
import { useDispatch, useSelector } from "react-redux";
import { logout, resetAuthSlice } from "../store/slices/authSlice";
import { toast } from "react-toastify";
import AddNewAdmin from "../popups/AddNewAdmin";
import SettingPopup from "../popups/SettingPopup";
import {
  toggleAddNewAdminPopup,
  toggleSettingPopup,
} from "../store/slices/popUpSlice";

const SideBar = ({ isSideBarOpen, setIsSideBarOpen, setSelectedComponent }) => {
  const dispatch = useDispatch();
  const { addNewAdminPopup, settingPopup } = useSelector(
    (state) => state.popup
  );
  const { loading, error, message, user, isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const handleLogout = () => {
    dispatch(logout());
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
      dispatch(resetAuthSlice());
    }
    if (message) {
      toast.success(message);
      dispatch(resetAuthSlice());
    }
  }, [dispatch, isAuthenticated, error, loading, message]);

  // Reusable component for navigation buttons to keep the JSX clean
  const NavButton = ({ icon, label, component }) => (
    <button
      className="w-full py-3 px-4 font-medium bg-transparent rounded-lg hover:bg-blue-600 hover:text-white transition duration-200 flex items-center gap-3"
      onClick={() => setSelectedComponent(component)}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  return (
    <>
      <aside
        className={`${
          isSideBarOpen ? "left-0" : "-left-full"
        } z-10 transition-all duration-700 md:relative md:left-0 flex w-64 bg-gradient-to-br from-blue-500 to-blue-700 text-white flex-col h-full font-inter rounded-tr-3xl rounded-br-3xl shadow-xl overflow-y-auto`}
        style={{ position: "fixed" }}
      >
        <div className="px-4 py-4 my-4">
          <img
            src={logo_with_title}
            alt="logo"
            className="w-40 h-auto mx-auto"
          />
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <NavButton
            icon={<img src={dashboardIcon} alt="icon" className="w-5 h-5" />}
            label="Dashboard"
            component="Dashboard"
          />
          <NavButton
            icon={<img src={bookIcon} alt="icon" className="w-5 h-5" />}
            label="Books"
            component="Books"
          />

          {/* Admin-only navigation items */}
          {isAuthenticated && user?.role === "Admin" && (
            <>
              <NavButton
                icon={<img src={catalogIcon} alt="icon" className="w-5 h-5" />}
                label="Catalog"
                component="Catalog"
              />
              <NavButton
                icon={<img src={usersIcon} alt="icon" className="w-5 h-5" />}
                label="Users"
                component="Users"
              />
              <NavButton
                icon={<ShieldCheck className="w-5 h-5" />}
                label="KYC Management"
                component="KYC Management"
              />
              <NavButton
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="w-5 h-5"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                }
                label="Pre-bookings"
                component="Pre-bookings"
              />
              <button
                className="w-full py-3 px-4 font-medium bg-transparent rounded-lg hover:bg-blue-600 hover:text-white transition duration-200 flex items-center gap-3"
                onClick={() => dispatch(toggleAddNewAdminPopup())}
              >
                <RiAdminFill className="w-5 h-5" /> <span>Add New Admin</span>
              </button>
            </>
          )}

          {/* User-only navigation items */}
          {isAuthenticated && user?.role === "User" && (
            <>
              <NavButton
                icon={<img src={catalogIcon} alt="icon" className="w-5 h-5" />}
                label="My Borrowed Books"
                component="My Borrowed Books"
              />
              <NavButton
                icon={<ShieldCheck className="w-5 h-5" />}
                label="KYC Verification"
                component="KYC Verification"
              />
            </>
          )}

          <button
            className="w-full py-3 px-4 font-medium bg-transparent rounded-lg hover:bg-blue-600 hover:text-white transition duration-200 flex items-center gap-3 mt-4"
            onClick={() => dispatch(toggleSettingPopup())}
          >
            <img src={settingIcon} alt="icon" className="w-5 h-5" />
            <span>Update Credentials</span>
          </button>
        </nav>

        <div className="px-6 py-6 ">
          <button
            className="py-3 px-6 font-bold bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition duration-300 ease-in-out shadow-md flex items-center justify-center gap-3 mx-auto w-fit"
            onClick={handleLogout}
          >
            <img src={logoutIcon} alt="icon" className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        <img
          src={closeIcon}
          alt="icon"
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="h-7 w-7 absolute top-4 right-4 block md:hidden cursor-pointer"
        />
      </aside>
      {addNewAdminPopup && <AddNewAdmin />}
      {settingPopup && <SettingPopup />}
    </>
  );
};

export default SideBar;
