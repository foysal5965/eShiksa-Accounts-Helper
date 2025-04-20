-- CreateTable
CREATE TABLE "Bill" (
    "id" TEXT NOT NULL,
    "billingTime" TEXT NOT NULL,
    "admissionMsg" INTEGER NOT NULL,
    "groupMsg" INTEGER NOT NULL,
    "proReMigraMsg" INTEGER NOT NULL,
    "professionalAddMsg" INTEGER NOT NULL,
    "stdNtsMsg" INTEGER NOT NULL,
    "TutionFeeMsg" INTEGER NOT NULL,
    "absentMsg" INTEGER NOT NULL,
    "collegeId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bill_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bill" ADD CONSTRAINT "Bill_collegeId_fkey" FOREIGN KEY ("collegeId") REFERENCES "College"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
