import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import Header from "../layout/Header";

const Users = () => {
  const { users } = useSelector((state) => state.user);
  const [searchedKeyword, setSearchedKeyword] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(10);

  const formatDate = (timeStamp) => {
    if (!timeStamp) return "N/A";
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

  const filteredUsers = users.filter((user) => {
    const matchesName = user.name
      .toLowerCase()
      .includes(searchedKeyword.toLowerCase());
    const matchesEmail = user.email
      .toLowerCase()
      .includes(searchedKeyword.toLowerCase());
    return (matchesName || matchesEmail) && user.role === "User";
  });

  const sortedUsers = useMemo(() => {
    return [...filteredUsers].sort((a, b) => {
      const borrowDiff =
        (b.borrowedBooks?.length || 0) - (a.borrowedBooks?.length || 0);
      if (borrowDiff !== 0) {
        return borrowDiff;
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [filteredUsers]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchedKeyword]);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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

  return (
    <main className="relative flex-1 p-6 pt-28 font-inter bg-gray-100 min-h-screen">
      <Header />
      <header className="flex flex-col gap-6 md:flex-row md:justify-between md:items-center mb-6">
        <h2 className="text-2xl font-extrabold text-[#2C3E50]">
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
      {sortedUsers && sortedUsers.length > 0 ? (
        <>
          <div className="mt-6 overflow-x-auto bg-white rounded-2xl shadow-xl">
            <table className="min-w-full border-collapse">
              <thead>
                <tr className="bg-blue-50 text-blue-800 font-semibold text-left text-sm">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3 min-w-[150px]">User</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Role</th>
                  <th className="px-4 py-3 text-center">Books Borrowed</th>
                  <th className="px-4 py-3 text-center">Books Returned</th>
                  <th className="px-4 py-3 hidden lg:table-cell text-center">
                    Created at
                  </th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user, index) => {
                  const returnedBooksCount =
                    user?.borrowedBooks?.filter((book) => book.returned)
                      .length || 0;
                  const rowNumber = indexOfFirstUser + index + 1;

                  return (
                    <tr
                      key={user._id}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-4 py-3 text-gray-800 text-sm">
                        {rowNumber}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex flex-col">
                          <p className="font-medium text-gray-800">
                            {user.name}
                          </p>
                          <p className="text-gray-600 text-xs mt-1">
                            {user.email}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-gray-700 hidden sm:table-cell text-sm">
                        {user.role}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700 text-sm">
                        {user?.borrowedBooks?.length || 0}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700 text-sm">
                        {returnedBooksCount}
                      </td>
                      <td className="px-4 py-3 hidden lg:table-cell text-center text-gray-700 text-sm">
                        {formatDate(user.createdAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {sortedUsers.length > 0 && (
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-8">
              <div className="text-gray-700 text-lg font-semibold">
                Results: {Math.min(indexOfFirstUser + 1, sortedUsers.length)} -{" "}
                {Math.min(indexOfLastUser, sortedUsers.length)} of{" "}
                {sortedUsers.length}
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
        </>
      ) : (
        <h3 className="text-3xl mt-5 font-extrabold text-[#2C3E50] text-center">
          No registered users found matching your search.
        </h3>
      )}
    </main>
  );
};

export default Users;
