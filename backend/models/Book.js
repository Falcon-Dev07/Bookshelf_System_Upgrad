const mongoose = require("mongoose");

const bookSchema = new mongoose.Schema({
  googleId: { type: String, required: true, unique: true }, // Unique identifier from Google Books API
  title: { type: String, required: true },
  author: { type: [String], required: true },
  coverImage: { type: String, required: true },
  description: { type: String },
  averageRating: { type: Number },
  review: { type: String },
  pageCount: { type: Number },
  addedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
});

module.exports = mongoose.model("Book", bookSchema);
