import React, { useState, useEffect, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../layout/Header";

const KycManagement = () => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingImage, setViewingImage] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/kyc/admin/all",
        { withCredentials: true }
      );
      const validSubmissions = data.submissions.filter((sub) => sub.user);
      setSubmissions(validSubmissions);
    } catch (error) {
      toast.error("Failed to fetch KYC submissions.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const handleUpdateStatus = async (id, status) => {
    let rejectionReason = "";
    if (status === "Rejected") {
      rejectionReason = prompt("Please provide a reason for rejection:");
      if (rejectionReason === null || rejectionReason === "") {
        toast.info("Rejection cancelled or no reason provided.");
        return;
      }
    }

    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/kyc/admin/update/${id}`,
        { status, rejectionReason },
        { withCredentials: true }
      );
      toast.success(data.message);
      fetchSubmissions();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status.");
    }
  };

  const sortedSubmissions = useMemo(() => {
    return [...submissions].sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
  }, [submissions]);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = sortedSubmissions.slice(
    indexOfFirstItem,
    indexOfLastItem
  );
  const totalPages = Math.ceil(sortedSubmissions.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return (
          <span className="px-3 py-1 text-sm font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case "Verified":
        return (
          <span className="px-3 py-1 text-sm font-semibold rounded-full bg-green-100 text-green-800">
            Verified
          </span>
        );
      case "Rejected":
        return (
          <span className="px-3 py-1 text-sm font-semibold rounded-full bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 text-sm font-semibold rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 3;

    if (totalPages <= maxPageButtons + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1);
      let startRange = Math.max(
        2,
        currentPage - Math.floor(maxPageButtons / 2)
      );
      let endRange = Math.min(
        totalPages - 1,
        currentPage + Math.floor(maxPageButtons / 2)
      );

      if (currentPage - 1 <= Math.floor(maxPageButtons / 2)) {
        endRange = maxPageButtons + 1;
      } else if (totalPages - currentPage <= Math.floor(maxPageButtons / 2)) {
        startRange = totalPages - maxPageButtons;
      }

      if (startRange > 2) {
        pageNumbers.push("...");
      }

      for (let i = startRange; i <= endRange; i++) {
        pageNumbers.push(i);
      }

      if (endRange < totalPages - 1) {
        pageNumbers.push("...");
      }

      if (!pageNumbers.includes(totalPages)) {
        pageNumbers.push(totalPages);
      }
    }

    return pageNumbers.map((number, idx) =>
      number === "..." ? (
        <span
          key={`dots-${idx}`}
          className="h-10 w-10 flex items-center justify-center text-gray-700"
        >
          ...
        </span>
      ) : (
        <button
          key={number}
          onClick={() => paginate(number)}
          className={`h-10 w-10 flex items-center justify-center rounded-lg font-semibold transition duration-200 ease-in-out border
                      ${
                        currentPage === number
                          ? "bg-blue-600 text-white shadow-md border-blue-600"
                          : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300"
                      }`}
        >
          {number}
        </button>
      )
    );
  };

  if (isLoading)
    return (
      <div className="text-center mt-20 text-xl font-inter text-gray-700">
        Loading...
      </div>
    );

  return (
    <main className="relative flex-1 p-6 pt-28 font-inter bg-gray-100 min-h-screen">
      <Header />
      <h2 className="text-2xl font-extrabold text-[#2C3E50] mb-6">
        KYC Management
      </h2>
      {sortedSubmissions.length > 0 ? (
        <>
          <div className="mt-6 overflow-x-auto bg-white rounded-2xl shadow-xl">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-blue-50 text-blue-800 font-semibold text-left text-sm">
                  <th className="px-4 py-3">User Info</th>
                  <th className="px-4 py-3">Document</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((sub, index) => (
                  <tr
                    key={sub._id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-3 text-sm">
                      <p className="font-medium text-gray-800">
                        {sub.user?.name || (
                          <span className="text-red-500">[User Deleted]</span>
                        )}
                      </p>
                      <p className="text-gray-600 text-xs mt-1">
                        {sub.user?.email || (
                          <span className="text-red-500">[User Deleted]</span>
                        )}
                      </p>
                      <p className="text-gray-600 text-xs mt-1">
                        Phone: {sub.phone || "N/A"}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-gray-700 text-sm">
                      {sub.documentType} (
                      <button
                        onClick={() => setViewingImage(sub.documentImage.url)}
                        className="text-blue-600 hover:underline hover:text-blue-800 transition"
                      >
                        View
                      </button>
                      )
                    </td>
                    <td className="px-4 py-3">
                      {renderStatusBadge(sub.status)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {sub.status === "Pending" && (
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() =>
                              handleUpdateStatus(sub._id, "Verified")
                            }
                            className="bg-green-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-green-600 transition"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() =>
                              handleUpdateStatus(sub._id, "Rejected")
                            }
                            className="bg-red-500 text-white px-3 py-1 rounded-md text-sm font-medium hover:bg-red-600 transition"
                          >
                            Reject
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
            <div className="text-gray-700 text-lg font-semibold">
              Results:{" "}
              {Math.min(indexOfFirstItem + 1, sortedSubmissions.length)} -{" "}
              {Math.min(indexOfLastItem, sortedSubmissions.length)} of{" "}
              {sortedSubmissions.length}
            </div>
            <div className="flex justify-center items-center gap-2">
              <button
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className="h-10 w-10 flex items-center justify-center rounded-lg bg-white text-gray-700 border border-gray-300 font-semibold shadow-sm
                               hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed
                               transition duration-200 ease-in-out"
              >
                &lt;
              </button>
              {renderPageNumbers()}
              <button
                onClick={() => paginate(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="h-10 w-10 flex items-center justify-center rounded-lg bg-white text-gray-700 border border-gray-300 font-semibold shadow-sm
                               hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed
                               transition duration-200 ease-in-out"
              >
                &gt;
              </button>
            </div>
          </div>
        </>
      ) : (
        <h3 className="text-3xl mt-5 font-extrabold text-[#2C3E50] text-center">
          No KYC submissions found!
        </h3>
      )}

      {viewingImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setViewingImage(null)}
        >
          <div className="relative">
            <img
              src={viewingImage}
              alt="KYC Document"
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            <button
              onClick={() => setViewingImage(null)}
              className="absolute top-2 right-2 text-white bg-gray-800 p-2 rounded-full hover:bg-gray-700 transition"
              aria-label="Close image view"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default KycManagement;
