-- CreateTable
CREATE TABLE "db_player" (
    "id" TEXT NOT NULL,
    "discord_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3),
    "update_by" TEXT,
    "delete" BOOLEAN NOT NULL DEFAULT false,
    "familyId" TEXT,

    CONSTRAINT "db_player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "db_family" (
    "id" TEXT NOT NULL,
    "hybrid_id" TEXT NOT NULL,

    CONSTRAINT "db_family_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "db_player_discord_id_key" ON "db_player"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "db_family_hybrid_id_key" ON "db_family"("hybrid_id");

-- AddForeignKey
ALTER TABLE "db_player" ADD CONSTRAINT "db_player_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "db_family"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "db_family" ADD CONSTRAINT "db_family_hybrid_id_fkey" FOREIGN KEY ("hybrid_id") REFERENCES "db_hybrids"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
