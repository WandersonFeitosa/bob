/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `db_hybrids` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "db_hybrids_name_key" ON "db_hybrids"("name");
