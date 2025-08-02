import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ScanLine } from "lucide-react";
import {
  toggleSettingPopup,
  toggleQrCodePopup,
  toggleScannerPopup,
} from "../store/slices/popUpSlice";
import settingIcon from "../assets/setting.png";
import userIcon from "../assets/user.png"; // [cite: 492]

const Header = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [currentTime, setCurrentTime] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const handleUserIconClick = () => {
    // For a user, toggle the QR code popup
    if (user?.role === "User") {
      dispatch(toggleQrCodePopup());
    }
    // For an admin, this click could open a profile menu or do nothing
  };

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const ampm = now.getHours() >= 12 ? "PM" : "AM";
      setCurrentTime(`${hours}:${minutes}:${seconds}:${ampm}`);

      const options = { month: "short", day: "numeric", year: "numeric" };
      setCurrentDate(now.toLocaleDateString("en-Us", options));
    };

    updateDateTime();
    const intervalId = setInterval(updateDateTime, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <header className="absolute top-0 w-full py-4 px-6 left-0 shadow-xl flex justify-between items-center bg-gradient-to-r from-blue-500 to-blue-700 font-inter text-white">
        {/* left side - User Info */}
        <div className="flex items-center gap-3">
          <img
            src={userIcon}
            alt="userIcon"
            className="w-9 h-9 cursor-pointer"
            onClick={handleUserIconClick}
          />
          <div>
            <span className="text-lg font-semibold block">
              {user && user.name}
            </span>
            <span className="text-sm font-medium block opacity-90">
              {user && user.role}
            </span>
          </div>
        </div>
        {/* right side - Date/Time and Settings */}
        <div className="hidden md:flex items-center gap-4">
          <div className="flex flex-col text-right text-base font-semibold">
            <span>{currentTime}</span>
            <span>{currentDate}</span>
          </div>
          <span className="bg-white h-10 w-[2px] opacity-70 rounded-full"></span>

          {/* Scanner Icon for Admins */}
          {user?.role === "Admin" && (
            <ScanLine
              className="w-8 h-8 cursor-pointer transform hover:scale-110 transition duration-200"
              onClick={() => dispatch(toggleScannerPopup())}
              title="Scan QR Code"
            />
          )}

          <img
            src={settingIcon}
            alt="settingIcon"
            className="w-8 h-8 cursor-pointer transform hover:scale-110 transition duration-200"
            onClick={() => dispatch(toggleSettingPopup())}
          />
        </div>
      </header>
    </>
  );
};

export default Header;
