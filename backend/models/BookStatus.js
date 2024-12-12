const mongoose = require("mongoose");

const userBookSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  googleId: { type: String, required: true },
  status: {
    type: String,
    enum: ["want to read", "currently reading", "completed"],
    default: "want to read", // Set the default status to "want to read"
    required: true,
  },
});

// Ensures that a user can have only one status for each book
userBookSchema.index({ userId: 1, googleId: 1 }, { unique: true });

module.exports = mongoose.model("StatusBook", userBookSchema);
