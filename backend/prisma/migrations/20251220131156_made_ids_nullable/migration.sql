-- DropForeignKey
ALTER TABLE "public"."Municipality" DROP CONSTRAINT "Municipality_constituencyId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Municipality" DROP CONSTRAINT "Municipality_districtId_fkey";

-- AlterTable
ALTER TABLE "public"."Municipality" ALTER COLUMN "districtId" DROP NOT NULL,
ALTER COLUMN "constituencyId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."Municipality" ADD CONSTRAINT "Municipality_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "public"."District"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Municipality" ADD CONSTRAINT "Municipality_constituencyId_fkey" FOREIGN KEY ("constituencyId") REFERENCES "public"."Constituency"("id") ON DELETE SET NULL ON UPDATE CASCADE;
