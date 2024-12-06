import express from "express";
import "dotenv/config";
import { connect } from "mongoose";
import connectMongoDB from "./db.js";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import cookieParser from "cookie-parser";
import session from "express-session";
import flash from "connect-flash";

const app = express();
const PORT = process.env.PORT || 3000;

// connect to mongodb
connectMongoDB();

// middlewares

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cookie middleware

app.use(cookieParser(process.env.COOKIE_SECRET));

// session middleware

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60000 * 60 * 24 * 7, //1 week
    },
  })
);

// flash message middleware

app.use(flash());

// store flash message for views

app.use(function (req, res, next) {
  res.locals.message = req.flash();
  next();
});

// store authenticated user session data for views

app.use(function(req, res, next){
    res.locals.user = req.session.user || null;
    next();
})

// set template engine to ejs

app.set("view engine", "ejs");


// auth routes
app.use("/", authRoutes);

// post routes

app.use("/", postRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});