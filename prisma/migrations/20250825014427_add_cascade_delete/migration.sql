-- DropForeignKey
ALTER TABLE "public"."Files" DROP CONSTRAINT "Files_folder_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Files" DROP CONSTRAINT "Files_user_id_fkey";

-- DropForeignKey
ALTER TABLE "public"."Folders" DROP CONSTRAINT "Folders_user_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."Files" ADD CONSTRAINT "Files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Files" ADD CONSTRAINT "Files_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "public"."Folders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Folders" ADD CONSTRAINT "Folders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
