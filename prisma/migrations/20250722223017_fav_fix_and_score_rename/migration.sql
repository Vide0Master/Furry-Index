/*
  Warnings:

  - You are about to drop the column `postID` on the `Score` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userid,postid]` on the table `Favourite` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userid,postid]` on the table `Score` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `postid` to the `Score` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Score" DROP CONSTRAINT "Score_postID_fkey";

-- DropIndex
DROP INDEX "Score_userid_postID_idx";

-- DropIndex
DROP INDEX "Score_userid_postID_key";

-- AlterTable
ALTER TABLE "Score" DROP COLUMN "postID",
ADD COLUMN     "postid" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Favourite_userid_postid_idx" ON "Favourite"("userid", "postid");

-- CreateIndex
CREATE UNIQUE INDEX "Favourite_userid_postid_key" ON "Favourite"("userid", "postid");

-- CreateIndex
CREATE INDEX "Score_userid_postid_idx" ON "Score"("userid", "postid");

-- CreateIndex
CREATE UNIQUE INDEX "Score_userid_postid_key" ON "Score"("userid", "postid");

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_postid_fkey" FOREIGN KEY ("postid") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
