const { body, validationResult } = require("express-validator");
const prismaService = require("../db/prismaServices");
const { max } = require("date-fns");

const fields = [
  body("user_name").notEmpty().withMessage("User name should not be empty"),
  body("password").notEmpty().withMessage("Password should not be empty"),
];

exports.validateSignupForm = [
  fields,
  body("user_name")
    .isLength({ min: 5, max: 100 })
    .withMessage("User name should be between 5 to 100 characters")
    .custom(async (value) => {
      const user = await prismaService.findUserByUserName(value);

      if (user) throw new Error("User name already exists");
      return true;
    }),
  body("confirm_password")
    .notEmpty()
    .withMessage("Confirm password should not be empty")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password doesn't match");
      } else return true;
    }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send({ errors: errors.array() });
      return;
    }

    next();
  },
];
exports.validateLoginForm = [
  fields,
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.send({ errors: errors.array() });
      return;
    }
    next();
  },
];
exports.validateFolderForm = [
  body("folder_name")
    .notEmpty()
    .withMessage("Folder name should not be empty")
    .isLength({ min: 1, max: 255 })
    .withMessage("Folder name should be between 1 and 255 characters "),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.send({ errors: errors.array() });
    next();
  },
];
