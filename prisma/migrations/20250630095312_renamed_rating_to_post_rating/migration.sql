/*
  Warnings:

  - Changed the type of `rating` on the `Post` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "PostRating" AS ENUM ('safe', 'questionable', 'mature');

-- AlterTable
ALTER TABLE "Post" DROP COLUMN "rating",
ADD COLUMN     "rating" "PostRating" NOT NULL;

-- DropEnum
DROP TYPE "Rating";
