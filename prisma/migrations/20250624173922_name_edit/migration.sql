/*
  Warnings:

  - You are about to drop the column `groupid` on the `Tag` table. All the data in the column will be lost.
  - The primary key for the `TagGroup` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `TagGroup` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[basename]` on the table `TagGroup` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `basename` to the `TagGroup` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Tag" DROP CONSTRAINT "Tag_groupid_fkey";

-- AlterTable
ALTER TABLE "Tag" DROP COLUMN "groupid",
ADD COLUMN     "groupname" TEXT;

-- AlterTable
ALTER TABLE "TagGroup" DROP CONSTRAINT "TagGroup_pkey",
DROP COLUMN "id",
ADD COLUMN     "basename" TEXT NOT NULL,
ADD CONSTRAINT "TagGroup_pkey" PRIMARY KEY ("basename");

-- CreateIndex
CREATE UNIQUE INDEX "TagGroup_basename_key" ON "TagGroup"("basename");

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_groupname_fkey" FOREIGN KEY ("groupname") REFERENCES "TagGroup"("basename") ON DELETE SET NULL ON UPDATE CASCADE;
