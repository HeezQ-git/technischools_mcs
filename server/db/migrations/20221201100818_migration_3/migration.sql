/*
  Warnings:

  - You are about to drop the column `email` on the `clients` table. All the data in the column will be lost.
  - You are about to drop the `messages_groups` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `messages_groups` DROP FOREIGN KEY `messages_groups_ibfk_1`;

-- DropForeignKey
ALTER TABLE `messages_groups` DROP FOREIGN KEY `messages_groups_ibfk_2`;

-- AlterTable
ALTER TABLE `accounts` ADD COLUMN `email` VARCHAR(255) NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE `clients` DROP COLUMN `email`;

-- DropTable
DROP TABLE `messages_groups`;

-- CreateTable
CREATE TABLE `_groupsTomessages` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_groupsTomessages_AB_unique`(`A`, `B`),
    INDEX `_groupsTomessages_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_groupsTomessages` ADD CONSTRAINT `_groupsTomessages_A_fkey` FOREIGN KEY (`A`) REFERENCES `groups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_groupsTomessages` ADD CONSTRAINT `_groupsTomessages_B_fkey` FOREIGN KEY (`B`) REFERENCES `messages`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
