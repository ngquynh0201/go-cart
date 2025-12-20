-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isSwitchedFree" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isSwitchedPlus" BOOLEAN NOT NULL DEFAULT false;
