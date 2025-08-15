-- DropIndex
DROP INDEX "Chat_id_idx";

-- DropIndex
DROP INDEX "Chat_userID_postID_idx";

-- CreateIndex
CREATE INDEX "Chat_userID_postID_id_idx" ON "Chat"("userID", "postID", "id");
