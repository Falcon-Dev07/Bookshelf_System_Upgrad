const express = require("express");
const authenticateToken = require("../middleware/auth");
const router = express.Router();

router.get("/protected", authenticateToken, (req, res) => {
  res.json({ message: "You have access to this protected route!" });
});

module.exports = router;
