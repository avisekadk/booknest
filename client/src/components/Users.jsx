import React, { useState } from "react";
import { useSelector } from "react-redux";
import Header from "../layout/Header";

const Users = () => {
  const { users } = useSelector((state) => state.user);
  const [searchedKeyword, setSearchedKeyword] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(15); // Set to 15 users per page

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

  // Pagination calculations
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageNumbersToShow = 5; // e.g., current, and 2 before/2 after
    let startPage = Math.max(
      1,
      currentPage - Math.floor(maxPageNumbersToShow / 2)
    );
    let endPage = Math.min(totalPages, startPage + maxPageNumbersToShow - 1);

    // Adjust startPage if we're near the end
    if (endPage - startPage + 1 < maxPageNumbersToShow) {
      startPage = Math.max(1, endPage - maxPageNumbersToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => paginate(i)}
          className={`px-4 py-2 rounded-lg font-semibold transition duration-200 ease-in-out
                      ${
                        currentPage === i
                          ? "bg-blue-600 text-white shadow-md"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };

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
              {currentUsers.map((user, index) => {
                // Use currentUsers for mapping
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
                      {indexOfFirstUser + index + 1}{" "}
                      {/* Corrected ID for pagination */}
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

      {/* Pagination Controls */}
      {filteredUsers.length > usersPerPage && ( // Only show pagination if there's more than one page
        <div className="flex justify-center items-center gap-2 mt-8">
          <button
            onClick={() => paginate(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold shadow-md
                       hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed
                       transition duration-200 ease-in-out"
          >
            Previous
          </button>
          {renderPageNumbers()}
          <button
            onClick={() => paginate(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="px-4 py-2 rounded-lg bg-blue-500 text-white font-semibold shadow-md
                       hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed
                       transition duration-200 ease-in-out"
          >
            Next
          </button>
        </div>
      )}
    </main>
  );
};

export default Users;
