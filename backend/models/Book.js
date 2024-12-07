const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true }, // Unique identifier from Google Books API
  title: { type: String, required: true },
  author: { type: [String], required: true },
  coverImage: { type: String, required: true },
  description: { type: String },
  averageRating: { type: Number, default: 0 }, // Average rating
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // User who rated
      rating: { type: Number, required: true }, // Rating value
    },
  ],
  review: { type: String },
  numberOfPages: { type: Number },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Book", bookSchema);
