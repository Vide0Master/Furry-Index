/*
  Warnings:

  - The `deleted` column on the `ChatMessage` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."MsgDeletedBy" AS ENUM ('user', 'postOwner', 'admin');

-- AlterTable
ALTER TABLE "public"."ChatMessage" DROP COLUMN "deleted",
ADD COLUMN     "deleted" "public"."MsgDeletedBy";
