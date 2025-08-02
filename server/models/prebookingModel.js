// server/models/prebookingModel.js
import mongoose from "mongoose";

const prebookingSchema = new mongoose.Schema({
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now, expires: '24h' } // TTL index for auto-expiry
});

// Ensure one user can only prebook a specific book once at a time
prebookingSchema.index({ bookId: 1, userId: 1 }, { unique: true });

export const Prebooking = mongoose.model("Prebooking", prebookingSchema);