-- DropForeignKey
ALTER TABLE "public"."Files" DROP CONSTRAINT "Files_folder_id_fkey";

-- AlterTable
ALTER TABLE "public"."Files" ALTER COLUMN "folder_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Files" ADD CONSTRAINT "Files_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "public"."Folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
