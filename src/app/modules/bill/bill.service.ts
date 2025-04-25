import { Response } from "express"
import prisma from "../../shared/prisma"
import { generateBillPdf } from "./bill-pdf"
import { IBill } from "./bill.interface"
const bill = async(req:IBill,res:Response)=>{
   console.log(req)
    const collegeData = await prisma.college.findFirstOrThrow({
        where: {
            id: req.collegeId
        }
    })
    const admissionMsg = req.admissionMsg ? req.admissionMsg : 0
    const groupMsg = req.groupMsg ? req.groupMsg : 0
    const proReMigraMsg = req.proReMigraMsg ? req.proReMigraMsg : 0
    const professionalAddMsg = req.professionalAddMsg ? req.professionalAddMsg : 0
    const stdNtsMsg = req.groupMsg ? req.stdNtsMsg : 0
    const TutionFeeMsg = req.TutionFeeMsg ? req.TutionFeeMsg : 0
    const absentMsg = req.absentMsg ? req.absentMsg : 0
    //total message & bill
    const totalsmsCount = admissionMsg+groupMsg+proReMigraMsg+
    professionalAddMsg+stdNtsMsg+TutionFeeMsg+absentMsg
    const messageBill = 0.4 * totalsmsCount
    //software cloud bill
    const softwareFee = req.cloudSpaceUnit * collegeData.cloudSpacePricePerUnit
    const totalAmount = messageBill+ softwareFee
    const pdfBuffer = await generateBillPdf(req, collegeData, totalAmount)
     // Return the buffer as a downloadable PDF
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=bill.pdf");
  res.send(pdfBuffer);
}


export const billService= {
    bill
}