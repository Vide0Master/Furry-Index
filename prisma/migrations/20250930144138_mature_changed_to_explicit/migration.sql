/*
  Warnings:

  - The values [mature] on the enum `PostRating` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."PostRating_new" AS ENUM ('safe', 'questionable', 'explicit', 'mature');
ALTER TABLE "public"."Post" 
ALTER COLUMN "rating" TYPE "public"."PostRating_new" 
USING ("rating"::text::"public"."PostRating_new");
UPDATE "public"."Post"
SET "rating" = 'explicit'
WHERE "rating" = 'mature';
CREATE TYPE "public"."PostRating_final" AS ENUM ('safe', 'questionable', 'explicit');
ALTER TABLE "public"."Post" 
ALTER COLUMN "rating" TYPE "public"."PostRating_final" 
USING ("rating"::text::"public"."PostRating_final");
ALTER TYPE "public"."PostRating" RENAME TO "PostRating_old";
ALTER TYPE "public"."PostRating_final" RENAME TO "PostRating";
DROP TYPE "public"."PostRating_new";
DROP TYPE "public"."PostRating_old";
COMMIT;
