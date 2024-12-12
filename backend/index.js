const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const session = require("express-session");
const cors = require("cors");
const dotenv = require("dotenv");
const authRoutes = require("./routes/auth"); // Login/Signup routes
const protectedRoutes = require("./routes/protected"); // Protected routes
const googleAuthRoutes = require("./routes/googleAuth");
const bookRoutes = require("./routes/bookRoutes");
//const bookController = require(".controllers/bookController");

dotenv.config();
require("./config/passport");

const app = express();

// Middleware: Apply CORS before routes
app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST", "PATCH", "DELETE", "PUT"], // Allowed methods
    credentials: true, // Allow cookies if needed
  })
);
app.use(cors());

// Middleware: Body parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected successfully"))
  .catch((err) => {
    console.error("MongoDB connection error:", err.message);
    process.exit(1); // Exit the app if the connection fails
  });

// Middleware: Session
app.use(
  session({
    secret: process.env.SESSION_SECRET, // Replace with a strong secret
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set to true if using HTTPS
  })
);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRoutes); // Auth routes
app.use("/api", protectedRoutes); // Protected routes
app.use("/auth", googleAuthRoutes);
app.use("/api/books", bookRoutes);

// Logout Route
app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Failed to destroy session:", err);
      return res.status(500).send("Logout failed");
    }
    res.clearCookie("connect.sid"); // Clear session cookie
    res.status(200).send("Logged out successfully");
  });
});

// Root route
app.get("/", (req, res) => {
  res.send("Session is working!");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
