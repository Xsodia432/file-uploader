/*
  Warnings:

  - You are about to drop the column `file_name` on the `Files` table. All the data in the column will be lost.
  - You are about to drop the column `folder_name` on the `Folders` table. All the data in the column will be lost.
  - Added the required column `name` to the `Files` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Folders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Files" DROP COLUMN "file_name",
ADD COLUMN     "name" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Folders" DROP COLUMN "folder_name",
ADD COLUMN     "name" TEXT NOT NULL;
