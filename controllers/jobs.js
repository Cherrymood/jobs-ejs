import Job from "../models/Job.js";
import handleErrors from "../utils/parseValidationErrors.js";

// GET a form for adding a new job
export function getNewJob(req, res) {
  res.render("newJob", { jobs: null, csrfToken: req.csrfToken() });
}

// GET all Jobs for the current user
export async function getJobs(req, res, next) {
  try {
    const jobs = await Job.find({ createdBy: req.user._id });
    res.render("jobs", { jobs: jobs, csrfToken: req.csrfToken() });
  } catch (error) {
    handleErrors(error, req, res);
    console.error(error);
    res.status(500).send("An error occurred while fetching jobs");
  }
}

// POST a new Jobs
export async function addJobs(req, res, next) {
  try {
    await Job.create({ ...req.body, createdBy: req.user._id });
    res.redirect("/jobs");
  } catch (error) {
    handleErrors(error, req, res);
  }
}

// Edit a job
export async function editJobs(req, res) {
  const id = req.params.id;
  const updatedJobData = req.body;
  try {
    await Job.update(id, updatedJobData);
    const job = await Job.findById(req.params.id);
    res.render("job", { job: job, csrfToken: req.csrfToken() });
    res.redirect(`/jobs`);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
}
// GET a specific jobs for editing
export async function getEditJob(req, res) {
  // console.log("Job ID getEditJob:", req.params.id); // Debugging line
  // console.log("Body getEditJob", req.body);
  try {
    const job = await Job.findById(req.params.id);
    if (job) {
      res.render("job", { job: job, csrfToken: req.csrfToken() });
    } else {
      // This else block is implied by the catch block for errors, including "not found"
      throw new Error("Job not found");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred while fetching the job");
  }
}

// POST an updated jobs
export async function updateJobs(req, res, next) {
  // const {
  //   user: { id: createdBy },
  //   params: { id: jobId },
  //   body: { company, position },
  // } = req;

  // console.log("Job ID: updateJobs", req.params.id); // Debugging line
  // console.log("Body updateJobs", req.body);
  try {
    const updatedJobs = await Job.findOneAndUpdate(
      { _id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updatedJobs) {
      req.flash("error", "Job not found");
      return res.redirect("/jobs"); // Redirect to jobs page on error
    }
    res.redirect("/jobs");
  } catch (error) {
    console.error(error); // Log the error for debugging
    handleErrors(error, req, res, "/jobs/edit/" + req.params.id);
  }
}

// POST to delete a job
export async function deleteJobs(req, res, next) {
  try {
    const deletedJobs = await Job.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });
    if (!deletedJobs) {
      res.status(404);
      req.flash("error", "Job not found");
      return res.redirect("/jobs");
    }
    req.flash("success", "Job was deleted");
    res.redirect("/jobs");
  } catch (error) {
    handleErrors(error, req, res, "/jobs");
  }
}
