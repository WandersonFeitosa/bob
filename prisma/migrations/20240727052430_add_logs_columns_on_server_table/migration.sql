-- AlterTable
ALTER TABLE "tb_minecraft_server_status" ADD COLUMN     "last_log_message" TEXT,
ADD COLUMN     "last_log_time" TIMESTAMP(3);
