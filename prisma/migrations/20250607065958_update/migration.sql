/*
  Warnings:

  - Added the required column `address` to the `students` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "students" ADD COLUMN     "address" TEXT NOT NULL;
