export default function storeLocals(req, res, next) {
  // Debugging log (only for development)
  if (process.env.NODE_ENV !== "production") {
    console.log("Session Data:", JSON.stringify(req.session, null, 2));
  }

  // Store user in locals if authenticated
  res.locals.user = req.session?.passport?.user || null;

  // Ensure flash messages are always arrays to prevent errors
  res.locals.info = req.flash("info") || [];
  res.locals.errors = req.flash("error") || [];

  next();
}
