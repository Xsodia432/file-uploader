-- CreateTable
CREATE TABLE "public"."Users" (
    "id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT,
    "password" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Files" (
    "id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "shareable" BOOLEAN NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'File',
    "user_id" TEXT NOT NULL,
    "folder_id" TEXT NOT NULL,

    CONSTRAINT "Files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Folders" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL DEFAULT 'Folder',
    "modified_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "folder_name" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "Folders_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_user_name_key" ON "public"."Users"("user_name");

-- AddForeignKey
ALTER TABLE "public"."Files" ADD CONSTRAINT "Files_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Files" ADD CONSTRAINT "Files_folder_id_fkey" FOREIGN KEY ("folder_id") REFERENCES "public"."Folders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Folders" ADD CONSTRAINT "Folders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
