/*
  Warnings:

  - You are about to drop the `db_family` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `db_hybrids` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `db_minecraft_server_status` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `db_player` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `db_tcsmp_arts` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "db_family" DROP CONSTRAINT "db_family_hybrid_id_fkey";

-- DropForeignKey
ALTER TABLE "db_player" DROP CONSTRAINT "db_player_familyId_fkey";

-- DropTable
DROP TABLE "db_family";

-- DropTable
DROP TABLE "db_hybrids";

-- DropTable
DROP TABLE "db_minecraft_server_status";

-- DropTable
DROP TABLE "db_player";

-- DropTable
DROP TABLE "db_tcsmp_arts";

-- CreateTable
CREATE TABLE "tb_minecraft_server_status" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3),
    "update_by" TEXT,
    "delete" BOOLEAN NOT NULL DEFAULT false,
    "offlineCount" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "tb_minecraft_server_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_tcsmp_arts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3),
    "update_by" TEXT,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_tcsmp_arts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_hybrids" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "animal" TEXT,
    "discord_id" TEXT,
    "image" TEXT,
    "lifes" INTEGER NOT NULL DEFAULT 4,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3),
    "update_by" TEXT,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tb_hybrids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_players" (
    "id" TEXT NOT NULL,
    "discord_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3),
    "update_by" TEXT,
    "delete" BOOLEAN NOT NULL DEFAULT false,
    "familyId" TEXT,

    CONSTRAINT "tb_players_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tb_families" (
    "id" TEXT NOT NULL,
    "hybrid_id" TEXT NOT NULL,

    CONSTRAINT "tb_families_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "tb_tcsmp_arts_messageId_key" ON "tb_tcsmp_arts"("messageId");

-- CreateIndex
CREATE UNIQUE INDEX "tb_hybrids_name_key" ON "tb_hybrids"("name");

-- CreateIndex
CREATE UNIQUE INDEX "tb_hybrids_discord_id_key" ON "tb_hybrids"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_players_discord_id_key" ON "tb_players"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "tb_families_hybrid_id_key" ON "tb_families"("hybrid_id");

-- AddForeignKey
ALTER TABLE "tb_players" ADD CONSTRAINT "tb_players_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "tb_families"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tb_families" ADD CONSTRAINT "tb_families_hybrid_id_fkey" FOREIGN KEY ("hybrid_id") REFERENCES "tb_hybrids"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
