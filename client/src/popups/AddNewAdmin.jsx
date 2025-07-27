import React, { useState } from "react";
import placeholder from "../assets/placeholder.jpg";
import closeIcon from "../assets/close-square.png";
import keyIcon from "../assets/key.png"; // Keeping for potential future use or if user wants to re-add it
import { useDispatch, useSelector } from "react-redux";
import { addNewAdmin } from "../store/slices/userSlice";
import { toggleAddNewAdminPopup } from "../store/slices/popUpSlice";

const AddNewAdmin = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.user);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setAvatarPreview(reader.result);
      };
      reader.readAsDataURL(file);
      setAvatar(file);
    }
  };

  const handleAddNewAdmin = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("avatar", avatar);
    dispatch(addNewAdmin(formData));
  };

  return (
    // Outer container for the popup overlay, consistent with AddBookPopup
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col z-50 overflow-auto py-24 px-4 font-inter">
      {/* Inner white popup container, consistent with AddBookPopup */}
      <div className="w-full bg-white rounded-2xl shadow-2xl max-w-lg mx-auto p-8 transition-all relative">
        {" "}
        {/* Added 'relative' for absolute positioning of close button */}
        {/* Close Button - positioned absolutely for consistent placement */}
        <img
          src={closeIcon}
          alt="close-icon"
          className="absolute top-4 right-4 cursor-pointer w-7 h-7" /* Adjusted size and position */
          onClick={() => dispatch(toggleAddNewAdminPopup())}
        />
        {/* Header - Adjusted to match AddBookPopup's centered heading */}
        <h3 className="text-3xl font-extrabold text-[#2C3E50] mb-6 text-center">
          Add New Admin
        </h3>
        <form onSubmit={handleAddNewAdmin}>
          {/* Avatar Selection */}
          <div className="flex flex-col items-center mb-6">
            <label htmlFor="avatarInput" className="cursor-pointer">
              <img
                src={avatarPreview ? avatarPreview : placeholder}
                alt="avatar"
                className="w-24 h-24 rounded-full object-cover border-2 border-gray-300 shadow-sm" /* Added border and shadow for consistency */
              />
              <input
                type="file"
                id="avatarInput"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>
          </div>

          {/* Name Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {" "}
              {/* Consistent label styling */}
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Admin's Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400" /* Consistent input styling */
            />
          </div>

          {/* Email Input */}
          <div className="mb-4">
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {" "}
              {/* Consistent label styling */}
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Admin's Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400" /* Consistent input styling */
            />
          </div>

          {/* Password Input */}
          <div className="mb-8">
            {" "}
            {/* Increased bottom margin for consistency */}
            <label className="block text-sm font-semibold text-gray-700 mb-1">
              {" "}
              {/* Consistent label styling */}
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Admin's Password"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400" /* Consistent input styling */
            />
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4">
            {" "}
            {/* Changed space-x-4 to gap-4 and added pt-4 */}
            <button
              type="button"
              onClick={() => dispatch(toggleAddNewAdminPopup())}
              className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105" /* Consistent button styling */
            >
              Close
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 rounded-lg font-bold text-white
                         bg-gradient-to-r from-blue-500 to-blue-600
                         hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out
                         shadow-lg transform hover:scale-105" /* Consistent button styling */
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNewAdmin;
