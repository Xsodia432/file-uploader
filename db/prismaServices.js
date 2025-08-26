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
    select: {
      id: true,
      user_name: true,
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
  const folder = await prisma.files.create({
    data: {
      name: folderName,
      user_id: userId,
      type: "folder",
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
      file: {
        where: {
          folder_id: null,
        },
        orderBy: {
          type: "desc",
        },
      },
    },
  });

  return files["file"];
};
exports.createFile = async (
  userId,
  fileName,
  originalName,
  fileSize,
  folderId
) => {
  console.log(userId, fileName, originalName, fileSize, folderId);
  await prisma.files.create({
    data: {
      user_id: userId,
      name: originalName,
      file_name: fileName,
      file_size: fileSize,
      folder_id: folderId,
      type: "file",
    },
  });
};
exports.findFilesByFolderId = async (folderId) => {
  const files = await prisma.files.findMany({
    where: {
      folder_id: folderId,
    },
  });
  return files;
};
exports.findFolderById = async (folderId) => {
  const folder = await prisma.folders.findFirst({
    where: {
      id: folderId,
    },
  });
  return folder;
};
exports.findFileById = async (fileId) => {
  const file = await prisma.files.findFirst({
    where: {
      id: fileId,
    },
    include: {
      user: {
        select: {
          user_name: true,
          id: true,
        },
      },
    },
  });
  return file;
};

exports.updateFile = async (fileName, fileId) => {
  await prisma.files.update({
    where: {
      id: fileId,
    },
    data: {
      name: fileName,
    },
  });

  return;
};
exports.deleteFile = async (id) => {
  await prisma.files.delete({
    where: {
      id: id,
    },
  });

  return;
};
exports.fileShare = async (file_id, user_id, duration) => {
  await prisma.fileShare.create({
    data: {
      file_id: file_id,
      user_id: user_id,
      expires_at: duration,
    },
  });
};
exports.getShareFiles = async (userId) => {
  return prisma.fileShare.findMany({
    where: {
      user_id: userId,
      expires_at: {
        gt: new Date(),
      },
    },
    include: {
      file: {
        include: {
          user: {
            select: {
              user_name: true,
            },
          },
        },
      },
    },
  });
};
exports.findSharedUserByUserName = async (userName, fileId) => {
  return await prisma.fileShare.count({
    where: {
      user: {
        user_name: userName,
      },
      file_id: fileId,
    },
  });
};
