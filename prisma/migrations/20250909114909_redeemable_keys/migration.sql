-- CreateTable
CREATE TABLE "ReddemableKey" (
    "key" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB,
    "redeemed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "ReddemableKey_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "ReddemableKey_key_key" ON "ReddemableKey"("key");

-- CreateIndex
CREATE INDEX "ReddemableKey_key_idx" ON "ReddemableKey"("key");
