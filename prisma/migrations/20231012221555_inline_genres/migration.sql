/*
  Warnings:

  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `_AnimeToGenre` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `genres` to the `Anime` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_AnimeToGenre_B_index";

-- DropIndex
DROP INDEX "_AnimeToGenre_AB_unique";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Genre";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_AnimeToGenre";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Anime" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "pictureMedium" TEXT,
    "pictureLarge" TEXT,
    "startDate" TEXT,
    "endDate" TEXT,
    "nsfw" TEXT,
    "createdAt" DATETIME NOT NULL,
    "updatedAt" DATETIME NOT NULL,
    "mediaType" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "episodes" INTEGER NOT NULL,
    "season" TEXT,
    "seasonYear" INTEGER,
    "source" TEXT,
    "genres" TEXT NOT NULL
);
INSERT INTO "new_Anime" ("createdAt", "endDate", "episodes", "id", "mediaType", "nsfw", "pictureLarge", "pictureMedium", "season", "seasonYear", "source", "startDate", "status", "title", "updatedAt") SELECT "createdAt", "endDate", "episodes", "id", "mediaType", "nsfw", "pictureLarge", "pictureMedium", "season", "seasonYear", "source", "startDate", "status", "title", "updatedAt" FROM "Anime";
DROP TABLE "Anime";
ALTER TABLE "new_Anime" RENAME TO "Anime";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
