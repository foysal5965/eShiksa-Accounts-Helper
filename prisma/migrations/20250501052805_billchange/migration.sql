-- CreateEnum
CREATE TYPE "BillUpdate" AS ENUM ('PENDING', 'RECIVED', 'CANCELED');

-- AlterTable
ALTER TABLE "Bill" ADD COLUMN     "billUpdate" "BillUpdate" NOT NULL DEFAULT 'PENDING';
