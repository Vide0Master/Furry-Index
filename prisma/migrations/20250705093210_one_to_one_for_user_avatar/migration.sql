/*
  Warnings:

  - A unique constraint covering the columns `[avatarID]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_avatarID_key" ON "User"("avatarID");
