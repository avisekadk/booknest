import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book' }, // Optional, for book-related notifications
    isRead: { type: Boolean, default: false },
    type: { type: String, enum: ['availability', 'overdue'], required: true }
}, { timestamps: true });

export const Notification = mongoose.model("Notification", notificationSchema);