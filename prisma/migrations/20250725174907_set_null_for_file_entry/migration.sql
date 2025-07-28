-- DropForeignKey
ALTER TABLE "File" DROP CONSTRAINT "File_ownerid_fkey";

-- AddForeignKey
ALTER TABLE "File" ADD CONSTRAINT "File_ownerid_fkey" FOREIGN KEY ("ownerid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
