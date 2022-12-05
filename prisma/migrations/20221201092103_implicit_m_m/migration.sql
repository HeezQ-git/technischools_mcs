/*
  Warnings:

  - You are about to drop the `groups_users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `groups_users` DROP FOREIGN KEY `groups_users_ibfk_1`;

-- DropForeignKey
ALTER TABLE `groups_users` DROP FOREIGN KEY `groups_users_ibfk_2`;

-- DropTable
DROP TABLE `groups_users`;

-- CreateTable
CREATE TABLE `_groupsTousers` (
    `A` INTEGER NOT NULL,
    `B` INTEGER NOT NULL,

    UNIQUE INDEX `_groupsTousers_AB_unique`(`A`, `B`),
    INDEX `_groupsTousers_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `_groupsTousers` ADD CONSTRAINT `_groupsTousers_A_fkey` FOREIGN KEY (`A`) REFERENCES `groups`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `_groupsTousers` ADD CONSTRAINT `_groupsTousers_B_fkey` FOREIGN KEY (`B`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
