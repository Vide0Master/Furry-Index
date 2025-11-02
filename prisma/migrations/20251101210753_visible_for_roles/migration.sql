/*
  Warnings:

  - You are about to drop the column `hidden` on the `Role` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Role" DROP COLUMN "hidden",
ADD COLUMN     "visible" BOOLEAN NOT NULL DEFAULT true;
