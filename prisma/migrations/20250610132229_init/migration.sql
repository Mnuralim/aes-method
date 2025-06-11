/*
  Warnings:

  - You are about to drop the `scores` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `students` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subjects` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "scores" DROP CONSTRAINT "scores_student_id_fkey";

-- DropForeignKey
ALTER TABLE "scores" DROP CONSTRAINT "scores_subject_id_fkey";

-- DropForeignKey
ALTER TABLE "students" DROP CONSTRAINT "students_admin_id_fkey";

-- DropTable
DROP TABLE "scores";

-- DropTable
DROP TABLE "students";

-- DropTable
DROP TABLE "subjects";

-- CreateTable
CREATE TABLE "residents" (
    "id" TEXT NOT NULL,
    "nik" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "birth_date" TEXT NOT NULL,
    "birth_place" TEXT NOT NULL,
    "religion" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "occupation" TEXT,
    "marital_status" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "admin_id" TEXT,

    CONSTRAINT "residents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "family_cards" (
    "id" TEXT NOT NULL,
    "card_number" TEXT NOT NULL,
    "head_of_family" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "member_count" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "resident_id" TEXT NOT NULL,

    CONSTRAINT "family_cards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "residents_id_key" ON "residents"("id");

-- CreateIndex
CREATE UNIQUE INDEX "residents_nik_key" ON "residents"("nik");

-- CreateIndex
CREATE UNIQUE INDEX "family_cards_id_key" ON "family_cards"("id");

-- CreateIndex
CREATE UNIQUE INDEX "family_cards_card_number_key" ON "family_cards"("card_number");

-- AddForeignKey
ALTER TABLE "residents" ADD CONSTRAINT "residents_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "family_cards" ADD CONSTRAINT "family_cards_resident_id_fkey" FOREIGN KEY ("resident_id") REFERENCES "residents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
