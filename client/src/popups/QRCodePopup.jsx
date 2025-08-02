import React from "react";
import { useSelector, useDispatch } from "react-redux";
import QRCode from "react-qr-code";
import { toggleQrCodePopup } from "../store/slices/popUpSlice";
import closeIcon from "../assets/close-square.png";

const QRCodePopup = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  // Create a JSON string with user data for the QR code
  const qrCodeValue = JSON.stringify({
    userId: user?._id,
    name: user?.name,
    email: user?.email,
  });

  return (
    // Outer container for the popup overlay, consistent with other popups
    <div className="fixed inset-0 bg-black bg-opacity-50 flex flex-col z-50 overflow-auto py-24 px-4 font-inter">
      {/* Inner white popup container, consistent with other popups */}
      <div className="w-full bg-white rounded-2xl shadow-2xl max-w-lg mx-auto p-8 transition-all relative">
        {/* Close Button - positioned absolutely for consistent placement */}
        <img
          src={closeIcon}
          alt="close-icon"
          className="absolute top-4 right-4 cursor-pointer w-7 h-7"
          onClick={() => dispatch(toggleQrCodePopup())}
        />
        {/* Header - Adjusted to match the centered heading style */}
        <h3 className="text-3xl font-extrabold text-[#2C3E50] mb-6 text-center">
          Your QR Code
        </h3>
        <div className="flex justify-center items-center py-6">
          <div className="bg-white p-4 rounded-lg shadow-inner">
            <QRCode value={qrCodeValue} size={256} />
          </div>
        </div>
        <p className="mt-4 text-gray-600 text-center text-sm">
          Admins can scan this to view your borrowed books.
        </p>
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={() => dispatch(toggleQrCodePopup())}
            className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default QRCodePopup;