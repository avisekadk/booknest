import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/errorMiddlewares.js";
import { Comment } from "../models/commentModel.js";
import { Book } from "../models/bookModel.js";

export const addComment = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;
  const { commentText } = req.body;
  const { _id, name, role } = req.user;

  if (!commentText) {
    return next(new ErrorHandler("Comment text is required.", 400));
  }

  await Comment.create({
    bookId,
    commentText,
    user: {
      id: _id,
      name: role === "Admin" ? "BookNest" : name,
      role: role,
    }
  });

  res.status(201).json({ success: true, message: "Comment added successfully." });
});

export const getCommentsForBook = catchAsyncErrors(async (req, res, next) => {
  const { bookId } = req.params;
  const comments = await Comment.find({ bookId }).sort({ createdAt: -1 });
  res.status(200).json({ success: true, comments });
});

export const deleteComment = catchAsyncErrors(async (req, res, next) => {
  const { commentId } = req.params;
  const comment = await Comment.findById(commentId);

  if (!comment) {
    return next(new ErrorHandler("Comment not found.", 404));
  }

  if (req.user.role === "Admin" || comment.user.id.toString() === req.user._id.toString()) {
    await comment.deleteOne();
    return res.status(200).json({ success: true, message: "Comment deleted." });
  }

  return next(new ErrorHandler("You are not authorized to delete this comment.", 403));
});