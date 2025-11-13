/*
  Warnings:

  - A unique constraint covering the columns `[constituencyNo]` on the table `Constituency` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `constituencyNo` to the `Constituency` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Constituency" ADD COLUMN     "constituencyNo" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Constituency_constituencyNo_key" ON "public"."Constituency"("constituencyNo");
