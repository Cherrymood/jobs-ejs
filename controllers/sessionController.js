import User from "../models/User.js";
import parseValidationErrors from "../utils/parseValidationErrs.js";

function registerShow(req, res) {
  res.render("register");
}

async function registerDo(req, res, next) {
  if (req.body.password !== req.body.password1) {
    req.flash("error", "The passwords entered do not match.");
    return res.render("register", { errors: req.flash("error") });
  }

  try {
    await User.create(req.body);
  } catch (e) {
    if (e.constructor.name === "ValidationError") {
      parseValidationErrors(e, req);
    } else if (e.name === "MongoServerError" && e.code === 11000) {
      req.flash("error", "That email address is already registered.");
    } else {
      return next(e);
    }
    return res.render("register", { errors: req.flash("error") });
  }

  res.redirect("/");
}

const logoff = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    req.session.destroy((err) => {
      if (err) {
        console.log(err);
      }
      res.redirect("/");
    });
  });
};

function logonShow(req, res) {
  if (req.user) {
    return res.redirect("/");
  }
  res.render("logon");
}

export { registerShow, registerDo, logoff, logonShow };
