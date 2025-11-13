/*
  Warnings:

  - You are about to drop the column `sourceFileId` on the `Voter` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Voter" DROP COLUMN "sourceFileId";
