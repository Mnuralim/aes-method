/*
  Warnings:

  - A unique constraint covering the columns `[nisn]` on the table `students` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `nisn` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "students" ADD COLUMN     "nisn" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "students_nisn_key" ON "students"("nisn");
