/*
  Warnings:

  - You are about to drop the column `district` on the `Voter` table. All the data in the column will be lost.
  - You are about to drop the `UploadedFile` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `constituencyId` to the `Voter` table without a default value. This is not possible if the table is not empty.
  - Added the required column `districtId` to the `Voter` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Voter" DROP CONSTRAINT "Voter_sourceFileId_fkey";

-- AlterTable
ALTER TABLE "public"."Voter" DROP COLUMN "district",
ADD COLUMN     "constituencyId" INTEGER NOT NULL,
ADD COLUMN     "districtId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "public"."UploadedFile";

-- CreateTable
CREATE TABLE "public"."District" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Constituency" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Constituency_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Voter" ADD CONSTRAINT "Voter_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Voter" ADD CONSTRAINT "Voter_constituencyId_fkey" FOREIGN KEY ("constituencyId") REFERENCES "public"."Constituency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
