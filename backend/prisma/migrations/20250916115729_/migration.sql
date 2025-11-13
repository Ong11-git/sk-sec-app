/*
  Warnings:

  - You are about to drop the `_DistrictConstituency` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `districtId` to the `Constituency` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Voter" DROP CONSTRAINT "Voter_constituencyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Voter" DROP CONSTRAINT "Voter_gpuId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Voter" DROP CONSTRAINT "Voter_tcId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Voter" DROP CONSTRAINT "Voter_wardId_fkey";

-- DropForeignKey
ALTER TABLE "public"."_DistrictConstituency" DROP CONSTRAINT "_DistrictConstituency_A_fkey";

-- DropForeignKey
ALTER TABLE "public"."_DistrictConstituency" DROP CONSTRAINT "_DistrictConstituency_B_fkey";

-- AlterTable
ALTER TABLE "public"."Constituency" ADD COLUMN     "districtId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Voter" ADD COLUMN     "municipalWardId" INTEGER,
ADD COLUMN     "municipalityId" INTEGER,
ALTER COLUMN "constituencyId" DROP NOT NULL,
ALTER COLUMN "gpuId" DROP NOT NULL,
ALTER COLUMN "tcId" DROP NOT NULL,
ALTER COLUMN "wardId" DROP NOT NULL;

-- DropTable
DROP TABLE "public"."_DistrictConstituency";

-- CreateTable
CREATE TABLE "public"."Municipality" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "districtId" INTEGER NOT NULL,

    CONSTRAINT "Municipality_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."MunicipalWard" (
    "id" SERIAL NOT NULL,
    "ward_no" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "municipalityId" INTEGER NOT NULL,

    CONSTRAINT "MunicipalWard_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "MunicipalWard_ward_no_key" ON "public"."MunicipalWard"("ward_no");

-- AddForeignKey
ALTER TABLE "public"."Voter" ADD CONSTRAINT "Voter_constituencyId_fkey" FOREIGN KEY ("constituencyId") REFERENCES "public"."Constituency"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Voter" ADD CONSTRAINT "Voter_tcId_fkey" FOREIGN KEY ("tcId") REFERENCES "public"."Tc"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Voter" ADD CONSTRAINT "Voter_gpuId_fkey" FOREIGN KEY ("gpuId") REFERENCES "public"."Gpu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Voter" ADD CONSTRAINT "Voter_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "public"."Ward"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Voter" ADD CONSTRAINT "Voter_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "public"."Municipality"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Voter" ADD CONSTRAINT "Voter_municipalWardId_fkey" FOREIGN KEY ("municipalWardId") REFERENCES "public"."MunicipalWard"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Constituency" ADD CONSTRAINT "Constituency_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Municipality" ADD CONSTRAINT "Municipality_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."MunicipalWard" ADD CONSTRAINT "MunicipalWard_municipalityId_fkey" FOREIGN KEY ("municipalityId") REFERENCES "public"."Municipality"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
