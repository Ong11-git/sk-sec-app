/*
  Warnings:

  - A unique constraint covering the columns `[epicNo]` on the table `Voter` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Voter_epicNo_key" ON "public"."Voter"("epicNo");
