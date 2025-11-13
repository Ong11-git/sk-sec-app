/*
  Warnings:

  - You are about to drop the column `tcId` on the `Constituency` table. All the data in the column will be lost.
  - You are about to drop the column `constituencyId` on the `District` table. All the data in the column will be lost.
  - You are about to drop the column `wardId` on the `Gpu` table. All the data in the column will be lost.
  - You are about to drop the column `gpuId` on the `Tc` table. All the data in the column will be lost.
  - Added the required column `tcId` to the `Gpu` table without a default value. This is not possible if the table is not empty.
  - Added the required column `constituencyId` to the `Tc` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gpuId` to the `Ward` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Constituency" DROP CONSTRAINT "Constituency_tcId_fkey";

-- DropForeignKey
ALTER TABLE "public"."District" DROP CONSTRAINT "District_constituencyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Gpu" DROP CONSTRAINT "Gpu_wardId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Tc" DROP CONSTRAINT "Tc_gpuId_fkey";

-- AlterTable
ALTER TABLE "public"."Constituency" DROP COLUMN "tcId";

-- AlterTable
ALTER TABLE "public"."District" DROP COLUMN "constituencyId";

-- AlterTable
ALTER TABLE "public"."Gpu" DROP COLUMN "wardId",
ADD COLUMN     "tcId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Tc" DROP COLUMN "gpuId",
ADD COLUMN     "constituencyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Ward" ADD COLUMN     "gpuId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."_DistrictConstituency" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_DistrictConstituency_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_DistrictConstituency_B_index" ON "public"."_DistrictConstituency"("B");

-- AddForeignKey
ALTER TABLE "public"."Tc" ADD CONSTRAINT "Tc_constituencyId_fkey" FOREIGN KEY ("constituencyId") REFERENCES "public"."Constituency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Gpu" ADD CONSTRAINT "Gpu_tcId_fkey" FOREIGN KEY ("tcId") REFERENCES "public"."Tc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Ward" ADD CONSTRAINT "Ward_gpuId_fkey" FOREIGN KEY ("gpuId") REFERENCES "public"."Gpu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DistrictConstituency" ADD CONSTRAINT "_DistrictConstituency_A_fkey" FOREIGN KEY ("A") REFERENCES "public"."Constituency"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."_DistrictConstituency" ADD CONSTRAINT "_DistrictConstituency_B_fkey" FOREIGN KEY ("B") REFERENCES "public"."District"("id") ON DELETE CASCADE ON UPDATE CASCADE;
