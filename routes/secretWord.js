import express from "express";
const router = express.Router();
import csrfProtection from "../middleware/csrfProtection.js";

router.get("/", csrfProtection, (req, res) => {
  req.session.secretWord ||= "syzygy";
  res.render("secretWord", {
    secretWord: req.session.secretWord,
    csrfToken: req.csrfToken(),
  });
});

router.post("/", csrfProtection, (req, res) => {
  if (req.body.secretWord?.toLowerCase().startsWith("p")) {
    req.flash("error", "That word won't work!");
    req.flash("error", "You can't use words that start with p.");
  } else {
    req.session.secretWord = req.body.secretWord;
    req.flash("info", "The secret word was changed.");
  }

  res.redirect("/secretWord");
});

export default router;
