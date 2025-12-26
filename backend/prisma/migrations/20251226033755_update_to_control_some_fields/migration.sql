/*
  Warnings:

  - You are about to drop the column `bidsCount` on the `auctions` table. All the data in the column will be lost.
  - You are about to drop the column `currentBid` on the `auctions` table. All the data in the column will be lost.
  - You are about to drop the column `timeLeft` on the `auctions` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `auctions` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `auctions` DROP COLUMN `bidsCount`,
    DROP COLUMN `currentBid`,
    DROP COLUMN `timeLeft`,
    DROP COLUMN `year`;
