const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  googleId: { type: String, required: true }, // Google Book's ID (no unique constraint)
  title: { type: String, required: true },
  author: { type: [String], required: true },
  coverImage: { type: String, required: true },
  description: { type: String },
  avgRate: { type: Number, default: 0 },
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who rated
      rating: { type: Number, required: true, min: 1, max: 5 }, // Rating value
    },
  ],
  review: { type: String },
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
