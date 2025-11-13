/*
  Warnings:

  - Added the required column `constituencyId` to the `Municipality` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Municipality" ADD COLUMN     "constituencyId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Municipality" ADD CONSTRAINT "Municipality_constituencyId_fkey" FOREIGN KEY ("constituencyId") REFERENCES "public"."Constituency"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
