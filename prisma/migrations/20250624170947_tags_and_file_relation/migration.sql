-- AlterTable
ALTER TABLE "File" ADD CONSTRAINT "File_pkey" PRIMARY KEY ("fileid");

-- AlterTable
ALTER TABLE "Session" ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("token");

-- AlterTable
ALTER TABLE "User" ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "Tag" (
    "name" TEXT NOT NULL,
    "description" JSONB,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("name")
);

-- CreateTable
CREATE TABLE "_File-Tags" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_File-Tags_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "Tag_name_idx" ON "Tag"("name");

-- CreateIndex
CREATE INDEX "_File-Tags_B_index" ON "_File-Tags"("B");

-- AddForeignKey
ALTER TABLE "_File-Tags" ADD CONSTRAINT "_File-Tags_A_fkey" FOREIGN KEY ("A") REFERENCES "File"("fileid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_File-Tags" ADD CONSTRAINT "_File-Tags_B_fkey" FOREIGN KEY ("B") REFERENCES "Tag"("name") ON DELETE CASCADE ON UPDATE CASCADE;
