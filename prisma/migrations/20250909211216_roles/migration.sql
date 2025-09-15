-- CreateEnum
CREATE TYPE "RoleType" AS ENUM ('superAdmin', 'admin', 'moderator', 'artist', 'supporter', 'verifiedUser', 'verifiedPaymentEntity');

-- CreateTable
CREATE TABLE "Role" (
    "id" TEXT NOT NULL,
    "type" "RoleType" NOT NULL,
    "userid" TEXT NOT NULL,
    "roleIcon" TEXT,
    "roleColor" TEXT,
    "hiddable" BOOLEAN NOT NULL DEFAULT true,
    "hidden" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Role_id_key" ON "Role"("id");

-- AddForeignKey
ALTER TABLE "Role" ADD CONSTRAINT "Role_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
