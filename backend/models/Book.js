const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  googleId: { type: String, required: true }, // Google Book's ID (no unique constraint)
  title: { type: String, required: true },
  author: { type: [String], required: false, default: "Unknown Author" }, // Optional
  coverImage: { type: String, required: false }, // Optional
  description: {
    type: String,
    required: false,
    default: "No description available",
  },
  avgRate: { type: Number, default: 0 },
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who rated
      rating: { type: Number, required: false, min: 0, max: 5 }, // Rating value
    },
  ],
  reviews: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who wrote the review
      reviewText: { type: String, required: false }, // The review content
    },
  ],
  numberOfPages: { type: Number, default: 0 },
  userIds: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  ],
});

// Enforce uniqueness per userId and googleId combination(This allows multiple user to add same book)
bookSchema.index({ userId: 1, googleId: 1 }, { unique: true });

module.exports = mongoose.model("Book", bookSchema);
