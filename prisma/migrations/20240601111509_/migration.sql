-- CreateTable
CREATE TABLE "db_minecraft_server_status" (
    "id" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "port" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "update_by" TEXT,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "db_minecraft_server_status_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "db_tcsmp_arts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "uploadedBy" TEXT NOT NULL,
    "messageId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "update_by" TEXT,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "db_tcsmp_arts_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "db_tcsmp_arts_messageId_key" ON "db_tcsmp_arts"("messageId");
