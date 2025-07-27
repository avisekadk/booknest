import React, { useState } from "react";
import { useSelector } from "react-redux";
import Header from "../layout/Header";

const Users = () => {
  const { users } = useSelector((state) => state.user);
  const [searchedKeyword, setSearchedKeyword] = useState("");

  const formatDate = (timeStamp) => {
    const date = new Date(timeStamp);
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}-${String(
      date.getMonth() + 1
    ).padStart(2, "0")}-${String(date.getFullYear())}`;
    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    const result = `${formattedDate} ${formattedTime}`;
    return result;
  };

  // Filter users based on search keyword (name or email)
  const filteredUsers = users.filter((user) => {
    const matchesName = user.name
      .toLowerCase()
      .includes(searchedKeyword.toLowerCase());
    const matchesEmail = user.email
      .toLowerCase()
      .includes(searchedKeyword.toLowerCase());
    return (matchesName || matchesEmail) && user.role === "User";
  });

  return (
    <main className="relative flex-1 p-6 pt-28 font-inter bg-gray-100 min-h-screen">
      <Header />
      <header className="flex flex-col gap-6 md:flex-row md:justify-between md:items-center mb-6">
        <h2 className="text-3xl font-extrabold text-[#2C3E50]">
          Registered Users
        </h2>
        <input
          type="text"
          placeholder="Search users by name or email..."
          className="w-full sm:w-72 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-400"
          value={searchedKeyword}
          onChange={(e) => setSearchedKeyword(e.target.value)}
        />
      </header>
      {filteredUsers && filteredUsers.length > 0 ? (
        <div className="mt-6 overflow-x-auto bg-white rounded-2xl shadow-xl">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-blue-50 text-blue-800 font-semibold text-left">
                <th className="px-4 py-3 sm:px-6">ID</th>
                <th className="px-4 py-3 sm:px-6">Name</th>
                <th className="px-4 py-3 sm:px-6">Email</th>
                <th className="px-4 py-3 sm:px-6 hidden sm:table-cell">Role</th>
                <th className="px-4 py-3 sm:px-6 text-center">
                  Books Borrowed
                </th>
                <th className="px-4 py-3 sm:px-6 text-center">
                  Books Returned
                </th>{" "}
                {/* NEW: Column for number of books returned */}
                <th className="px-4 py-3 sm:px-6 hidden lg:table-cell text-center">
                  Created at
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.map((user, index) => {
                // Calculate number of returned books for the current user
                const returnedBooksCount =
                  user?.borrowedBooks?.filter((book) => book.returned).length ||
                  0;

                return (
                  <tr
                    key={user._id}
                    className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    <td className="px-4 py-4 sm:px-6 text-gray-800">
                      {index + 1}
                    </td>
                    <td className="px-4 py-4 sm:px-6 text-gray-800 font-medium">
                      {user.name}
                    </td>
                    <td className="px-4 py-4 sm:px-6 text-gray-700">
                      {user.email}
                    </td>
                    <td className="px-4 py-4 sm:px-6 text-gray-700 hidden sm:table-cell">
                      {user.role}
                    </td>
                    <td className="px-4 py-4 sm:px-6 text-center text-gray-700">
                      {user?.borrowedBooks?.length || 0}
                    </td>
                    <td className="px-4 py-4 sm:px-6 text-center text-gray-700">
                      {returnedBooksCount}
                    </td>{" "}
                    {/* Display the calculated returned books count */}
                    <td className="px-4 py-4 sm:px-6 hidden lg:table-cell text-center text-gray-700">
                      {formatDate(user.createdAt)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <h3 className="text-3xl mt-5 font-extrabold text-[#2C3E50] text-center">
          No registered users found matching your search.
        </h3>
      )}
    </main>
  );
};

export default Users;
