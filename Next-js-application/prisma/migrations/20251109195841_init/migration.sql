-- CreateEnum
CREATE TYPE "PROVIDER_TYPE" AS ENUM ('GOOGLE', 'BASIC');

-- CreateEnum
CREATE TYPE "STATUS_TYPE" AS ENUM ('PENDING', 'SENT', 'REPLIED', 'FAILED');

-- CreateTable
CREATE TABLE "EmailConfig" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "appPassword" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "id" SERIAL NOT NULL,
    "warmupConfigId" INTEGER NOT NULL,
    "senderEmailId" INTEGER NOT NULL,
    "recipientEmailId" INTEGER NOT NULL,
    "scheduleTime" TIMESTAMP(3) NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" "STATUS_TYPE" NOT NULL DEFAULT 'PENDING',
    "errorMessage" TEXT,

    CONSTRAINT "Log_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT,
    "providerToken" TEXT,
    "provider" "PROVIDER_TYPE" NOT NULL DEFAULT 'BASIC',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WarmupConfig" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "warmupEmailId" INTEGER NOT NULL,
    "totalNoOfEmail" INTEGER NOT NULL,
    "intervalInMin" INTEGER NOT NULL,
    "recipientEmailIds" INTEGER[],
    "startTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WarmupConfig_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "EmailConfig_email_key" ON "EmailConfig"("email");

-- CreateIndex
CREATE INDEX "EmailConfig_userId_idx" ON "EmailConfig"("userId");

-- CreateIndex
CREATE INDEX "Log_warmupConfigId_idx" ON "Log"("warmupConfigId");

-- CreateIndex
CREATE INDEX "Log_senderEmailId_idx" ON "Log"("senderEmailId");

-- CreateIndex
CREATE INDEX "Log_recipientEmailId_idx" ON "Log"("recipientEmailId");

-- CreateIndex
CREATE INDEX "Log_status_idx" ON "Log"("status");

-- CreateIndex
CREATE INDEX "Log_timestamp_idx" ON "Log"("timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "WarmupConfig_warmupEmailId_idx" ON "WarmupConfig"("warmupEmailId");

-- AddForeignKey
ALTER TABLE "EmailConfig" ADD CONSTRAINT "EmailConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_warmupConfigId_fkey" FOREIGN KEY ("warmupConfigId") REFERENCES "WarmupConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_senderEmailId_fkey" FOREIGN KEY ("senderEmailId") REFERENCES "EmailConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_recipientEmailId_fkey" FOREIGN KEY ("recipientEmailId") REFERENCES "EmailConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarmupConfig" ADD CONSTRAINT "WarmupConfig_warmupEmailId_fkey" FOREIGN KEY ("warmupEmailId") REFERENCES "EmailConfig"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WarmupConfig" ADD CONSTRAINT "WarmupConfig_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
