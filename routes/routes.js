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
  userController.upload,
  userController.uploadFile
);
router.get("/delete", userController.deleteUsers);
router.get("/folder/:id/:name", userController.getFolder);
router.get("/file/i/:id", userController.getFile);
module.exports = router;
