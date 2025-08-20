const passport = require("passport");
const prismaService = require("../db/prismaServices");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const multer = require("multer");

passport.use(
  new LocalStrategy(
    { usernameField: "user_name", passwordField: "password" },
    async (user_name, password, done) => {
      try {
        const user = await prismaService.findUserByUserName(user_name);

        if (!user) return done(null, false, { msg: "Username not found" });
        if (user.password !== password)
          return done(null, false, { msg: "Password incorrect" });
        done(null, user);
      } catch (err) {
        done(err);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser(async (id, done) => {
  try {
    const row = await prismaService.findUserByUserId(id);
    done(null, row);
  } catch (err) {
    done(err);
  }
});
exports.index = async (req, res) => {
  const files = req.user
    ? await prismaService.findFilesByUserId(req.user.id)
    : null;

  res.render("index", { files: files });
};
exports.createAccount = async (req, res, next) => {
  await prismaService.createUser(req.body.user_name, req.body.password);
  next();
};
exports.deleteUsers = async (req, res) => {
  await prismaService.deleteUsers();
};
exports.authenticateUser = (req, res) => {
  passport.authenticate("local", (error, user, info) => {
    if (!user) return res.send({ errors: [info] });
    req.login(user, (err) => {
      if (err) return res.send({ errors: [err] });
      return res.send({ msg: "Success" });
    });
  })(req, res);
};

exports.createFolder = async (req, res) => {
  const folderName = await prismaService.createFolder(
    req.user.id,
    req.body["folder_name"]
  );
  const dir = path.join(
    __dirname,
    "..",
    "userStorage",
    req.user.id,
    folderName.id
  );
  fs.mkdir(dir, { recursive: true }, (err) => {
    if (err) throw err;
  });
  res.send({ msg: "Success" });
};

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, path.join(__dirname, "..", "userStorage", req.user.id));
  },
  filename: async (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

exports.upload = multer({ storage }).single("file");

exports.uploadFile = async (req, res, next) => {
  if (!req.file) res.send({ errors: [{ msg: "File should not be empty" }] });
  await prismaService.createFile(
    req.user.id,
    req.file.filename,
    req.file.originalname,
    req.file.size
  );
  res.send({ msg: "Success" });
};
