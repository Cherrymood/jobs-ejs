import express from "express";
import "express-async-errors";
import bodyParser from "body-parser";
import env from "dotenv";
import session from "express-session";
import connectMongoDBSession from "connect-mongodb-session";
import flash from "connect-flash";
import secretWordRouter from "./routes/secretWord.js";
import auth from "./routes/auth.js";
import connectDB from "./db/connect.js";
import sessionRoutes from "./routes/sessionRoutes.js";
import passport from "passport";
import passportInit from "./passport/passportInit.js";
import storeLocals from "./middleware/storeLocals.js";

const MongoDBStore = connectMongoDBSession(session);

env.config();

const app = express();
const url = process.env.MONGO_URI;

const store = new MongoDBStore({
  // may throw an error, which won't be caught
  uri: url,
  collection: "mySessions",
});
store.on("error", function (error) {
  console.log(error);
});
const sessionParms = {
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: store,
  cookie: { secure: false, sameSite: "strict" },
};

if (app.get("env") === "production") {
  app.set("trust proxy", 1); // trust first proxy
  sessionParms.cookie.secure = true; // serve secure cookies
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session(sessionParms));
app.use(flash());
app.use((req, res, next) => {
  res.locals.info = req.flash("info");
  res.locals.errors = req.flash("error");
  next();
});
app.use(storeLocals);
passportInit();
app.use(passport.initialize());
app.use(passport.session());

app.set("view engine", "ejs");
app.set("views", "./views");

// secret word handling
app.get("/", (req, res) => {
  res.render("index");
});
app.use("/sessions", sessionRoutes);
app.use("/secretWord", auth, secretWordRouter);

const port = process.env.PORT || 3000;
await connectDB(process.env.MONGO_URI);

const start = async () => {
  try {
    app.listen(port, () =>
      console.log(`Server is listening on port ${port}...`)
    );
  } catch (error) {
    console.log(error);
  }
};

start();
