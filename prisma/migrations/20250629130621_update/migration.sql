/*
  Warnings:

  - You are about to drop the column `family_card_id` on the `residents` table. All the data in the column will be lost.
  - You are about to drop the `family_cards` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `residents` DROP FOREIGN KEY `residents_family_card_id_fkey`;

-- DropIndex
DROP INDEX `residents_family_card_id_fkey` ON `residents`;

-- AlterTable
ALTER TABLE `residents` DROP COLUMN `family_card_id`;

-- DropTable
DROP TABLE `family_cards`;
