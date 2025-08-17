const { Router } = require("express");
const userValidation = require("../middleware/userValidation");
const userController = require("../controller/userController");
const passport = require("passport");
const router = new Router();

router.get("/", (req, res) => {
  res.render("index");
});
router.get("/signup", (req, res) => {
  res.render("signUpPage");
});
router.post(
  "/signup",
  userValidation.validateSignupForm,
  userController.createAccount,
  passport.authenticate("local"),
  (req, res) => {
    res.send({ msg: "Success" });
  }
);

router.post("/login", userValidation.validateLoginForm, (req, res) => {
  passport.authenticate("local", (error, user, info) => {
    if (!user) return res.send({ errors: [info] });
    req.login(user, (err) => {
      if (err) return res.send({ errors: [err] });
      return res.send({ msg: "Success" });
    });
  })(req, res);
});

router.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
});
router.get("/delete", userController.deleteUsers);
module.exports = router;
