/*
  Warnings:

  - The primary key for the `Recommendation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `Recommendation` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Recommendation" (
    "animeId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("animeId", "userId"),
    CONSTRAINT "Recommendation_animeId_fkey" FOREIGN KEY ("animeId") REFERENCES "Anime" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Recommendation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Recommendation" ("animeId", "userId") SELECT "animeId", "userId" FROM "Recommendation";
DROP TABLE "Recommendation";
ALTER TABLE "new_Recommendation" RENAME TO "Recommendation";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
