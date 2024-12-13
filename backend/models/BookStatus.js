const mongoose = require("mongoose");

const userBookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  googleId: { type: String, required: true },
  status: {
    type: String,
    enum: ["want_to_read", "currently_reading", "completed"],
    default: "want_to_read", // Set the default status to "want to read"
    required: true,
  },
  progress: { type: Number, min: 0, max: 100, required: true, default: 0 }, // New field
  readingNotes: { type: String, default: "" },
});

// Ensures that a user can have only one status for each book
userBookSchema.index({ userId: 1, googleId: 1 }, { unique: true });

module.exports = mongoose.model("StatusBook", userBookSchema);
