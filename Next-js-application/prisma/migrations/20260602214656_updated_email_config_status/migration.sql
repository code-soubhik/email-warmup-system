/*
  Warnings:

  - You are about to drop the column `isActive` on the `EmailConfig` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "EMAIL_STATUS" AS ENUM ('ACTIVE', 'DISCONNECTED', 'ERROR', 'RECONNECT_REQUIRED');

-- AlterTable
ALTER TABLE "EmailConfig" DROP COLUMN "isActive",
ADD COLUMN     "status" "EMAIL_STATUS" NOT NULL DEFAULT 'ACTIVE',
ALTER COLUMN "accessToken" DROP NOT NULL,
ALTER COLUMN "expiryDate" DROP NOT NULL;
