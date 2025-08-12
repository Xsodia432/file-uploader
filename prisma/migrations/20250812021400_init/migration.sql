-- DropForeignKey
ALTER TABLE "public"."User_file_shares" DROP CONSTRAINT "User_file_shares_file_id_fkey";

-- AddForeignKey
ALTER TABLE "public"."User_file_shares" ADD CONSTRAINT "User_file_shares_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "public"."Files"("id") ON DELETE CASCADE ON UPDATE CASCADE;
