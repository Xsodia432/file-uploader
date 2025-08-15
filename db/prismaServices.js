const { PrismaClient } = require("../generated/prisma");
const { withAccelerate } = require("@prisma/extension-accelerate");
const prisma = new PrismaClient().$extends(withAccelerate());
exports.findUserByUserName = async (user_name) => {
  const user = await prisma.users.findFirst({
    where: {
      user_name: user_name,
    },
    select: {
      user_name: true,
    },
  });
  return user;
};
