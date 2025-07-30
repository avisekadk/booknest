import React, { useState, useEffect } from "react"; // Added useEffect
import { useSelector, useDispatch } from "react-redux"; // Added useDispatch
import Header from "../layout/Header";
import { fetchAllUsers } from "../store/slices/userSlice"; // Import fetchAllUsers

const Users = () => {
  const dispatch = useDispatch();
  // MODIFIED: Get totalUsersCount and totalPages from Redux state
  const { users, loading, totalUsersCount, totalPages } = useSelector(
    (state) => state.user
  );
  const [searchedKeyword, setSearchedKeyword] = useState("");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(15); // This value is sent to the server

  useEffect(() => {
    // MODIFIED: Pass currentPage, usersPerPage, and searchedKeyword to fetchAllUsers
    dispatch(fetchAllUsers(currentPage, usersPerPage, searchedKeyword));
  }, [dispatch, currentPage, usersPerPage, searchedKeyword]); // Added dependencies

  useEffect(() => {
    // Reset page to 1 when search keyword changes
    setCurrentPage(1);
  }, [searchedKeyword]); // Trigger re-fetch via main useEffect

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

  // REMOVED: filteredUsers and currentUsers local logic
  // These are now handled by the server and available directly in 'users' from Redux.

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const renderPageNumbers = () => {
    const pageNumbers = [];
    const maxPageButtons = 3; // Number of visible numeric page buttons around current page (excluding 1st and last)

    if (totalPages <= maxPageButtons + 2) {
      // If total pages are few, show all of them
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      pageNumbers.push(1); // Always show the first page

      // Determine the range of middle pages to show
      let startRange = Math.max(
        2,
        currentPage - Math.floor(maxPageButtons / 2)
      );
      let endRange = Math.min(
        totalPages - 1,
        currentPage + Math.floor(maxPageButtons / 2)
      );

      // Adjust start/end range if current page is near the boundaries
      if (currentPage - 1 <= Math.floor(maxPageButtons / 2)) {
        endRange = maxPageButtons + 1; // Show more pages at the beginning
      } else if (totalPages - currentPage <= Math.floor(maxPageButtons / 2)) {
        startRange = totalPages - maxPageButtons; // Show more pages at the end
      }

      // Add leading ellipsis
      if (startRange > 2) {
        pageNumbers.push("...");
      }

      // Add middle pages
      for (let i = startRange; i <= endRange; i++) {
        pageNumbers.push(i);
      }

      // Add trailing ellipsis
      if (endRange < totalPages - 1) {
        pageNumbers.push("...");
      }

      // Always show the last page
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
                          ? "bg-blue-600 text-white shadow-md border-blue-600" // Active state
                          : "bg-white text-gray-700 hover:bg-gray-100 border-gray-300" // Inactive state
                      }`}
        >
          {number}
        </button>
      )
    );
  };

  // Calculate display indices for "Results: X - Y of Z"
  const indexOfFirstUserDisplay = (currentPage - 1) * usersPerPage + 1;
  const indexOfLastUserDisplay = Math.min(
    currentPage * usersPerPage,
    totalUsersCount
  );

  if (loading) {
    // Added loading check
    return (
      <div className="text-center mt-20 text-xl font-inter text-gray-700">
        Loading users...
      </div>
    );
  }

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
      {/* MODIFIED: Check totalUsersCount instead of filteredUsers.length */}
      {totalUsersCount > 0 ? (
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
              {users.map((user, index) => {
                // MODIFIED: Map over 'users' directly
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
                      {indexOfFirstUserDisplay + index}{" "}
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

      {/* Pagination Controls - MODIFIED: Use totalUsersCount */}
      {totalUsersCount > 0 && ( // Only show pagination if there are filtered users
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
          <div className="text-gray-700 text-lg font-semibold">
            Results: {indexOfFirstUserDisplay} - {indexOfLastUserDisplay} of{" "}
            {totalUsersCount}
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
      )}
    </main>
  );
};

export default Users;
