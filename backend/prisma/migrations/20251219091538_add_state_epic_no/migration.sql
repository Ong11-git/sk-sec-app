/*
  Warnings:

  - A unique constraint covering the columns `[stateEpicNo]` on the table `Voter` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "public"."Voter" ADD COLUMN     "stateEpicNo" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Voter_stateEpicNo_key" ON "public"."Voter"("stateEpicNo");
