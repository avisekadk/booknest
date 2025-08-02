// src/components/PrebookingManagement.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "../layout/Header";

const PrebookingManagement = () => {
  const [prebookings, setPrebookings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPrebookings = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/v1/prebook/admin/all",
          { withCredentials: true }
        );
        setPrebookings(data.prebookings);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPrebookings();
  }, []);

  if (isLoading) return <div>Loading...</div>;

  return (
    <main className="relative flex-1 p-6 pt-28 font-inter bg-gray-100 min-h-screen">
      <Header />
      <h2 className="text-3xl font-extrabold text-[#2C3E50] mb-6">
        Pre-booking Requests
      </h2>
      <div className="mt-6 overflow-x-auto bg-white rounded-2xl shadow-xl">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-blue-50 text-blue-800 font-semibold text-left">
              <th className="px-6 py-3">Book Title</th>
              <th className="px-6 py-3">User Name</th>
              <th className="px-6 py-3">User Email</th>
              <th className="px-6 py-3">Pre-booked At</th>
            </tr>
          </thead>
          <tbody>
            {prebookings.map((item) => (
              <tr key={item._id}>
                <td className="px-6 py-4">{item.bookId.title}</td>
                <td className="px-6 py-4">{item.userId.name}</td>
                <td className="px-6 py-4">{item.userId.email}</td>
                <td className="px-6 py-4">
                  {new Date(item.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default PrebookingManagement;
