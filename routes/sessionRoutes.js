import express from "express";
import passport from "passport";
const router = express.Router();

import {
  logonShow,
  registerShow,
  registerDo,
  logoff,
} from "../controllers/sessionController.js";

router.route("/register").get(registerShow).post(registerDo);
router.route("/logoff").post(logoff);
router
  .route("/logon")
  .get(logonShow)
  .post(
    passport.authenticate("local", {
      successRedirect: "/secretWord",
      failureRedirect: "/sessions/logon",
      failureFlash: true,
    })
  );

export default router;
