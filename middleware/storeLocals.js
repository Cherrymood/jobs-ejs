export default function storeLocals(req, res, next) {
  console.log("Session Data:", req.session); // Debugging log

  if (req.session?.passport?.user) {
    res.locals.user = req.session.passport.user; // Store user ID in locals
  } else {
    res.locals.user = null;
  }

  res.locals.info = req.flash("info");
  res.locals.errors = req.flash("error");

  next();
}
