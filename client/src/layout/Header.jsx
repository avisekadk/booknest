import React, { useEffect, useState } from "react";
import settingIcon from "../assets/setting.png";
import userIcon from "../assets/user.png";
import { useDispatch, useSelector } from "react-redux";
import { toggleSettingPopup } from "../store/slices/popUpSlice";

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      setCurrentTime(`${hours}:${minutes}:${seconds}:${ampm}`);

      const options = { month: "short", day: "numeric", year: "numeric" }; // Removed date: "numeric" as it's redundant with day
      setCurrentDate(now.toLocaleDateString("en-Us", options));
    };

    updateDateTime();

    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);
  return (
    <>
      <header
        className="absolute top-0 w-full py-4 px-6 left-0 shadow-xl flex justify-between items-center
                         bg-gradient-to-r from-blue-500 to-blue-700 font-inter text-white"
      >
        {" "}
        {/* Applied gradient, font, and text color */}
        {/* left side - User Info */}
        <div className="flex items-center gap-3">
          {" "}
          {/* Increased gap for better spacing */}
          <img src={userIcon} alt="userIcon" className="w-9 h-9" />{" "}
          {/* Slightly increased icon size */}
          <div>
            <span className="text-lg font-semibold block">
              {user && user.name}
            </span>{" "}
            {/* Adjusted text size and weight, added block for new line */}
            <span className="text-sm font-medium block opacity-90">
              {user && user.role}
            </span>{" "}
            {/* Adjusted text size and weight, added block, opacity */}
          </div>
        </div>
        {/* right side - Date/Time and Settings */}
        <div className="hidden md:flex items-center gap-4">
          {" "}
          {/* Increased gap */}
          <div className="flex flex-col text-right text-base font-semibold">
            {" "}
            {/* Aligned text to right */}
            <span>{currentTime}</span>
            <span>{currentDate}</span>
          </div>
          <span className="bg-white h-10 w-[2px] opacity-70 rounded-full"></span>{" "}
          {/* Adjusted height, opacity, and added rounded-full */}
          <img
            src={settingIcon}
            alt="settingIcon"
            className="w-8 h-8 cursor-pointer transform hover:scale-110 transition duration-200" /* Added hover effect and transition */
            onClick={() => dispatch(toggleSettingPopup())}
          />
        </div>
      </header>
    </>
  );
};

export default Header;
