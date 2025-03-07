export default function authMiddleware(req, res, next) {
  if (req.user) return next();

  req.flash("error", "You can't access that page before logon.");
  res.redirect("/");
}
