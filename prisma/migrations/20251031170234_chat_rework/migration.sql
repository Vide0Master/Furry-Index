/*
  Warnings:

  - You are about to drop the column `linkType` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `postID` on the `Chat` table. All the data in the column will be lost.
  - You are about to drop the column `userID` on the `Chat` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Chat" DROP CONSTRAINT "Chat_postID_fkey";

-- DropForeignKey
ALTER TABLE "public"."Chat" DROP CONSTRAINT "Chat_userID_fkey";

-- DropIndex
DROP INDEX "public"."Chat_postID_key";

-- DropIndex
DROP INDEX "public"."Chat_userID_key";

-- DropIndex
DROP INDEX "public"."Chat_userID_postID_id_idx";

-- AlterTable
ALTER TABLE "public"."Chat" DROP COLUMN "linkType",
DROP COLUMN "postID",
DROP COLUMN "userID",
ADD COLUMN     "available" JSONB;

-- DropEnum
DROP TYPE "public"."ChatLink";

-- CreateIndex
CREATE INDEX "Chat_id_idx" ON "public"."Chat"("id");
