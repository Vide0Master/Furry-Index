/*
  Warnings:

  - A unique constraint covering the columns `[userid,postID]` on the table `Score` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Score_userid_postID_key" ON "Score"("userid", "postID");
