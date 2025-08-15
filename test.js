const { PrismaClient } = require("./generated/prisma");
const { withAccelerate } = require("@prisma/extension-accelerate");

const prisma = new PrismaClient().$extends(withAccelerate());

async function main() {
  //   await prisma.files.deleteMany();
  //   await prisma.folders.deleteMany();
  //   await prisma.users.deleteMany();
  //   await prisma.users.create({
  //     data: {
  //       user_name: "bordak",
  //       first_name: "kek",
  //       last_name: "Pahinado",
  //       password: "090921",
  //       file: {
  //         create: {
  //           file_name: "KEK",
  //           file_size: 50,
  //           shareable: false,
  //         },
  //       },
  //     },
  //   });
  await prisma.folders.create({
    data: {
      folder_name: "KEK",
      user_id: "f64aeac1-d479-4b12-ae51-928356a0fded",
    },
  });
  const user = await prisma.users.findMany({
    include: {
      file: true,
      folder: true,
    },
  });
  console.log(user[0]);
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
