/*
  Warnings:

  - You are about to drop the column `gpuName` on the `Voter` table. All the data in the column will be lost.
  - You are about to drop the column `gpuNo` on the `Voter` table. All the data in the column will be lost.
  - You are about to drop the column `tcName` on the `Voter` table. All the data in the column will be lost.
  - You are about to drop the column `tcNo` on the `Voter` table. All the data in the column will be lost.
  - You are about to drop the column `wardName` on the `Voter` table. All the data in the column will be lost.
  - You are about to drop the column `wardNo` on the `Voter` table. All the data in the column will be lost.
  - Added the required column `tcId` to the `Constituency` table without a default value. This is not possible if the table is not empty.
  - Added the required column `constituencyId` to the `District` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gpuId` to the `Voter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tcId` to the `Voter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `wardId` to the `Voter` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Constituency" ADD COLUMN     "tcId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."District" ADD COLUMN     "constituencyId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "public"."Voter" DROP COLUMN "gpuName",
DROP COLUMN "gpuNo",
DROP COLUMN "tcName",
DROP COLUMN "tcNo",
DROP COLUMN "wardName",
DROP COLUMN "wardNo",
ADD COLUMN     "gpuId" INTEGER NOT NULL,
ADD COLUMN     "tcId" INTEGER NOT NULL,
ADD COLUMN     "wardId" INTEGER NOT NULL;

-- CreateTable
CREATE TABLE "public"."Tc" (
    "id" SERIAL NOT NULL,
    "tc_no" INTEGER NOT NULL,
    "tc_name" TEXT NOT NULL,
    "gpuId" INTEGER NOT NULL,

    CONSTRAINT "Tc_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Gpu" (
    "id" SERIAL NOT NULL,
    "gpu_no" INTEGER NOT NULL,
    "gpu_name" TEXT NOT NULL,
    "wardId" INTEGER NOT NULL,

    CONSTRAINT "Gpu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Ward" (
    "id" SERIAL NOT NULL,
    "ward_no" INTEGER NOT NULL,
    "ward_name" TEXT NOT NULL,

    CONSTRAINT "Ward_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Tc_tc_no_key" ON "public"."Tc"("tc_no");

-- CreateIndex
CREATE UNIQUE INDEX "Gpu_gpu_no_key" ON "public"."Gpu"("gpu_no");

-- CreateIndex
CREATE UNIQUE INDEX "Ward_ward_no_key" ON "public"."Ward"("ward_no");

-- AddForeignKey
ALTER TABLE "public"."Voter" ADD CONSTRAINT "Voter_gpuId_fkey" FOREIGN KEY ("gpuId") REFERENCES "public"."Gpu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Voter" ADD CONSTRAINT "Voter_tcId_fkey" FOREIGN KEY ("tcId") REFERENCES "public"."Tc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Voter" ADD CONSTRAINT "Voter_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "public"."Ward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."District" ADD CONSTRAINT "District_constituencyId_fkey" FOREIGN KEY ("constituencyId") REFERENCES "public"."Constituency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Constituency" ADD CONSTRAINT "Constituency_tcId_fkey" FOREIGN KEY ("tcId") REFERENCES "public"."Tc"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Tc" ADD CONSTRAINT "Tc_gpuId_fkey" FOREIGN KEY ("gpuId") REFERENCES "public"."Gpu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Gpu" ADD CONSTRAINT "Gpu_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES "public"."Ward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
