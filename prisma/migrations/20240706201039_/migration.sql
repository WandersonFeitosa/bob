/*
  Warnings:

  - A unique constraint covering the columns `[discord_id]` on the table `db_hybrids` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "db_hybrids" ADD COLUMN     "animal" TEXT,
ADD COLUMN     "discord_id" TEXT,
ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "lifes" SET DEFAULT 4;

-- CreateIndex
CREATE UNIQUE INDEX "db_hybrids_discord_id_key" ON "db_hybrids"("discord_id");
