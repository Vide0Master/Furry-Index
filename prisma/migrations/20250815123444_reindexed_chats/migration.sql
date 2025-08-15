/*
  Warnings:

  - A unique constraint covering the columns `[userID]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[postID]` on the table `Chat` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Chat_userID_key" ON "Chat"("userID");

-- CreateIndex
CREATE UNIQUE INDEX "Chat_postID_key" ON "Chat"("postID");

-- CreateIndex
CREATE INDEX "Chat_userID_postID_idx" ON "Chat"("userID", "postID");

-- CreateIndex
CREATE INDEX "Chat_id_idx" ON "Chat"("id");
