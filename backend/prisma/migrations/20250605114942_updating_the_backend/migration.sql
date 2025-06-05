/*
  Warnings:

  - You are about to drop the column `playlistId` on the `ProblemInPlaylist` table. All the data in the column will be lost.
  - You are about to drop the column `expectedOutput` on the `TestCaseResult` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[playListId,problemId]` on the table `ProblemInPlaylist` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `playListId` to the `ProblemInPlaylist` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expected` to the `TestCaseResult` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProblemInPlaylist" DROP CONSTRAINT "ProblemInPlaylist_playlistId_fkey";

-- DropIndex
DROP INDEX "ProblemInPlaylist_playlistId_problemId_key";

-- AlterTable
ALTER TABLE "Problem" ALTER COLUMN "difficulty" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ProblemInPlaylist" DROP COLUMN "playlistId",
ADD COLUMN     "playListId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "TestCaseResult" DROP COLUMN "expectedOutput",
ADD COLUMN     "expected" TEXT NOT NULL,
ALTER COLUMN "passed" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "name" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ProblemInPlaylist_playListId_problemId_key" ON "ProblemInPlaylist"("playListId", "problemId");

-- AddForeignKey
ALTER TABLE "ProblemInPlaylist" ADD CONSTRAINT "ProblemInPlaylist_playListId_fkey" FOREIGN KEY ("playListId") REFERENCES "Playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
