const { Router } = require("express");
const userValidation = require("../middleware/userValidation");
const userController = require("../controller/userController");
const passport = require("passport");
const router = new Router();

router.get("/", userController.index);
router.get("/signup", (req, res) => {
  res.render("signUpPage", { title: "Signup" });
});
router.post(
  "/signup",
  userValidation.validateSignupForm,
  userController.createAccount,
  userController.authenticateUser
);

router.post(
  "/login",
  userValidation.validateLoginForm,
  userController.authenticateUser
);
router.post(
  "/upload/folders",
  userValidation.checkLogin,
  userValidation.validateFolderForm,
  userController.createFolder
);

router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});
router.post(
  "/upload/files{/:folderId}",
  userValidation.checkLogin,
  userController.upload,
  userController.uploadFile
);

router.get(
  "/folder/:id/:name",
  userValidation.checkLogin,
  userValidation.checkIfOwner,
  userController.getFolder
);
router.get("/file/i/:id", userController.getFile);
router.post(
  "/file/d/:id",

  userController.downloadFile
);
router.post(
  "/update/file",
  userValidation.checkLogin,
  userValidation.validateFolderForm,
  userController.updateFile
);
router.post(
  "/file/delete/:id/:filetype",
  userValidation.checkLogin,
  userController.deleteFile
);
router.post(
  "/file/share",
  userValidation.checkLogin,
  userValidation.validateShareForm,
  userController.fileShare
);
router.get("/share/:id", userController.getShare);
module.exports = router;
