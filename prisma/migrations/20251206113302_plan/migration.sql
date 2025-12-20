/*
  Warnings:

  - You are about to drop the column `plusId` on the `User` table. All the data in the column will be lost.
  - Added the required column `userId` to the `PlusPlan` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_plusId_fkey";

-- AlterTable
ALTER TABLE "PlusPlan" ADD COLUMN     "userId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "plusId";

-- AddForeignKey
ALTER TABLE "PlusPlan" ADD CONSTRAINT "PlusPlan_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
