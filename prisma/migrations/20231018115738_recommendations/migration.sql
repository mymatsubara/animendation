-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "picture" TEXT
);

-- CreateTable
CREATE TABLE "Recommendation" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "animeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    CONSTRAINT "Recommendation_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Recommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Recommendation_animeId_userId_key" ON "Recommendation"("animeId", "userId");
