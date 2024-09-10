/*
  Warnings:

  - The primary key for the `playlists` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `link` on the `playlists` table. All the data in the column will be lost.
  - The `id` column on the `playlists` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `playlistId` on the `Video` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Video" DROP CONSTRAINT "Video_playlistId_fkey";

-- AlterTable
ALTER TABLE "Video" DROP COLUMN "playlistId",
ADD COLUMN     "playlistId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "playlists" DROP CONSTRAINT "playlists_pkey",
DROP COLUMN "link",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "playlists_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "Video" ADD CONSTRAINT "Video_playlistId_fkey" FOREIGN KEY ("playlistId") REFERENCES "playlists"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
