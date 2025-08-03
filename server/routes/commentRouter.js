import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  addComment,
  getCommentsForBook,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

// This route allows a logged-in user to POST a new comment.
router.post("/:bookId", isAuthenticated, addComment);

// This route is now PUBLIC, allowing anyone to GET comments for a book.
router.get("/:bookId", getCommentsForBook);

// This route requires a user to be logged in to DELETE a comment.
router.delete("/:commentId", isAuthenticated, deleteComment);

export default router;