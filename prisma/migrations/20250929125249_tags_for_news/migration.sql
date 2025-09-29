/*
  Warnings:

  - Added the required column `tags` to the `NewsLetter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."NewsLetter" ADD COLUMN     "tags" JSONB NOT NULL;
