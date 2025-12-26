/*
  Warnings:

  - The primary key for the `auctions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `categoryId` on the `auctions` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `auctions` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `Int`.
  - You are about to drop the `images` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `auctions` DROP FOREIGN KEY `auctions_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `images` DROP FOREIGN KEY `images_categoryId_fkey`;

-- DropForeignKey
ALTER TABLE `images` DROP FOREIGN KEY `images_userId_fkey`;

-- DropIndex
DROP INDEX `auctions_categoryId_fkey` ON `auctions`;

-- AlterTable
ALTER TABLE `auctions` DROP PRIMARY KEY,
    DROP COLUMN `categoryId`,
    ADD COLUMN `categoryID` VARCHAR(191) NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `currentBid` VARCHAR(191) NOT NULL,
    MODIFY `bidsCount` INTEGER NULL,
    MODIFY `userId` VARCHAR(191) NULL,
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `images`;

-- AddForeignKey
ALTER TABLE `auctions` ADD CONSTRAINT `auctions_categoryID_fkey` FOREIGN KEY (`categoryID`) REFERENCES `categories`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
