/*
  Warnings:

  - You are about to drop the column `userId` on the `LoginToken` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "LoginToken" DROP CONSTRAINT "LoginToken_userId_fkey";

-- AlterTable
ALTER TABLE "LoginToken" DROP COLUMN "userId";
