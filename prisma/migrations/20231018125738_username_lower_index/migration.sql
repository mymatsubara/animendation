-- DropIndex
DROP INDEX IF EXISTS "User_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "User_name_key" ON "User"("name" COLLATE NOCASE);