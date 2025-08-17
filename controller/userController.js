const passport = require("passport");
const prismaService = require("../db/prismaServices");
const LocalStrategy = require("passport-local").Strategy;
// const bcrypt = require("bcryptjs");

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

exports.createAccount = async (req, res, next) => {
  await prismaService.createUser(req.body.user_name, req.body.password);
  next();
};
exports.deleteUsers = async (req, res) => {
  await prismaService.deleteUsers();
};
