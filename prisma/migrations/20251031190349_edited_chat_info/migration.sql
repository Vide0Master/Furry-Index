/*
  Warnings:

  - You are about to drop the column `available` on the `Chat` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Chat" DROP COLUMN "available",
ADD COLUMN     "settings" JSONB;
