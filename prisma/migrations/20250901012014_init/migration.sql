/*
  Warnings:

  - You are about to drop the column `user_id` on the `FileShare` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."FileShare" DROP CONSTRAINT "FileShare_user_id_fkey";

-- AlterTable
ALTER TABLE "public"."FileShare" DROP COLUMN "user_id";
