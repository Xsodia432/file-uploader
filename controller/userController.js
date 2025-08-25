const passport = require("passport");
const prismaService = require("../db/prismaServices");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { format, formatDistanceToNow } = require("date-fns");
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

  res.render("index", { files: files, title: "Vaul | Tage", folderId: null });
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
    req.body["file_name"]
  );

  res.send({ msg: "Success" });
};

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, path.join(__dirname, "..", "userStorage"));
  },
  filename: async (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

exports.upload = multer({ storage }).single("file");

exports.uploadFile = async (req, res, next) => {
  if (!req.file) return res.routes("/");
  await prismaService.createFile(
    req.user.id,
    req.file.filename,
    req.file.originalname,
    req.file.size,
    req.params.folderId ? req.params.folderId : null
  );
  const folder = await prismaService.findFolderById(req.params.folderId);
  res.redirect(
    req.params.folderId ? `/folder/${folder.id}/${folder.name}` : "/"
  );
};
exports.getFolder = async (req, res) => {
  const { id, name } = req.params;

  const files = await prismaService.findFilesByFolderId(id);

  res.render("folderPage", {
    files: files,
    title: name,
    folderId: id,
  });
};
exports.getFile = async (req, res) => {
  const { id } = req.params;
  const file = await prismaService.findFileById(id);

  res.render("filePage", {
    title: file.name,
    fileSize: file.file_size,
    uploadDate: format(file.createdAt, "MMMM dd, yyyy"),

    uploader: file.user.user_name,
    fileId: file.id,
  });
};
exports.downloadFile = async (req, res) => {
  const { id } = req.params;
  const file = await prismaService.findFileById(id);

  const filePath = path.join(__dirname, "..", "userStorage", file.file_name);
  res.download(filePath, file.name, (err) => {
    if (err) res.status(500).send("File not found");
  });
};
exports.updateFile = async (req, res) => {
  const { file_name, file_id, file_type } = req.body;
  await prismaService.updateFile(file_name, file_id, file_type);
  res.send({ msg: "Success" });
};
exports.deleteFile = async (req, res) => {
  console.log(req.params.filetype);
  await prismaService.deleteFile(req.params.id, req.params.filetype);

  res.redirect("/");
};
