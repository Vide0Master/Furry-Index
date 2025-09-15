/*
  Warnings:

  - Made the column `permissions` on table `Role` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Role" ALTER COLUMN "hiddable" SET DEFAULT false,
ALTER COLUMN "permissions" SET NOT NULL;
