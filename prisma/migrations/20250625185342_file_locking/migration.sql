/*
  Warnings:

  - Made the column `locked` on table `TagGroup` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "File" ADD COLUMN     "locked" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "TagGroup" ALTER COLUMN "locked" SET NOT NULL,
ALTER COLUMN "locked" SET DEFAULT false;
