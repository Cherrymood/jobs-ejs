import User from "../models/User.js";
import parseVErr from "../utils/parseValidationErrors.js";

export function registerShow(req, res) {
  res.render("register");
}

export function logonShow(req, res) {
  return req.user ? res.redirect("/") : res.render("logon");
}

export async function registerDo(req, res) {
  try {
    if (req.body.password !== req.body.password1) {
      throw new Error("The passwords do not match.");
    }
    await User.create(req.body);
    res.redirect("/");
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseVErr(e, req);
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      req.flash("error", "That email address is already registered.");
    } else {
      req.flash("error", e.message);
    }
    res.render("register", {
      errors: req.flash("error"),
      csrfToken: req.csrfToken(),
    });
  }
}

export function logoff(req, res) {
  req.session.destroy(function (err) {
    if (err) {
      console.log(err);
    }
    res.redirect("/");
  });
}
