const express = require("express");
const passport = require("passport");
const router = express.Router();
const jwt = require("jsonwebtoken");

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
    res.redirect(`http://localhost:3000/dashboard?token=${token}`);
  }
);

module.exports = router;
