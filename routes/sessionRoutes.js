import express from "express";
import passport from "passport";
import csrfProtection from "../middleware/csrfProtection.js";
const sessionRoutes = express.Router();

import {
  logonShow,
  registerShow,
  registerDo,
  logoff,
} from "../controllers/sessionController.js";

sessionRoutes
  .route("/register")
  .get(csrfProtection, registerShow)
  .post(csrfProtection, registerDo);

sessionRoutes
  .route("/logon")
  .get(csrfProtection, logonShow)
  .post(
    csrfProtection,
    passport.authenticate("local", {
      successRedirect: "/",
      failureRedirect: "/sessions/logon",
      failureFlash: true,
    })
  );

sessionRoutes.route("/logoff").post(csrfProtection, logoff);

export default sessionRoutes;
