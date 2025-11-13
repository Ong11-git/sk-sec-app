/*
  Warnings:

  - You are about to drop the column `districtId` on the `Constituency` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."Constituency" DROP CONSTRAINT "Constituency_districtId_fkey";

-- DropIndex
DROP INDEX "public"."Gpu_gpu_no_key";

-- DropIndex
DROP INDEX "public"."MunicipalWard_ward_no_key";

-- DropIndex
DROP INDEX "public"."Tc_tc_no_key";

-- DropIndex
DROP INDEX "public"."Ward_ward_no_key";

-- AlterTable
ALTER TABLE "public"."Constituency" DROP COLUMN "districtId";

-- CreateTable
CREATE TABLE "public"."DistrictConstituency" (
    "districtId" INTEGER NOT NULL,
    "constituencyId" INTEGER NOT NULL,

    CONSTRAINT "DistrictConstituency_pkey" PRIMARY KEY ("districtId","constituencyId")
);

-- AddForeignKey
ALTER TABLE "public"."DistrictConstituency" ADD CONSTRAINT "DistrictConstituency_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DistrictConstituency" ADD CONSTRAINT "DistrictConstituency_constituencyId_fkey" FOREIGN KEY ("constituencyId") REFERENCES "public"."Constituency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
