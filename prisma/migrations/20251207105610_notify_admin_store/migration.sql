/*
  Warnings:

  - You are about to drop the `Notification` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "NotificationAdminType" AS ENUM ('STORE', 'PRODUCT', 'ORDER');

-- CreateEnum
CREATE TYPE "NotificationStoreType" AS ENUM ('ORDER', 'RATING');

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_orderId_fkey";

-- DropForeignKey
ALTER TABLE "Notification" DROP CONSTRAINT "Notification_productId_fkey";

-- DropTable
DROP TABLE "Notification";

-- DropEnum
DROP TYPE "NotificationType";

-- CreateTable
CREATE TABLE "NotificationAdmin" (
    "id" TEXT NOT NULL,
    "type" "NotificationAdminType" NOT NULL,
    "storeId" TEXT,
    "productId" TEXT,
    "orderId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isNew" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationAdmin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationStore" (
    "id" TEXT NOT NULL,
    "type" "NotificationStoreType" NOT NULL,
    "orderId" TEXT,
    "ratingId" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "isNew" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationStore_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NotificationAdmin" ADD CONSTRAINT "NotificationAdmin_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "Store"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationAdmin" ADD CONSTRAINT "NotificationAdmin_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationAdmin" ADD CONSTRAINT "NotificationAdmin_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationStore" ADD CONSTRAINT "NotificationStore_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationStore" ADD CONSTRAINT "NotificationStore_ratingId_fkey" FOREIGN KEY ("ratingId") REFERENCES "Rating"("id") ON DELETE SET NULL ON UPDATE CASCADE;
