// src/popups/ScannerPopup.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Scanner } from "@yudiel/react-qr-scanner";
import { toggleScannerPopup } from "../store/slices/popUpSlice";
import { returnBook } from "../store/slices/borrowSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader } from "lucide-react"; // Keeping Loader as it's a good fit
import closeIcon from "../assets/close-square.png";

const ScannerPopup = () => {
  const dispatch = useDispatch();
  const [scannedUserData, setScannedUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const calculateFine = (dueDate) => {
    const finePerHour = 0.1;
    const now = new Date();
    const due = new Date(dueDate);
    if (now > due) {
      const lateHours = Math.ceil((now - due) / (1000 * 60 * 60));
      return (lateHours * finePerHour).toFixed(2);
    }
    return "0.00";
  };

  const handleScan = async (result) => {
    if (result && result.length > 0) {
      setIsLoading(true);
      setError(""); // Reset previous errors
      try {
        let parsedData;
        try {
          parsedData = JSON.parse(result[0].rawValue);
          if (!parsedData.userId) {
            throw new Error("QR code does not contain a userId.");
          }
        } catch (parseError) {
          console.error("QR Parse Error:", parseError);
          toast.error("Invalid QR Code format.");
          setIsLoading(false);
          return;
        }

        const { userId } = parsedData;
        console.log("Scanned User ID:", userId);

        const { data } = await axios.get(
          `http://localhost:4000/api/v1/user/details/${userId}`,
          { withCredentials: true }
        );

        console.log("API Response:", data);

        // **CRITICAL CHECK**: Ensure the data structure is correct before setting state
        if (data && data.success && data.user) {
          setScannedUserData(data.user);
        } else {
          throw new Error("User data not found in API response.");
        }
      } catch (apiError) {
        console.error("API Fetch Error:", apiError);
        const errorMessage =
          apiError.response?.data?.message || "Failed to fetch user data.";
        toast.error(errorMessage);
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleReturn = (borrowId, userEmail) => {
    dispatch(returnBook({ email: userEmail, id: borrowId }));
    setScannedUserData((prev) => {
      if (!prev) return null;
      const updatedHistory = prev.borrowHistory.map((book) => {
        if (book._id === borrowId) {
          return {
            ...book,
            returnDate: new Date().toISOString(),
            fine: parseFloat(calculateFine(book.dueDate)),
          };
        }
        return book;
      });
      return { ...prev, borrowHistory: updatedHistory };
    });
  };

  const resetScanner = () => {
    setScannedUserData(null);
    setError("");
    setIsLoading(false);
  };

  // Use optional chaining `?.` extensively to prevent crashes
  const nonReturnedBooks =
    scannedUserData?.borrowHistory?.filter((book) => !book.returnDate) || [];
  const returnedBooks =
    scannedUserData?.borrowHistory?.filter((book) => book.returnDate) || [];

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
          onClick={() => dispatch(toggleScannerPopup())}
        />
        <h3 className="text-3xl font-extrabold text-[#2C3E50] mb-6 text-center">
          Scan User QR Code
        </h3>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader className="animate-spin text-blue-600" size={48} />
            <p className="mt-4 text-lg text-gray-600">Fetching User Data...</p>
          </div>
        ) : !scannedUserData ? (
          <div>
            <div className="w-full max-w-md mx-auto rounded-lg overflow-hidden border-2 border-gray-300 shadow-inner">
              <Scanner
                onScan={handleScan}
                onError={(e) => console.error("Scanner Error:", e)}
              />
            </div>
            {error && (
              <div className="mt-4 p-4 bg-red-100 text-red-700 font-medium rounded-lg text-center">
                <span>{error}</span>
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="mb-6 pb-4 border-b border-gray-200">
              <h4 className="text-xl font-semibold text-gray-900">
                User: {scannedUserData.name}
              </h4>
              <p className="text-gray-600">Email: {scannedUserData.email}</p>
            </div>

            <div className="mb-8">
              <h5 className="font-bold text-lg text-red-700 mb-3">
                Borrowed Books (Outstanding)
              </h5>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {nonReturnedBooks.length > 0 ? (
                  nonReturnedBooks.map((book) => {
                    const isOverdue = new Date() > new Date(book.dueDate);
                    const fine = isOverdue
                      ? calculateFine(book.dueDate)
                      : "0.00";
                    return (
                      <div
                        key={book._id}
                        className={`flex justify-between items-center p-3 rounded-lg ${
                          isOverdue
                            ? "bg-red-50 border border-red-200"
                            : "bg-gray-100"
                        }`}
                      >
                        <div>
                          {/* **DEFENSIVE CHECK** */}
                          <span className="font-semibold text-gray-800">
                            {book.book?.title || "Unknown Book"}
                          </span>
                          {isOverdue && (
                            <span className="ml-4 text-red-600 font-bold text-sm">
                              Fine: ${fine}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() =>
                            handleReturn(book._id, scannedUserData.email)
                          }
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors whitespace-nowrap"
                        >
                          Return
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-gray-500">No outstanding books.</p>
                )}
              </div>
            </div>

            <div>
              <h5 className="font-bold text-lg text-green-700 mb-3">
                Returned Books (History)
              </h5>
              <div className="space-y-3 max-h-48 overflow-y-auto pr-2">
                {returnedBooks.length > 0 ? (
                  returnedBooks.map((book) => (
                    <div
                      key={book._id}
                      className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200"
                    >
                      <div>
                        {/* **DEFENSIVE CHECK** */}
                        <span className="font-semibold text-gray-800">
                          {book.book?.title || "Unknown Book"}
                        </span>
                        {book.fine > 0 && (
                          <span className="ml-4 text-gray-600 font-bold text-sm">
                            Fine Paid: ${book.fine.toFixed(2)}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500 whitespace-nowrap">
                        Returned:{" "}
                        {new Date(book.returnDate).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No returned books in history.</p>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4">
              <button
                onClick={() => dispatch(toggleScannerPopup())}
                className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
              >
                Close
              </button>
              <button
                onClick={resetScanner}
                className="px-6 py-2 rounded-lg font-bold text-white
                         bg-gradient-to-r from-blue-500 to-blue-600
                         hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out
                         shadow-lg transform hover:scale-105"
              >
                Scan Another QR
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ScannerPopup;
