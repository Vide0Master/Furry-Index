-- CreateEnum
CREATE TYPE "ScoreType" AS ENUM ('up', 'down');

-- CreateTable
CREATE TABLE "Score" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "postID" TEXT NOT NULL,
    "type" "ScoreType" NOT NULL,

    CONSTRAINT "Score_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Score_id_key" ON "Score"("id");

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Score" ADD CONSTRAINT "Score_postID_fkey" FOREIGN KEY ("postID") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
