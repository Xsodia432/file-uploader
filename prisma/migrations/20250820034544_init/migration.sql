/*
  Warnings:

  - You are about to drop the column `original_name` on the `Files` table. All the data in the column will be lost.
  - Added the required column `name` to the `Files` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Files" DROP COLUMN "original_name",
ADD COLUMN     "name" TEXT NOT NULL;
