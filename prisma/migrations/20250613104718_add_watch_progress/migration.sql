-- CreateTable
CREATE TABLE "WatchProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "videoId" TEXT NOT NULL,
    "progress" DOUBLE PRECISION NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WatchProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WatchProgress_userId_idx" ON "WatchProgress"("userId");

-- CreateIndex
CREATE INDEX "WatchProgress_videoId_idx" ON "WatchProgress"("videoId");

-- CreateIndex
CREATE UNIQUE INDEX "WatchProgress_userId_videoId_key" ON "WatchProgress"("userId", "videoId");

-- AddForeignKey
ALTER TABLE "WatchProgress" ADD CONSTRAINT "WatchProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WatchProgress" ADD CONSTRAINT "WatchProgress_videoId_fkey" FOREIGN KEY ("videoId") REFERENCES "Video"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
