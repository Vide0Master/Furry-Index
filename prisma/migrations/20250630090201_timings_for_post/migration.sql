-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "createdOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedOn" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
