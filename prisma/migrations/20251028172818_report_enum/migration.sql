-- AlterEnum
ALTER TYPE "public"."ReportResolutionState" ADD VALUE 'resolvedByStaff';

-- AlterTable
ALTER TABLE "public"."Report" ADD COLUMN     "state" "public"."ReportResolutionState" NOT NULL DEFAULT 'inQueue',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
