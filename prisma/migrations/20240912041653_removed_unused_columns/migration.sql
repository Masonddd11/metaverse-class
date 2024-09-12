/*
  Warnings:

  - You are about to drop the column `totalVideos` on the `UserProgress` table. All the data in the column will be lost.
  - You are about to drop the column `videosWatched` on the `UserProgress` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "UserProgress" DROP COLUMN "totalVideos",
DROP COLUMN "videosWatched";
