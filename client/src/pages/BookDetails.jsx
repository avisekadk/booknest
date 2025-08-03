import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../layout/Header";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookAndComments = async () => {
    try {
      setIsLoading(true);
      const bookRes = await axios.get(
        `http://localhost:4000/api/v1/book/${id}`
      );
      setBook(bookRes.data.book);
      const commentsRes = await axios.get(
        `http://localhost:4000/api/v1/comment/${id}`
      );
      setComments(commentsRes.data.comments);
    } catch (error) {
      toast.error("Failed to load book details.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBookAndComments();
  }, [id]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) {
      toast.error("Comment cannot be empty.");
      return;
    }
    try {
      await axios.post(
        `http://localhost:4000/api/v1/comment/${id}`,
        { commentText: newComment },
        { withCredentials: true }
      );
      setNewComment("");
      fetchBookAndComments();
      toast.success("Comment posted!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to post comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:4000/api/v1/comment/${commentId}`, {
        withCredentials: true,
      });
      fetchBookAndComments();
      toast.success("Comment deleted!");
    } catch (error) {
      toast.error("Failed to delete comment.");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center mt-20 text-xl font-inter text-gray-700">
        Loading...
      </div>
    );
  }

  if (!book) {
    return (
      <div className="text-center mt-20 text-xl font-inter text-gray-700">
        Book not found.
      </div>
    );
  }

  return (
    <>
      {isAuthenticated && <Header />}
      <main
        className={`relative flex-1 p-6 ${
          isAuthenticated ? "pt-28" : "pt-6"
        } font-inter bg-gray-100 min-h-screen`}
      >
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-200"
          >
            &larr; Back
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          {/* Book details content remains the same */}
          <h1 className="text-3xl font-bold">{book?.title}</h1>
          <h2 className="text-xl text-gray-700 mb-2">by {book?.author}</h2>
          <p className="text-gray-600">{book?.description}</p>
        </div>

        {/* Comments Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Discussion</h3>

          {/* --- UPDATED COMMENT BOX LOGIC --- */}
          {isAuthenticated ? (
            // If user is logged in, show the active comment form
            <form onSubmit={handleAddComment} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-2 border rounded-lg mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Write a comment..."
                rows="4"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200"
              >
                Post Comment
              </button>
            </form>
          ) : (
            // If user is a guest, show a disabled comment box with a login prompt overlay
            <div className="mb-6 relative">
              <textarea
                className="w-full p-2 border rounded-lg mb-2 bg-gray-100"
                placeholder="Write a comment..."
                rows="4"
                disabled
              />
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex flex-col items-center justify-center rounded-lg">
                <p className="font-bold text-gray-800 text-lg">
                  Want to join the discussion?
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="mt-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition duration-200 shadow-md"
                >
                  Log In to Comment
                </button>
              </div>
            </div>
          )}
          {/* --- END OF UPDATED LOGIC --- */}

          {/* Display Comments */}
          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment._id} className="border-b pb-2">
                  <div className="flex justify-between items-center">
                    <p className="font-bold">{comment.user.name}</p>
                    {user &&
                      (user.role === "Admin" ||
                        user._id === comment.user.id) && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-red-500 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      )}
                  </div>
                  <p className="mt-1 text-gray-700">{comment.commentText}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(comment.createdAt).toLocaleString()}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-gray-600">
                No comments yet. Be the first to comment!
              </p>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default BookDetails;
