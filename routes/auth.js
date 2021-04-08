const express = require("express");
const passport = require("passport");
const router = express.Router();

//@route get /auth/google
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

//@route get /auth/google/callback
router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    res.redirect("/dashboard");
  }
);

//@route get /auth/logout
router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

module.exports = router;
