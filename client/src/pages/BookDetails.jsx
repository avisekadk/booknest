import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Import useNavigate
import { useSelector } from "react-redux";
import axios from "axios";
import { toast } from "react-toastify";
import Header from "../layout/Header";

const BookDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate(); // Initialize the navigate hook
  const { user } = useSelector((state) => state.auth);
  const [book, setBook] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  // A more efficient function to fetch both book details and its comments.
  const fetchBookAndComments = async () => {
    try {
      setIsLoading(true);

      // Fetch a single book by its ID. This is more efficient than fetching all books.
      const bookRes = await axios.get(
        `http://localhost:4000/api/v1/book/${id}`,
        { withCredentials: true }
      );
      setBook(bookRes.data.book);

      // Fetch all comments for the specific book ID.
      const commentsRes = await axios.get(
        `http://localhost:4000/api/v1/comment/${id}`,
        { withCredentials: true }
      );
      setComments(commentsRes.data.comments);
    } catch (error) {
      console.error("Error fetching book details and comments:", error);
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
    try {
      await axios.post(
        `http://localhost:4000/api/v1/comment/${id}`,
        { commentText: newComment },
        { withCredentials: true }
      );
      setNewComment("");
      fetchBookAndComments(); // Refresh comments after adding a new one
      toast.success("Comment posted!");
    } catch (error) {
      console.error("Error posting comment:", error);
      toast.error("Failed to post comment.");
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await axios.delete(`http://localhost:4000/api/v1/comment/${commentId}`, {
        withCredentials: true,
      });
      fetchBookAndComments(); // Refresh comments after deletion
      toast.success("Comment deleted!");
    } catch (error) {
      console.error("Error deleting comment:", error);
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

  // Handle case where book is not found
  if (!book) {
    return (
      <div className="text-center mt-20 text-xl font-inter text-gray-700">
        Book not found.
      </div>
    );
  }

  return (
    <>
      <main className="relative flex-1 p-6 pt-28 font-inter bg-gray-100 min-h-screen">
        <Header />

        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => navigate(-1)} // Navigate back to the previous page
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition duration-200"
          >
            &larr; Back to Books
          </button>
        </div>

        {/* Book Details Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
          <h1 className="text-3xl font-bold">{book?.title}</h1>
          <h2 className="text-xl text-gray-700 mb-2">by {book?.author}</h2>
          <p className="text-gray-600">{book?.description}</p>
          <p className="mt-4 font-semibold">
            Available Copies: {book?.quantity}
          </p>
        </div>

        {/* Comments Section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h3 className="text-2xl font-bold mb-4">Discussion</h3>
          {/* Add Comment Form */}
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
                          className="text-red-500 hover:text-red-700 text-sm transition-colors duration-200"
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
