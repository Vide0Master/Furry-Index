-- CreateEnum
CREATE TYPE "public"."ReportResolutionState" AS ENUM ('inQueue', 'onReview', 'resolvedAutomatically', 'resolvedManually');

-- CreateTable
CREATE TABLE "public"."Report" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL DEFAULT 'anon',
    "type" TEXT NOT NULL,
    "description" TEXT,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Report_id_key" ON "public"."Report"("id");
