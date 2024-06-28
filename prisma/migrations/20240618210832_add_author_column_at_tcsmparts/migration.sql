/*
  Warnings:

  - Added the required column `author` to the `db_tcsmp_arts` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "db_tcsmp_arts" ADD COLUMN     "author" TEXT NOT NULL;
