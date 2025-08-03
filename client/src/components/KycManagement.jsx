// src/components/KycManagement.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const KycManagement = () => {
  const [submissions, setSubmissions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewingImage, setViewingImage] = useState(null);

  const fetchSubmissions = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get(
        "http://localhost:4000/api/v1/kyc/admin/all",
        { withCredentials: true }
      );
      setSubmissions(data.submissions);
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
      if (rejectionReason === null) return; // User cancelled prompt
    }

    try {
      const { data } = await axios.put(
        `http://localhost:4000/api/v1/kyc/admin/update/${id}`,
        { status, rejectionReason },
        { withCredentials: true }
      );
      toast.success(data.message);
      fetchSubmissions(); // Refresh the list
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update status.");
    }
  };

  if (isLoading) return <p>Loading submissions...</p>;

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">KYC Management</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">User</th>
              <th className="py-2 px-4 border-b">Contact</th>
              <th className="py-2 px-4 border-b">Document</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {submissions.map((sub) => (
              <tr key={sub._id}>
                <td className="py-2 px-4 border-b">
                  {sub.user.name}
                  <br />
                  <span className="text-sm text-gray-500">
                    {sub.user.email}
                  </span>
                </td>
                <td className="py-2 px-4 border-b">{sub.phone}</td>
                <td className="py-2 px-4 border-b">
                  {sub.documentType} (
                  <button
                    onClick={() => setViewingImage(sub.documentImage.url)}
                    className="text-blue-500 hover:underline"
                  >
                    View
                  </button>
                  )
                </td>
                <td className="py-2 px-4 border-b">{sub.status}</td>
                <td className="py-2 px-4 border-b">
                  {sub.status === "Pending" && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleUpdateStatus(sub._id, "Verified")}
                        className="bg-green-500 text-white px-3 py-1 rounded"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(sub._id, "Rejected")}
                        className="bg-red-500 text-white px-3 py-1 rounded"
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
      {viewingImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
          onClick={() => setViewingImage(null)}
        >
          <img
            src={viewingImage}
            alt="KYC Document"
            className="max-w-screen-lg max-h-screen-lg"
          />
        </div>
      )}
    </div>
  );
};

export default KycManagement;
