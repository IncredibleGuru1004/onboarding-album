-- AlterTable
ALTER TABLE `users` ADD COLUMN `emailVerificationToken` VARCHAR(191) NULL,
    ADD COLUMN `emailVerificationTokenExpires` DATETIME(3) NULL;

