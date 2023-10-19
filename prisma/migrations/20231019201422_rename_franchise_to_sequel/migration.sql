/*
  Warnings:

  - You are about to drop the column `isFranchise` on the `Anime` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
ALTER TABLE "Anime" RENAME COLUMN "isFranchise" TO "isSequel";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
