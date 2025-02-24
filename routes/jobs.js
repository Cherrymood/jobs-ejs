import express from "express";
import csrfProtection from "../middleware/csrfProtection.js";
import auth from "../middleware/auth.js";

import {
  getNewJob,
  getJobs,
  addJobs,
  editJobs,
  getEditJob,
  updateJobs,
  deleteJobs,
} from "../controllers/jobs.js";

const jobRouter = express.Router();

jobRouter.route("/new").get(auth, getNewJob).post(auth, addJobs);

jobRouter.route("/").get(auth, getJobs).post(auth, addJobs);

jobRouter
  .route("/edit/:id")
  .get(auth, csrfProtection, getEditJob)
  .post(auth, csrfProtection, editJobs);

jobRouter.route("/update/:id").post(auth, csrfProtection, updateJobs);

jobRouter.route("/delete/:id").post(auth, csrfProtection, deleteJobs);

export default jobRouter;
