/*
  Warnings:

  - You are about to drop the `Folders` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Files" DROP CONSTRAINT "Files_folder_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Folders" DROP CONSTRAINT "Folders_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."Files" ALTER COLUMN "file_size" DROP NOT NULL,
ALTER COLUMN "type" DROP DEFAULT,
ALTER COLUMN "file_name" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."Folders";
