import mongoose from "mongoose";

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    author: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    /**
     * @desc The total number of copies of the book, including those borrowed.
     * This is useful for tracking the total inventory.
     */
    totalCopies: {
      type: Number,
      required: true,
    },
    availability: {
      type: Boolean,
      default: true,
    },
    borrowCount: { // For sorting by popularity
      type: Number,
      default: 0,
    },
    subscribers: [{ // For "Notify Me" feature
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
  },
  {
    timestamps: true,
  }
);

export const Book = mongoose.model("Book", bookSchema);