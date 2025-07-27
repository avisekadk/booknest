import React, { useState } from "react";
import closeIcon from "../assets/close-square.png";
import { useDispatch, useSelector } from "react-redux";
import { updatePassword } from "../store/slices/authSlice";
import settingIcon from "../assets/setting.png"; // Assuming this path is correct
import { toggleSettingPopup } from "../store/slices/popUpSlice";

const SettingPopup = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);

  const handleUpdatePassword = (e) => {
    e.preventDefault();
    // Basic validation for new password and confirm new password matching
    if (newPassword !== confirmNewPassword) {
      alert("New password and confirm new password do not match!");
      return;
    }
    const data = new FormData();
    data.append("currentPassword", currentPassword);
    data.append("newPassword", newPassword);
    // Note: 'confirmNewPassword' is usually not sent to the backend,
    // as the backend only needs the new password itself.
    // It's primarily for client-side validation.
    // data.append("confirmNewPassword", confirmNewPassword); // You can remove this line if not needed by your API
    dispatch(updatePassword(data));
  };

  return (
    // Outer container for the popup overlay, consistent with previous popups
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col z-50 overflow-auto py-24 px-4 font-inter">
      {/* Inner white popup container, consistent with previous popups */}
      <div className="w-full bg-white rounded-2xl shadow-2xl max-w-lg mx-auto p-8 transition-all relative">
        {/* Close Button - positioned absolutely for consistent placement */}
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold cursor-pointer"
          onClick={() => dispatch(toggleSettingPopup())}
          aria-label="Close Setting Popup"
        >
          &times;
        </button>

        {/* Header - Adjusted to match consistent heading style */}
        <h3 className="text-3xl font-extrabold text-[#2C3E50] mb-6 text-center">
          Change credentials
        </h3>

        <form onSubmit={handleUpdatePassword}>
          {/* Current Password Input */}
          <div className="mb-4">
            {" "}
            {/* Removed sm:flex gap-4 items-center */}
            <label
              htmlFor="current-password-input"
              className="block text-sm font-semibold text-gray-700 mb-1" /* Consistent label styling */
            >
              Enter Current Password
            </label>
            <input
              id="current-password-input"
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400" /* Consistent input styling */
            />
          </div>
          {/* New Password Input */}
          <div className="mb-4">
            {" "}
            {/* Removed sm:flex gap-4 items-center */}
            <label
              htmlFor="new-password-input"
              className="block text-sm font-semibold text-gray-700 mb-1" /* Consistent label styling */
            >
              Enter New Password
            </label>
            <input
              id="new-password-input"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter New Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400" /* Consistent input styling */
            />
          </div>
          {/* Confirm New Password Input */}
          <div className="mb-8">
            {" "}
            {/* Removed sm:flex gap-4 items-center, increased bottom margin */}
            <label
              htmlFor="confirm-new-password-input"
              className="block text-sm font-semibold text-gray-700 mb-1" /* Consistent label styling */
            >
              Confirm New Password
            </label>
            <input
              id="confirm-new-password-input"
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Confirm New Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400" /* Consistent input styling */
            />
          </div>

          {/* Buttons - Consistent styling and layout */}
          <div className="flex justify-end gap-4 pt-4">
            {" "}
            {/* Changed mt-10 to pt-4 and added gap-4 */}
            <button
              type="button"
              onClick={() => dispatch(toggleSettingPopup())}
              className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105" /* Consistent button styling */
            >
              CANCEL
            </button>
            <button
              type="submit"
              disabled={loading}
              className={`px-6 py-2 rounded-lg font-bold text-white
                         bg-gradient-to-r from-blue-500 to-blue-600
                         hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out
                         shadow-lg transform hover:scale-105 ${
                           loading ? "opacity-70 cursor-not-allowed" : ""
                         }`} /* Consistent button styling, adjusted disabled state opacity */
            >
              {loading ? "UPDATING..." : "CONFIRM"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingPopup;
