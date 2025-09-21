/*
  Warnings:

  - You are about to drop the column `hiddable` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `roleColor` on the `Role` table. All the data in the column will be lost.
  - You are about to drop the column `roleIcon` on the `Role` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Role" DROP COLUMN "hiddable",
DROP COLUMN "roleColor",
DROP COLUMN "roleIcon";
