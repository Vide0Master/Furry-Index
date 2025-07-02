/*
  Warnings:

  - You are about to drop the column `visibleName` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userid_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "visibleName",
ADD COLUMN     "visiblename" TEXT;

-- CreateTable
CREATE TABLE "File" (
    "fileid" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "ownerid" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "File_fileid_key" ON "File"("fileid");

-- CreateIndex
CREATE UNIQUE INDEX "File_file_key" ON "File"("file");

-- CreateIndex
CREATE INDEX "File_fileid_idx" ON "File"("fileid");

-- CreateIndex
CREATE INDEX "Session_token_idx" ON "Session"("token");

-- CreateIndex
CREATE INDEX "User_username_id_idx" ON "User"("username", "id");

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_ownerid_fkey" FOREIGN KEY ("ownerid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
