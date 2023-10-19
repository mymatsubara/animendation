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
    "genres" TEXT NOT NULL,
    "isFranchise" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_Anime" ("createdAt", "endDate", "episodes", "genres", "id", "mediaType", "nsfw", "pictureLarge", "pictureMedium", "season", "seasonYear", "source", "startDate", "status", "title", "updatedAt") SELECT "createdAt", "endDate", "episodes", "genres", "id", "mediaType", "nsfw", "pictureLarge", "pictureMedium", "season", "seasonYear", "source", "startDate", "status", "title", "updatedAt" FROM "Anime";
DROP TABLE "Anime";
ALTER TABLE "new_Anime" RENAME TO "Anime";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
