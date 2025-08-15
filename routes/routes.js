const { Router } = require("express");
const userValidation = require("../middleware/userValidation");
const router = new Router();

router.get("/", (req, res) => {
  res.render("index");
});
router.get("/signup", (req, res) => {
  res.render("signUpPage");
});
router.post("/signup", userValidation.validateSignupForm, (req, res) => {
  console.log(req.body);
});

module.exports = router;
