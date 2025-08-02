// server/models/commentModel.js
import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true, index: true },
  user: {
    id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    role: { type: String, required: true },
  },
  commentText: { type: String, required: true },
}, { timestamps: true });

export const Comment = mongoose.model("Comment", commentSchema);