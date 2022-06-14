const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const methodOverride = require("method-override");
const MongoStore = require("connect-mongo");
const connectDB = require("./config/db");
const { engine } = require("express-handlebars");

// Initialize variables Start
const app = express();
const PORT = process.env.PORT || 3000;
/**
 * Body Parser Init
 */
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// Initialize variables End

// Load Configuration Start
dotenv.config({ path: ".env" });
// Load Configuration End

// Passport Configuration Start
require("./config/passport")(passport);
// Passport Configuration End

//Method Override Start
app.use(
  methodOverride(function (req, res) {
    if (req.body && typeof req.body === "object" && "_method" in req.body) {
      // look in urlencoded POST bodies and delete it
      let method = req.body._method;
      delete req.body._method;
      return method;
    }
  })
);
//Method Override End

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

// Set Global Variable
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

// Connect Database Start
connectDB();
// Connect Database End

// Logging In Start
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
// Logging In End

// Handlebars Start
// Handlebars Helper Fetch
const {
  formatDate,
  truncate,
  stripTags,
  editIcon,
  checkStatus,
  select,
} = require("./helpers/hbs");
app.engine(
  "hbs",
  engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: "views/layouts/",
    helpers: { formatDate, truncate, stripTags, editIcon, checkStatus, select },
  })
);
app.set("view engine", "hbs");
app.set("views", "./views");
// Handlebars End

// Static Folder Start
app.use(express.static(path.join(__dirname, "public")));
// Static Folder End

// Load Static Images Start
app.use(express.static("assets"));
app.use("/images", express.static("images"));
// Load Static Images End

// Routes Start
app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));
// Routes End

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);
