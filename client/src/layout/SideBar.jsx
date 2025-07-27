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

  return (
    <>
      <aside
        // Apply consistent gradient background, font, and rounded corners for the sidebar itself
        // Added overflow-y-auto to enable vertical scrolling for the sidebar content
        className={`${
          isSideBarOpen ? "left-0" : "-left-full"
        } z-10 transition-all duration-700 md:relative md:left-0 flex w-64 bg-gradient-to-br from-blue-500 to-blue-700 text-white flex-col h-full font-inter rounded-tr-3xl rounded-br-3xl shadow-xl overflow-y-auto`} /* Added overflow-y-auto */
        style={{ position: "fixed" }}
      >
        {/* Logo Section - Adjusted padding and margin for better visual balance */}
        <div className="px-4 py-4 my-4">
          {" "}
          {/* Increased padding and margin */}
          <img
            src={logo_with_title}
            alt="logo"
            className="w-40 h-auto mx-auto"
          />
        </div>

        {/* Navigation - Adjusted spacing and button styles for a cleaner, more interactive look */}
        <nav className="flex-1 px-4 space-y-2">
          {" "}
          {/* Adjusted px and space-y */}
          <button
            className="w-full py-3 px-4 font-medium bg-transparent rounded-lg hover:bg-blue-600 hover:text-white transition duration-200 flex items-center gap-3" /* Consistent button styling */
            onClick={() => setSelectedComponent("Dashboard")}
          >
            <img src={dashboardIcon} alt="icon" className="w-5 h-5" />{" "}
            <span>Dashboard</span>
          </button>
          <button
            className="w-full py-3 px-4 font-medium bg-transparent rounded-lg hover:bg-blue-600 hover:text-white transition duration-200 flex items-center gap-3" /* Consistent button styling */
            onClick={() => setSelectedComponent("Books")}
          >
            <img src={bookIcon} alt="icon" className="w-5 h-5" />{" "}
            <span>Books</span>
          </button>
          {isAuthenticated && user?.role === "Admin" && (
            <>
              <button
                className="w-full py-3 px-4 font-medium bg-transparent rounded-lg hover:bg-blue-600 hover:text-white transition duration-200 flex items-center gap-3" /* Consistent button styling */
                onClick={() => setSelectedComponent("Catalog")}
              >
                <img src={catalogIcon} alt="icon" className="w-5 h-5" />{" "}
                <span>Catalog</span>
              </button>

              <button
                className="w-full py-3 px-4 font-medium bg-transparent rounded-lg hover:bg-blue-600 hover:text-white transition duration-200 flex items-center gap-3" /* Consistent button styling */
                onClick={() => setSelectedComponent("Users")}
              >
                <img src={usersIcon} alt="icon" className="w-5 h-5" />{" "}
                <span>Users</span>
              </button>

              <button
                className="w-full py-3 px-4 font-medium bg-transparent rounded-lg hover:bg-blue-600 hover:text-white transition duration-200 flex items-center gap-3" /* Consistent button styling */
                onClick={() => dispatch(toggleAddNewAdminPopup())}
              >
                <RiAdminFill className="w-5 h-5" /> <span>Add New Admin</span>{" "}
                {/* Adjusted icon size */}
              </button>
            </>
          )}
          {isAuthenticated && user?.role === "User" && (
            <>
              <button
                className="w-full py-3 px-4 font-medium bg-transparent rounded-lg hover:bg-blue-600 hover:text-white transition duration-200 flex items-center gap-3" /* Consistent button styling */
                onClick={() => setSelectedComponent("My Borrowed Books")}
              >
                <img src={catalogIcon} alt="icon" className="w-5 h-5" />{" "}
                <span>My Borrowed Books</span>
              </button>
            </>
          )}
          {/* Update Credentials Button - Adjusted styling for consistency */}
          <button
            className="w-full py-3 px-4 font-medium bg-transparent rounded-lg hover:bg-blue-600 hover:text-white transition duration-200 flex items-center gap-3 mt-4" /* Consistent button styling */
            onClick={() => dispatch(toggleSettingPopup())}
          >
            <img src={settingIcon} alt="icon" className="w-5 h-5" />{" "}
            <span>Update Credentials</span>
          </button>
        </nav>

        {/* Logout Section - Adjusted styling for consistency */}
        <div className="px-6 py-6 ">
          {" "}
          {/* Increased padding */}
          <button
            className="py-3 px-6 font-bold bg-white text-blue-700 rounded-lg hover:bg-blue-100 transition duration-300 ease-in-out shadow-md flex items-center justify-center gap-3 mx-auto w-fit" /* Consistent button styling */
            onClick={handleLogout}
          >
            <img src={logoutIcon} alt="icon" className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>

        {/* Close Sidebar Icon (for mobile) - Adjusted positioning and size */}
        <img
          src={closeIcon}
          alt="icon"
          onClick={() => setIsSideBarOpen(!isSideBarOpen)}
          className="h-7 w-7 absolute top-4 right-4 block md:hidden cursor-pointer" /* Adjusted size and position */
        />
      </aside>
      {addNewAdminPopup && <AddNewAdmin />}
      {settingPopup && <SettingPopup />}
    </>
  );
};

export default SideBar;
