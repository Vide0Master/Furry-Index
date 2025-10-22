-- AlterEnum
ALTER TYPE "public"."PostType" ADD VALUE 'videoGroup';

-- AlterTable
ALTER TABLE "public"."File" ADD COLUMN     "postOrder" INTEGER NOT NULL DEFAULT 0;
