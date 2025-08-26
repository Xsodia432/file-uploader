/*
  Warnings:

  - You are about to drop the column `shareable` on the `Files` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Files" DROP COLUMN "shareable",
ADD COLUMN     "url" TEXT;

-- CreateTable
CREATE TABLE "public"."FileShare" (
    "id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "FileShare_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."FileShare" ADD CONSTRAINT "FileShare_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "public"."Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."FileShare" ADD CONSTRAINT "FileShare_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
