import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Scanner } from "@yudiel/react-qr-scanner";
import { toggleScannerPopup } from "../store/slices/popUpSlice";
import { returnBook, recordBorrowBook } from "../store/slices/borrowSlice";
import axios from "axios";
import { toast } from "react-toastify";
import { Loader, X } from "lucide-react";

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
      setError("");
      try {
        let parsedData;
        try {
          parsedData = JSON.parse(result[0].rawValue);
          if (!parsedData.userId) {
            throw new Error("QR code does not contain a userId.");
          }
        } catch (parseError) {
          toast.error("Invalid QR Code format.");
          setIsLoading(false);
          return;
        }

        const { userId } = parsedData;

        const { data } = await axios.get(
          `http://localhost:4000/api/v1/user/details/${userId}`,
          {
            withCredentials: true,
          }
        );

        if (data && data.success && data.user) {
          setScannedUserData(data.user);
        } else {
          throw new Error("User data not found in API response.");
        }
      } catch (apiError) {
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
    dispatch(
      returnBook({
        email: userEmail,
        id: borrowId,
      })
    );
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

  // Add this new handler function
  const handleRecordPrebooking = (bookId, userEmail) => {
    if (!bookId || !userEmail) {
      toast.error("Missing book or user information to record the borrow.");
      return;
    }
    // Dispatch the existing action to record the borrow
    dispatch(recordBorrowBook(userEmail, bookId))
      .unwrap()
      .then(() => {
        // Refresh the user data after recording the borrow
        resetScanner();
        toast.success("Book borrow recorded successfully!");
      })
      .catch((error) => {
        const errorMessage = error.message || "Failed to record borrow.";
        toast.error(errorMessage);
      });
  };

  const resetScanner = () => {
    setScannedUserData(null);
    setError("");
    setIsLoading(false);
  };

  const nonReturnedBooks =
    scannedUserData?.borrowHistory?.filter((book) => !book.returnDate) || [];
  const returnedBooks =
    scannedUserData?.borrowHistory?.filter((book) => book.returnDate) || [];
  const prebookedBooks = scannedUserData?.prebookings || [];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 font-inter">
      <div className="w-full bg-white rounded-2xl shadow-2xl max-w-2xl mx-auto overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
          <h3 className="text-2xl font-extrabold text-[#2C3E50] mx-auto">
            Scan User QR Code
          </h3>
          <button
            className="text-gray-600 hover:text-gray-900 text-2xl font-bold cursor-pointer"
            onClick={() => dispatch(toggleScannerPopup())}
          >
            <X size={24} />
          </button>
        </div>

        {/* Main Content Area */}
        <div className="p-8 space-y-8 flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center h-64">
              <Loader className="animate-spin text-blue-600" size={48} />
              <p className="mt-4 text-lg text-gray-600">
                Fetching User Data...
              </p>
            </div>
          ) : !scannedUserData ? (
            <div>
              <div className="w-full rounded-lg overflow-hidden border-2 border-gray-300 shadow-inner">
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
            <>
              <div className="pb-4 border-b border-gray-200">
                <h4 className="text-xl font-semibold text-gray-900">
                  User: {scannedUserData.name}
                </h4>
                <p className="text-gray-600">Email: {scannedUserData.email}</p>
              </div>

              <div className="flex flex-col md:flex-row gap-6">
                {/* Left Column: Pre-Booked & Borrowed */}
                <div className="flex-1 space-y-6">
                  <div>
                    <h5 className="font-bold text-lg text-blue-700 mb-3">
                      Pre-Booked Books
                    </h5>
                    <div className="space-y-3 pr-2 text-sm">
                      {prebookedBooks.length > 0 ? (
                        prebookedBooks.map((prebook) => (
                          <div
                            key={prebook._id}
                            className="flex justify-between items-center p-3 rounded-lg bg-blue-50 border border-blue-200"
                          >
                            <span className="font-semibold text-gray-800">
                              {prebook.bookId?.title || "Unknown Book"}
                            </span>
                            {/* Add this button */}
                            <button
                              onClick={() =>
                                handleRecordPrebooking(
                                  prebook.bookId._id,
                                  scannedUserData.email
                                )
                              }
                              className="px-3 py-1.5 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition-colors whitespace-nowrap text-sm"
                            >
                              Record Borrow
                            </button>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500">No pre-booked books.</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-bold text-lg text-red-700 mb-3">
                      Borrowed Books (Outstanding)
                    </h5>
                    <div className="space-y-3 pr-2 text-sm">
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
                                <span className="font-semibold text-gray-800">
                                  {book.book?.title || "Unknown Book"}
                                </span>
                                {isOverdue && (
                                  // Change 1
                                  <span className="ml-4 text-red-600 font-bold">
                                    Fine: Nrs. {fine}
                                  </span>
                                )}
                              </div>
                              <button
                                onClick={() =>
                                  handleReturn(book._id, scannedUserData.email)
                                }
                                className="px-3 py-1.5 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600 transition-colors whitespace-nowrap text-sm"
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
                </div>

                {/* Right Column: Returned Books */}
                <div className="flex-1">
                  <h5 className="font-bold text-lg text-green-700 mb-3">
                    Returned Books (History)
                  </h5>
                  <div className="space-y-3 pr-2 text-sm">
                    {returnedBooks.length > 0 ? (
                      returnedBooks.map((book) => (
                        <div
                          key={book._id}
                          className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-200"
                        >
                          <div>
                            <span className="font-semibold text-gray-800">
                              {book.book?.title || "Unknown Book"}
                            </span>
                            {book.fine > 0 && (
                              // Change 2
                              <span className="ml-4 text-gray-600 font-bold">
                                Fine Paid: Nrs. {book.fine.toFixed(2)}
                              </span>
                            )}
                          </div>
                          <span className="text-xs text-gray-500 whitespace-nowrap">
                            Returned:{" "}
                            {new Date(book.returnDate).toLocaleDateString()}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-gray-500">
                        No returned books in history.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer Bar */}
        <div className="flex justify-end gap-4 p-6 border-t border-gray-200">
          <button
            onClick={() => dispatch(toggleScannerPopup())}
            className="px-6 py-2 rounded-lg border border-gray-400 text-gray-700 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
          >
            Close
          </button>
          <button
            onClick={resetScanner}
            className="px-6 py-2 rounded-lg font-bold text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 transition duration-300 ease-in-out shadow-lg transform hover:scale-105"
          >
            Scan New
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScannerPopup;
