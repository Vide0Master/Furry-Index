/*
  Warnings:

  - You are about to drop the column `profileparams` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "profileparams",
ADD COLUMN     "globalprofileparams" JSONB,
ADD COLUMN     "privateprofileparams" JSONB;
