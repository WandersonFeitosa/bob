-- CreateTable
CREATE TABLE "db_user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "password" TEXT,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "update_by" TEXT,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "db_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "db_discord_user" (
    "id" TEXT NOT NULL,
    "discord_id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "update_by" TEXT,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "db_discord_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "db_discord_multipliers" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "update_by" TEXT,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "db_discord_multipliers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "db_progess" (
    "id" TEXT NOT NULL,
    "progess" INTEGER NOT NULL,
    "create_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(3) NOT NULL,
    "update_by" TEXT,
    "delete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "db_progess_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "db_user_email_key" ON "db_user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "db_discord_user_discord_id_key" ON "db_discord_user"("discord_id");

-- CreateIndex
CREATE UNIQUE INDEX "db_discord_user_username_key" ON "db_discord_user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "db_discord_user_email_key" ON "db_discord_user"("email");

-- AddForeignKey
ALTER TABLE "db_discord_user" ADD CONSTRAINT "db_discord_user_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "db_user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
