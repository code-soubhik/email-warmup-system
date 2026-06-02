/*
  Warnings:

  - You are about to drop the column `appPassword` on the `EmailConfig` table. All the data in the column will be lost.
  - You are about to drop the column `intervalInMin` on the `WarmupConfig` table. All the data in the column will be lost.
  - You are about to drop the column `recipientEmailIds` on the `WarmupConfig` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId,email]` on the table `EmailConfig` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `accessToken` to the `EmailConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `expiryDate` to the `EmailConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `refreshToken` to the `EmailConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `maxDelaySec` to the `WarmupConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `minDelaySec` to the `WarmupConfig` table without a default value. This is not possible if the table is not empty.
  - Added the required column `replyProbability` to the `WarmupConfig` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EMAIL_PROVIDER" AS ENUM ('GMAIL');

-- DropIndex
DROP INDEX "EmailConfig_email_key";

-- AlterTable
ALTER TABLE "EmailConfig" DROP COLUMN "appPassword",
ADD COLUMN     "accessToken" TEXT NOT NULL,
ADD COLUMN     "expiryDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "provider" "EMAIL_PROVIDER" NOT NULL DEFAULT 'GMAIL',
ADD COLUMN     "refreshToken" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "WarmupConfig" DROP COLUMN "intervalInMin",
DROP COLUMN "recipientEmailIds",
ADD COLUMN     "maxDelaySec" INTEGER NOT NULL,
ADD COLUMN     "minDelaySec" INTEGER NOT NULL,
ADD COLUMN     "replyProbability" DOUBLE PRECISION NOT NULL,
ALTER COLUMN "startTime" DROP DEFAULT;

-- CreateTable
CREATE TABLE "WarmupRecipient" (
    "id" SERIAL NOT NULL,
    "warmupConfigId" INTEGER NOT NULL,
    "emailConfigId" INTEGER NOT NULL,

    CONSTRAINT "WarmupRecipient_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WarmupRecipient_warmupConfigId_idx" ON "WarmupRecipient"("warmupConfigId");

-- CreateIndex
CREATE INDEX "WarmupRecipient_emailConfigId_idx" ON "WarmupRecipient"("emailConfigId");

-- CreateIndex
CREATE INDEX "EmailConfig_email_idx" ON "EmailConfig"("email");

-- CreateIndex
CREATE UNIQUE INDEX "EmailConfig_userId_email_key" ON "EmailConfig"("userId", "email");

-- AddForeignKey
ALTER TABLE "WarmupRecipient" ADD CONSTRAINT "WarmupRecipient_warmupConfigId_fkey" FOREIGN KEY ("warmupConfigId") REFERENCES "WarmupConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarmupRecipient" ADD CONSTRAINT "WarmupRecipient_emailConfigId_fkey" FOREIGN KEY ("emailConfigId") REFERENCES "EmailConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;
