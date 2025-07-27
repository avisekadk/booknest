import React from "react";
import { useSelector } from "react-redux";
import Header from "../layout/Header";

const Users = () => {
  const { users } = useSelector((state) => state.user);

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

  return (
    <main className="relative flex-1 p-6 pt-28 font-inter bg-gray-100 min-h-screen">
      {" "}
      {/* Consistent padding, font, and background */}
      <Header />
      {/* Sub Header */}
      <header className="flex flex-col gap-6 md:flex-row md:justify-between md:items-center mb-6">
        {" "}
        {/* Consistent gap, added mb-6 */}
        <h2 className="text-3xl font-extrabold text-[#2C3E50]">
          {" "}
          {/* Consistent heading style */}
          Registered Users
        </h2>
      </header>
      {/* Table */}
      {users && users.filter((u) => u.role === "User").length > 0 ? (
        <div className="mt-6 overflow-hidden bg-white rounded-2xl shadow-xl">
          {" "}
          {/* Consistent card styling for table container */}
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-blue-50 text-blue-800 font-semibold text-left">
                {" "}
                {/* Consistent header row styling */}
                <th className="px-6 py-3">ID</th> {/* Increased padding */}
                <th className="px-6 py-3">Name</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3">Role</th>
                <th className="px-6 py-3 text-center">No. of books borrowed</th>
                <th className="px-6 py-3 text-center">Created at</th>
              </tr>
            </thead>
            <tbody>
              {users
                .filter((u) => u.role === "User")
                .map((user, index) => (
                  <tr
                    key={user._id}
                    className={
                      index % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } /* Alternating row colors */
                  >
                    <td className="px-6 py-4 text-gray-800">{index + 1}</td>{" "}
                    {/* Increased padding, consistent text color */}
                    <td className="px-6 py-4 text-gray-800 font-medium">
                      {user.name}
                    </td>
                    <td className="px-6 py-4 text-gray-700">{user.email}</td>
                    <td className="px-6 py-4 text-gray-700">{user.role}</td>
                    <td className="px-6 py-4 text-center text-gray-700">
                      {user?.borrowedBooks.length}
                    </td>{" "}
                    {/* Consistent text color and centering */}
                    <td className="px-6 py-4 text-center text-gray-700">
                      {formatDate(user.createdAt)}
                    </td>{" "}
                    {/* Consistent text color and centering */}
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ) : (
        <h3 className="text-3xl mt-5 font-extrabold text-[#2C3E50] text-center">
          {" "}
          {/* Consistent heading style and centering */}
          No registered users found in library.
        </h3>
      )}
    </main>
  );
};

export default Users;
