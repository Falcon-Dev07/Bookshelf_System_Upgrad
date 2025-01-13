const express = require("express");
const passport = require("passport");
const router = express.Router();
const jwt = require("jsonwebtoken");

// Determine the frontend base URL dynamically
const FRONTEND_URL =
  process.env.REACT_APP_ENV === "production"
    ? process.env.FRONTEND_BASE_URL // Deployed frontend
    : "http://localhost:3000"; // Local frontend

router.get(
  "/google/signup",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Generate the JWT token after successful Google login
    const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    // Redirect to the frontend with the token in the query string
    //res.redirect(`http://localhost:3000/dashboard?token=${token}`);

    // Redirect to the frontend dashboard with the token
    res.redirect(`${FRONTEND_URL}/dashboard?token=${token}`);
  }
);

module.exports = router;
