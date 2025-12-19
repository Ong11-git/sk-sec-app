/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `District` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[municipalityNo]` on the table `Municipality` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `municipalityNo` to the `Municipality` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."VoterStatus" AS ENUM ('active', 'inactive', 'deleted');

-- AlterTable
ALTER TABLE "public"."District" ADD COLUMN     "code" TEXT;

-- AlterTable
ALTER TABLE "public"."Municipality" ADD COLUMN     "municipalityNo" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Voter" ADD COLUMN     "casteCategory" TEXT,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "photo" TEXT,
ADD COLUMN     "status" "public"."VoterStatus" NOT NULL DEFAULT 'active',
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- CreateIndex
CREATE UNIQUE INDEX "District_code_key" ON "public"."District"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Municipality_municipalityNo_key" ON "public"."Municipality"("municipalityNo");
