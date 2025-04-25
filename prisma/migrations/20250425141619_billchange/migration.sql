/*
  Warnings:

  - Added the required column `cloudSpaceUnit` to the `Bill` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "cloudSpaceUnit" INTEGER NOT NULL;
