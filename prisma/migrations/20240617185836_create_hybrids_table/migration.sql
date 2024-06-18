-- CreateTable
CREATE TABLE "db_hybrids" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "lifes" INTEGER NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "update_by" TEXT,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "db_hybrids_pkey" PRIMARY KEY ("id")
);
