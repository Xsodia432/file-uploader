const passport = require("passport");
const prismaService = require("../db/prismaServices");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");

const multer = require("multer");
const { format, addDays } = require("date-fns");
const { url } = require("inspector");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

require("dotenv/config");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
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
    if (!user)
      return res.send({
        errors: [info],
        errorContainer: "error-container",
      });
    req.login(user, (err) => {
      if (err) return res.send({ errors: [err] });
      return res.send({
        msg: "Success",
        errorContainer: "error-container",
      });
    });
  })(req, res);
};

exports.createFolder = async (req, res) => {
  const folderName = await prismaService.createFolder(
    req.user.id,
    req.body["file_name"]
  );

  res.send({ msg: "Success", errorContainer: "error-folder-container" });
};

exports.upload = multer({ storage: multer.memoryStorage() }).single("file");

exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) return res.routes("/");

    const fileBase64 = `data:${
      req.file.mimetype
    };base64,${req.file.buffer.toString("base64")}`;
    const result = await cloudinary.uploader.upload(fileBase64, {
      resource_type: "raw",
      type: "upload",
    });

    //insert to DB
    await prismaService.createFile(
      req.user.id,
      req.file.originalname,
      result.display_name,
      req.file.size,
      req.params.folderId ? req.params.folderId : null,
      result.secure_url,
      req.file.mimetype
    );
    res.redirect(
      req.params.folderId
        ? `/folder/${req.params.folderId}/${folder.name}`
        : "/"
    );
  } catch (err) {
    throw new Error("Something's wrong");
  }
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
  try {
    const { id } = req.params;
    const file = await prismaService.findFileById(id);
    const response = await fetch(file.url);
    res.setHeader("Content-disposition", `attachment; filename=${file.name}`);
    res.setHeader("Content-Type", file.file_type);

    Readable.fromWeb(response.body).pipe(res);
  } catch (err) {
    console.log(err);
  }
};
exports.updateFile = async (req, res) => {
  const { file_name, file_id, file_type } = req.body;

  await prismaService.updateFile(file_name, file_id, file_type);
  res.send({ msg: "Success" });
};
exports.deleteFile = async (req, res) => {
  await prismaService.deleteFile(req.params.id, req.params.filetype);

  res.redirect("/");
};
exports.fileShare = async (req, res) => {
  const { file_id, user_name, duration } = req.body;
  const userId = await prismaService.findUserByUserName(user_name);

  await prismaService.fileShare(
    file_id,
    userId.id,
    addDays(new Date(), parseInt(duration))
  );
  res.send({ msg: "Success", errorContainer: "error-share-container" });
};
exports.getShare = async (req, res) => {
  const shareFiles = await prismaService.getShareFiles(req.user.id);

  res.render("sharePage", {
    sharefiles: shareFiles,
    title: "Share",
    folderId: null,
    format: format,
  });
};
