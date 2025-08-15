const { PrismaClient } = require("../generated/prisma");
const { withAccelerate } = require("@prisma/extension-accelerate");
const prisma = new PrismaClient().$extends(withAccelerate());
exports.findUserByUserName = async (user_name) => {
  const user = await prisma.users.findFirst({
    where: {
      user_name: user_name,
    },
  });
  return user;
};
exports.createUser = async (user_name, password) => {
  await prisma.users.create({
    data: {
      user_name: user_name,
      password: password,
    },
  });
};
exports.findUserByUserId = async (id) => {
  const user = await prisma.users.findFirst({
    where: {
      id: id,
    },
  });
  return user;
};
exports.deleteUsers = async () => {
  await prisma.files.deleteMany();
  await prisma.folders.deleteMany();
  await prisma.users.deleteMany();
};
