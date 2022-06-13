const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const { engine } = require("express-handlebars");
const connectDB = require("./config/db");

// Initialize variables Start
const app = express();
const PORT = process.env.PORT || 3000;
// Initialize variables End

// Load Configuration Start
dotenv.config({ path: ".env" });
// Load Configuration End

// Passport Configuration Start
require("./config/passport")(passport);
// Passport Configuration End

// Sessions Start
app.use(
  session({
    //Usage
    secret: "crazy-monkey",
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
    }),
  })
);
// Sessions End

// Passport Middleware Start
app.use(passport.initialize());
app.use(passport.session());
// Passport Middleware End

// Connect Database Start
connectDB();
// Connect Database End

// Logging In Start
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Logging In End

// Handlebars Start
app.engine(
  "hbs",
  engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: "views/layouts/",
  })
);
app.set("view engine", "hbs");
app.set("views", "./views");
// Handlebars End

// Static Folder Start
app.use(express.static(path.join(__dirname, "public")));
// Static Folder End

// Routes Start
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
// Routes End

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
