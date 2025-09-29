-- CreateTable
CREATE TABLE "public"."NewsLetter" (
    "id" TEXT NOT NULL,
    "title" JSONB NOT NULL,
    "description" JSONB NOT NULL,
    "authorid" TEXT NOT NULL,
    "postedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NewsLetter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "NewsLetter_id_key" ON "public"."NewsLetter"("id");

-- AddForeignKey
ALTER TABLE "public"."NewsLetter" ADD CONSTRAINT "NewsLetter_authorid_fkey" FOREIGN KEY ("authorid") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
