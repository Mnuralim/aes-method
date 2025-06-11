/*
  Warnings:

  - You are about to drop the column `resident_id` on the `family_cards` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "family_cards" DROP CONSTRAINT "family_cards_resident_id_fkey";

-- AlterTable
ALTER TABLE "family_cards" DROP COLUMN "resident_id";

-- AlterTable
ALTER TABLE "residents" ADD COLUMN     "family_card_id" TEXT;

-- AddForeignKey
ALTER TABLE "residents" ADD CONSTRAINT "residents_family_card_id_fkey" FOREIGN KEY ("family_card_id") REFERENCES "family_cards"("id") ON DELETE SET NULL ON UPDATE CASCADE;
