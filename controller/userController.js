const passport = require("passport");
const prismaService = require("../db/prismaServices");
const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const mime = require("mime-types");
const multer = require("multer");
const { format, addDays } = require("date-fns");
const { url } = require("inspector");
const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");
const { fi } = require("date-fns/locale");

require("dotenv/config");
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
function fileSizeFormat(fileSize, n = 0) {
  const unitSystem = ["bytes", "KB", "MB", "GB"];
  if (fileSize > 1024) {
    return fileSizeFormat(fileSize / 1024, n + 1);
  }
  return `${Math.round(fileSize * 100) / 100} ${unitSystem[n]}`;
}
passport.use(
  new LocalStrategy(
    { usernameField: "user_name", passwordField: "password" },
    async (user_name, password, done) => {
      try {
        const user = await prismaService.findUserByUserName(user_name);

        if (!user) return done(null, false, { msg: "Username not found" });
        const match = await bcrypt.compare(password, user.password);
        if (!match) return done(null, false, { msg: "Password incorrect" });
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
  try {
    const files = req.user
      ? await prismaService.findFilesByUserId(req.user.id)
      : null;
    const user = req.user ? req.user.user_name : null;
    const initial = req.user ? req.user.user_name[0].toUpperCase() : null;

    res.render("index", {
      files: files,
      title: "Vault | Tage",
      folderId: null,
      dateFormat: format,
      fileSizeFormat: fileSizeFormat,
      user: user,
      initial: initial,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.createAccount = async (req, res, next) => {
  const hash = await bcrypt.hash(req.body.password, 10);
  await prismaService.createUser(req.body.user_name, hash);
  next();
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

    await prismaService.createFile(
      req.user.id,
      req.file.originalname,
      result.display_name,
      req.file.size,
      req.params.folderId ? req.params.folderId : null,
      result.secure_url,
      req.file.mimetype
    );

    const folder = await prismaService.findFolderById(req.params.folderId);

    res.redirect(
      req.params.folderId
        ? `/folder/${req.params.folderId}/${folder.name}`
        : "/"
    );
  } catch (err) {
    console.log(err);
  }
};

exports.getFolder = async (req, res) => {
  const { id, name } = req.params;
  const user = req.user ? req.user.user_name : null;
  const initial = req.user ? req.user.user_name[0].toUpperCase() : null;
  const files = await prismaService.findFilesByFolderId(id, req.user.id);

  res.render("folderPage", {
    files: files,
    title: name,
    folderId: id,
    user: user,
    initial: initial,
    format: format,
    fileSizeFormat: fileSizeFormat,
  });
};
exports.getFile = async (req, res) => {
  const { id } = req.params;
  const file = await prismaService.findFileById(id);
  if (file) {
    return res.render("filePage", {
      title: file.name,
      fileSize: file.file_size,
      uploadDate: format(file.createdAt, "MMMM dd, yyyy"),
      fileType: file.file_type,
      uploader: file.user.user_name,
      fileId: file.id,
      fileSizeFormat: fileSizeFormat,
    });
  } else return res.render("404", { title: "Not found", type: "File" });
};
exports.downloadFile = async (req, res) => {
  try {
    const { id } = req.params;
    const file = await prismaService.findFileById(id);
    const response = await fetch(file.url);
    const fileName = file.name.endsWith(`.${mime.extension(file.file_type)}`)
      ? file.name
      : `${file.name}.${mime.extension(file.file_type)}`;

    res.setHeader("Content-disposition", `attachment; filename=${fileName}`);
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
  try {
    const file = await prismaService.findFileById(req.params.id);

    const result = cloudinary.uploader.destroy(file.file_name, {
      resource_type: "raw",
    });
    await prismaService.deleteFile(req.params.id);
    res.redirect("/");
  } catch (err) {
    console.log(err);
  }
};
exports.fileShare = async (req, res) => {
  const { file_id, duration } = req.body;

  await prismaService.fileShare(
    file_id,

    addDays(new Date(), parseInt(duration))
  );
  res.send({ msg: "Success", errorContainer: "error-share-container" });
};
exports.getShare = async (req, res) => {
  const share = await prismaService.getShareFiles(req.params.id);

  if (share) {
    const shareFiles = await prismaService.findFilesByFolderId(share.file_id);
    const initial = req.user.user_name[0].toUpperCase();

    res.render("sharePage", {
      shareFiles: shareFiles,
      owner: share.file.user.user_name,
      folderName: share.file.name,
      title: "Share",
      folderId: null,
      format: format,
      initial: initial,
      fileSizeFormat: fileSizeFormat,
    });
  } else return res.render("404", { title: "Not Found", type: "Folder" });
};
