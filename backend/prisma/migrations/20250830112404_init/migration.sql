-- CreateEnum
CREATE TYPE "public"."Role" AS ENUM ('ADMIN', 'USER');

-- CreateTable
CREATE TABLE "public"."User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "role" "public"."Role" NOT NULL DEFAULT 'USER',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."UploadedFile" (
    "id" SERIAL NOT NULL,
    "filename" TEXT NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UploadedFile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Voter" (
    "id" SERIAL NOT NULL,
    "epicNo" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "relationType" TEXT,
    "relationName" TEXT,
    "age" INTEGER,
    "gender" TEXT,
    "sourceFileId" INTEGER NOT NULL,
    "country" TEXT,
    "district" TEXT,
    "gpuName" TEXT,
    "gpuNo" TEXT,
    "state" TEXT,
    "tcName" TEXT,
    "tcNo" TEXT,
    "wardName" TEXT,
    "wardNo" TEXT,

    CONSTRAINT "Voter_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- AddForeignKey
ALTER TABLE "public"."Voter" ADD CONSTRAINT "Voter_sourceFileId_fkey" FOREIGN KEY ("sourceFileId") REFERENCES "public"."UploadedFile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
