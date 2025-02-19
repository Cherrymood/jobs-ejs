import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import User from "../models/User.js";

export default function passportInit() {
  passport.use(
    new LocalStrategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          // Find user by email
          const user = await User.findOne({ email });
          if (!user) {
            console.warn(`Login failed: User not found for email ${email}`);
            return done(null, false, { message: "Invalid email or password." });
          }

          // Validate password
          const isMatch = await user.comparePassword(password);
          if (!isMatch) {
            console.warn(`Login failed: Incorrect password for ${email}`);
            return done(null, false, { message: "Invalid email or password." });
          }

          // Successful authentication
          return done(null, user);
        } catch (error) {
          console.error("Authentication error:", error);
          return done(error);
        }
      }
    )
  );

  passport.serializeUser((user, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id, done) => {
    try {
      const user = await User.findById(id);
      if (!user) {
        console.error(`Deserialization failed: No user found with ID ${id}`);
        return done(new Error("User not found"));
      }
      return done(null, user);
    } catch (error) {
      console.error("Deserialization error:", error);
      return done(error);
    }
  });
}
