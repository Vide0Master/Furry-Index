/*
  Warnings:

  - The primary key for the `File` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `fileid` on the `File` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `File` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `File` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "_File-Tags" DROP CONSTRAINT "_File-Tags_A_fkey";

-- DropIndex
DROP INDEX "File_fileid_idx";

-- DropIndex
DROP INDEX "File_fileid_key";

-- AlterTable
ALTER TABLE "File" DROP CONSTRAINT "File_pkey",
DROP COLUMN "fileid",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "File_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "File_id_key" ON "File"("id");

-- CreateIndex
CREATE INDEX "File_id_idx" ON "File"("id");

-- AddForeignKey
ALTER TABLE "_File-Tags" ADD CONSTRAINT "_File-Tags_A_fkey" FOREIGN KEY ("A") REFERENCES "File"("id") ON DELETE CASCADE ON UPDATE CASCADE;
