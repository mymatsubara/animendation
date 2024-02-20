-- CreateTable
CREATE TABLE "Anime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "pictureMedium" TEXT,
    "pictureLarge" TEXT,
    "startDate" TEXT,
    "endDate" TEXT,
    "nsfw" TEXT,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "largePictureUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mediaType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "episodes" INTEGER NOT NULL,
    "season" TEXT,
    "seasonYear" INTEGER,
    "source" TEXT,
    "genres" TEXT NOT NULL,
    "isSequel" BOOLEAN
);

-- CreateTable
CREATE TABLE "Manga" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "pictureMedium" TEXT,
    "pictureLarge" TEXT,
    "startDate" TEXT,
    "endDate" TEXT,
    "nsfw" TEXT,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "largePictureUpdatedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mediaType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "volumes" INTEGER,
    "chapters" INTEGER,
    "source" TEXT,
    "genres" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "picture" TEXT,
    "followersCount" INTEGER NOT NULL DEFAULT 0,
    "followingCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "AnimeRecommendation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "animeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AnimeRecommendation_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "AnimeRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MangaRecommendation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "mangaId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "animeId" INTEGER,
    CONSTRAINT "MangaRecommendation_mangaId_fkey" FOREIGN KEY ("mangaId") REFERENCES "Manga" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "MangaRecommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Follower" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "followedUserId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Follower_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Follower_followedUserId_fkey" FOREIGN KEY ("followedUserId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE INDEX "Anime_createdAt_idx" ON "Anime"("createdAt");

-- CreateIndex
CREATE INDEX "Anime_largePictureUpdatedAt_idx" ON "Anime"("largePictureUpdatedAt");

-- CreateIndex
CREATE INDEX "Manga_createdAt_idx" ON "Manga"("createdAt");

-- CreateIndex
CREATE INDEX "Manga_largePictureUpdatedAt_idx" ON "Manga"("largePictureUpdatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE INDEX "AnimeRecommendation_animeId_idx" ON "AnimeRecommendation"("animeId");

-- CreateIndex
CREATE INDEX "AnimeRecommendation_userId_idx" ON "AnimeRecommendation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "AnimeRecommendation_animeId_userId_key" ON "AnimeRecommendation"("animeId", "userId");

-- CreateIndex
CREATE INDEX "MangaRecommendation_mangaId_idx" ON "MangaRecommendation"("mangaId");

-- CreateIndex
CREATE INDEX "MangaRecommendation_userId_idx" ON "MangaRecommendation"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "MangaRecommendation_mangaId_userId_key" ON "MangaRecommendation"("mangaId", "userId");

-- CreateIndex
CREATE INDEX "Follower_userId_idx" ON "Follower"("userId");

-- CreateIndex
CREATE INDEX "Follower_followedUserId_idx" ON "Follower"("followedUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Follower_userId_followedUserId_key" ON "Follower"("userId", "followedUserId");
