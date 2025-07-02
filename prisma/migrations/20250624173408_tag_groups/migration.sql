-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "groupid" TEXT;

-- CreateTable
CREATE TABLE "TagGroup" (
    "id" TEXT NOT NULL,
    "name" JSONB NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#ffffff',
    "locked" BOOLEAN,

    CONSTRAINT "TagGroup_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Tag" ADD CONSTRAINT "Tag_groupid_fkey" FOREIGN KEY ("groupid") REFERENCES "TagGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;
