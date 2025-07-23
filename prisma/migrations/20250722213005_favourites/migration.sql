-- CreateTable
CREATE TABLE "Favourite" (
    "id" TEXT NOT NULL,
    "userid" TEXT NOT NULL,
    "postid" TEXT NOT NULL,

    CONSTRAINT "Favourite_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Favourite_id_key" ON "Favourite"("id");

-- AddForeignKey
ALTER TABLE "Favourite" ADD CONSTRAINT "Favourite_userid_fkey" FOREIGN KEY ("userid") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Favourite" ADD CONSTRAINT "Favourite_postid_fkey" FOREIGN KEY ("postid") REFERENCES "Post"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
