/*
  Warnings:

  - Added the required column `rating` to the `Post` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Rating" AS ENUM ('safe', 'questionable', 'mature');

-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "rating" "Rating" NOT NULL,
ADD COLUMN     "visible" BOOLEAN NOT NULL DEFAULT false;
