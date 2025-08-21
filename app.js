const express = require("express");
const { PrismaSessionStore } = require("@quixo3/prisma-session-store");
const { PrismaClient } = require("./generated/prisma");
const routes = require("./routes/routes");
const passport = require("passport");
const session = require("express-session");
require("dotenv/config");
const path = require("node:path");
const assetsPath = path.join(__dirname, "public");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
const { format, formatDistanceToNow } = require("date-fns");

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");

app.use(
  session({
    store: new PrismaSessionStore(new PrismaClient(), {
      checkPeriod: 2 * 60 * 1000,
      dbRecordIdIsSessionId: true,
      dbRecordIdFunction: undefined,
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 24 * 1000 * 60 * 1000,
    },
  })
);

app.use(passport.session());
app.use(express.static(assetsPath));
app.use((req, res, next) => {
  res.locals.helpers = {
    user: req.user,
  };
  next();
});
app.use("/", routes);
app.use("/{*splat}", routes);
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send(err);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express Host Listening ${PORT}`));
