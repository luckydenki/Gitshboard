/*
  Warnings:

  - You are about to drop the column `githubAccessToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "githubAccessToken";

-- CreateTable
CREATE TABLE "EncryptionKey" (
    "userId" INTEGER NOT NULL,
    "version" INTEGER NOT NULL,
    "ciphertext" TEXT NOT NULL,
    "iv" TEXT NOT NULL,
    "authTag" TEXT NOT NULL,

    CONSTRAINT "EncryptionKey_pkey" PRIMARY KEY ("userId")
);

-- AddForeignKey
ALTER TABLE "EncryptionKey" ADD CONSTRAINT "EncryptionKey_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
