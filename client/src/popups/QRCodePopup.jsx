import React from "react";
import { useSelector, useDispatch } from "react-redux";
import QRCode from "react-qr-code";
import { toggleQrCodePopup } from "../store/slices/popUpSlice";
import { X } from "lucide-react";

const QRCodePopup = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const qrCodeValue = JSON.stringify({
    userId: user?._id,
    name: user?.name,
    email: user?.email,
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 font-inter">
      <div className="w-full bg-white rounded-2xl shadow-2xl max-w-sm mx-auto p-8 relative">
        <button
          className="absolute top-4 right-4 text-gray-600 hover:text-gray-900 text-2xl font-bold cursor-pointer"
          onClick={() => dispatch(toggleQrCodePopup())}
          aria-label="Close"
        >
          <X size={24} />
        </button>
        <h3 className="text-2xl font-extrabold text-[#2C3E50] mb-6 text-center">
          Your QR Code
        </h3>
        <div className="flex justify-center items-center py-4">
          <div className="bg-white p-3 rounded-lg shadow-inner border border-gray-200">
            <QRCode value={qrCodeValue} size={200} />
          </div>
        </div>
        <p className="mt-4 text-gray-600 text-center text-sm">
          Admins can scan this to view your details.
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
