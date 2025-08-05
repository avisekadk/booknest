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

  const handlePrebook = async () => {
    try {
      const { data } = await axios.post(
        `http://localhost:4000/api/v1/prebook/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success(data.message);
      fetchBookAndComments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to pre-book.");
    }
  };

  const handleNotifyMe = async () => {
    try {
      const { data } = await axios.post(
        `http://localhost:4000/api/v1/book/notify-me/${id}`,
        {},
        { withCredentials: true }
      );
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to subscribe.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        {isAuthenticated && <Header />}
        <main
          className={`relative flex-1 p-6 ${
            isAuthenticated ? "pt-16" : "pt-6"
          } font-inter bg-gray-100`}
        >
          <div className="text-center mt-20 text-gray-700">Loading...</div>
        </main>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="flex flex-col min-h-screen">
        {isAuthenticated && <Header />}
        <main
          className={`relative flex-1 p-6 ${
            isAuthenticated ? "pt-16" : "pt-6"
          } font-inter bg-gray-100`}
        >
          <div className="text-center mt-20 text-gray-700">Book not found.</div>
        </main>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated && <Header />}
      <main
        className={`relative flex-1 p-6 ${
          isAuthenticated ? "pt-16" : "pt-6"
        } font-inter bg-gray-100 min-h-screen`}
      >
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-white text-gray-700 rounded-lg shadow hover:bg-gray-200 transition-colors"
          >
            &larr; Back
          </button>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-xl mb-6">
          <h1 className="text-4xl font-extrabold text-[#2C3E50]">
            {book?.title}
          </h1>
          <h2 className="text-xl text-gray-600 font-semibold mb-4">
            by {book?.author}
          </h2>
          <p className="text-gray-700 leading-relaxed">{book?.description}</p>
        </div>

        {isAuthenticated && user?.role === "User" && (
          <div className="mt-4 flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
            {book.quantity > 0 ? (
              user.kycStatus === "Verified" ? (
                <button
                  onClick={handlePrebook}
                  className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
                >
                  Pre-Book Now
                </button>
              ) : (
                <div className="p-3 w-full border-l-4 border-yellow-500 bg-yellow-50 text-yellow-800 rounded-lg">
                  <p>
                    Your KYC must be verified to pre-book.
                    <Link to="/kyc" className="font-bold underline ml-2">
                      Verify Now
                    </Link>
                  </p>
                </div>
              )
            ) : (
              <button
                onClick={handleNotifyMe}
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Notify Me When Available
              </button>
            )}
          </div>
        )}

        <div className="bg-white p-6 rounded-lg shadow-lg mt-6">
          <h3 className="text-2xl font-bold mb-4">Discussion</h3>
          {isAuthenticated ? (
            <form onSubmit={handleAddComment} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-2 border rounded-lg mb-2"
                placeholder="Write a comment..."
                rows="4"
              />
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
              >
                Post Comment
              </button>
            </form>
          ) : (
            <div className="mb-6 relative">
              <textarea
                className="w-full p-2 border rounded-lg bg-gray-100"
                rows="4"
                disabled
              />
              <div className="absolute inset-0 bg-white/80 flex flex-col items-center justify-center">
                <p className="font-bold text-lg">
                  Want to join the discussion?
                </p>
                <button
                  onClick={() => navigate("/login")}
                  className="mt-2 px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
                >
                  Log In to Comment
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div
                  key={comment._id}
                  className="border-b pb-4 last:border-b-0"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-bold">{comment.user.name}</p>
                    {user &&
                      (user.role === "Admin" ||
                        user._id === comment.user.id) && (
                        <button
                          onClick={() => handleDeleteComment(comment._id)}
                          className="text-red-500 text-sm hover:text-red-700 transition-colors"
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
              <p>No comments yet. Be the first to comment!</p>
            )}
          </div>
        </div>
      </main>
    </>
  );
};

export default BookDetails;
