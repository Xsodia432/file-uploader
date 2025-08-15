const express = require("express");
const routes = require("./routes/routes");
const passport = require("passport");
const session = require("express-session");
require("dotenv/config");
const path = require("node:path");
const assetsPath = path.join(__dirname, "public");
const app = express();
const { format, formatDistanceToNow } = require("date-fns");

app.set("views", path.join(__dirname, "views"));

app.set("view engine", "ejs");

// app.use(passport.session());

app.use(express.static(assetsPath));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/", routes);
app.use("/{*splat}", routes);
app.use((err, req, res, next) => {
  res.status(err.statusCode || 500).send(err);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Express Host Listening ${PORT}`));
