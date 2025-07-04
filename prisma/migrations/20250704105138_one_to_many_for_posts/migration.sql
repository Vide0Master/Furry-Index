/*
  Warnings:

  - You are about to drop the `_Post-Files` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_Post-Files" DROP CONSTRAINT "_Post-Files_A_fkey";

-- DropForeignKey
ALTER TABLE "_Post-Files" DROP CONSTRAINT "_Post-Files_B_fkey";

-- AlterTable
ALTER TABLE "File" ADD COLUMN     "postid" TEXT;

-- DropTable
DROP TABLE "_Post-Files";

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_postid_fkey" FOREIGN KEY ("postid") REFERENCES "Post"("id") ON DELETE SET NULL ON UPDATE CASCADE;
