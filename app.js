const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const connectDb = require("./config/db");
const exphbs = require("express-handlebars");
const path = require("path");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require("connect-mongo")(session);
const methodOverride = require("method-override");

//config
dotenv.config({ path: "./config/config.env" });
require("./config/passport")(passport);
connectDb();

const app = express();

//body parser
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//method override
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

const PORT = process.env.PORT || 5000;

//middlewares

app.use(
  session({
    secret: "sajjad haider",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

const {
  formatDate,
  truncate,
  stripTags,
  editIcon,
  select,
} = require("./helpers/hbs");

app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    extname: ".hbs",
    helpers: {
      formatDate,
      truncate,
      stripTags,
      editIcon,
      select,
    },
  })
);
app.set("view engine", ".hbs");
app.use(passport.initialize());
app.use(passport.session());

//global
app.use((req, res, next) => {
  res.locals.user = req.user || null;
  next();
});

//static
app.use(express.static(path.join(__dirname, "public")));

//ROUTES

app.use("/", require("./routes/index"));
app.use("/auth", require("./routes/auth"));
app.use("/stories", require("./routes/stories"));

app.listen(
  PORT,
  console.log(`Server running in ${process.env.NODE_ENV} on ${PORT}`)
);
