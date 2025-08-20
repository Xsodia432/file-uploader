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
  // await prisma.users.deleteMany();
};
exports.createFolder = async (userId, folderName) => {
  const folder = await prisma.folders.create({
    data: {
      name: folderName,
      user_id: userId,
    },
  });
  return folder;
};
exports.findFilesByUserId = async (userId) => {
  const files = await prisma.users.findFirst({
    where: {
      id: userId,
    },
    include: {
      folder: true,
      file: true,
    },
  });
  const newFiles = [...files["folder"], ...files["file"]];

  return newFiles;
};
exports.createFile = async (userId, fileName, originalName, fileSize) => {
  await prisma.files.create({
    data: {
      user_id: userId,
      name: originalName,
      file_name: fileName,
      file_size: fileSize,
      shareable: false,
    },
  });
};
