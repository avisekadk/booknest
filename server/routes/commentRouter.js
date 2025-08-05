import express from "express";
import { isAuthenticated } from "../middlewares/authMiddleware.js";
import {
  addComment,
  getCommentsForBook,
  deleteComment,
} from "../controllers/commentController.js";

const router = express.Router();

router.post("/:bookId", isAuthenticated, addComment);

router.get("/:bookId", getCommentsForBook);

router.delete("/:commentId", isAuthenticated, deleteComment);

export default router;