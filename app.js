import dotenv from "dotenv";
dotenv.config(); // to load the .env file into the process.env object
import "express-async-errors"; // Import the express-async-errors module to handle async errors
import express from "express";
import session from "express-session";
import flash from "connect-flash";
import passport from "passport";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import methodOverride from "method-override";
import csrfProtection from "./middleware/csrfProtection.js";
import storeLocals from "./middleware/storeLocals.js";
import connectDB from "./db/connect.js";
import auth from "./middleware/auth.js";
import jobRouter from "./routes/jobs.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import passportInit from "./passport/passportInit.js";
import secretWordRouter from "./routes/secretWord.js";

import helmet from "helmet";
import xssClean from "xss-clean";
import rateLimit from "express-rate-limit";
const app = express();

import connectMongoDBSession from "connect-mongodb-session";
const MongoDBStore = connectMongoDBSession(session);
const url = process.env.MONGO_URI;
const store = new MongoDBStore({
  uri: url,
  collection: "mySessions",
});
// Log any errors that occur with the store
store.on("error", function (error) {
  console.log(error);
});

// the parameters for the session middleware
const inProduction = app.get("env") === "production";
const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { sameSite: "strict", secure: inProduction },
};

// If the application is in production
if (inProduction) {
  app.set("trust proxy", 1); // trust first proxy
}

app.use(session(sessionParms));
app.set("view engine", "ejs"); // Set the view engine to ejs for rendering views
app.use(bodyParser.urlencoded({ extended: true })); // Use body-parser middleware to parse incoming request bodies
app.use(flash()); // Add the connect-flash middleware
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));
app.use(methodOverride("_method"));
app.use(csrfProtection);

// Security middlewares
app.use(helmet());
app.use(xssClean());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});
app.use(limiter);
passportInit();
app.use(passport.initialize());
app.use(passport.session());
app.use((req, res, next) => {
  res.locals.info = req.flash("info");
  res.locals.errors = req.flash("error");
  res.locals.csrfToken = req.csrfToken();
  next();
});

app.use(storeLocals);
app.use("/jobs", jobRouter);
app.use("/job", jobRouter);
app.use("/sessions", sessionRoutes);
app.get("/", csrfProtection, (req, res) => {
  res.render("index", { csrfToken: req.csrfToken() });
});
app.use("/secretWord", auth, secretWordRouter);
app.use((req, res) => {
  res.status(404).send(`That page (${req.url}) was not found.`);
});
app.use((err, req, res, next) => {
  res.status(500).send(err.message);
  console.log(err);
});

const port = 3000;

const start = async () => {
  try {
    const url = process.env.MONGO_URI;
    await connectDB(url);
    console.log("Database connected successfully");
    const server = app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
    return server;
  } catch (error) {
    console.log("Failed to connect to the database", error);
    process.exit(1);
  }
};

const server = start();
