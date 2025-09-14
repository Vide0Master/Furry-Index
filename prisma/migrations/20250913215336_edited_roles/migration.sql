/*
  Warnings:

  - You are about to drop the column `roleData` on the `Role` table. All the data in the column will be lost.
  - Changed the type of `type` on the `Role` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Role" DROP COLUMN "roleData",
ADD COLUMN     "permissions" JSONB,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL;

-- DropEnum
DROP TYPE "RoleType";
