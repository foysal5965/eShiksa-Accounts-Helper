import { Response } from "express"
import prisma from "../../shared/prisma"
import { generateBillPdf } from "./bill-pdf"
const bill = async(req:Request,res:Response)=>{
    console.log(req)
    const collegeData = await prisma.college.findFirstOrThrow({
        where: {
            id: req.collegeId
        }
    })
    const pdfBuffer = await generateBillPdf(req, collegeData)
     // Return the buffer as a downloadable PDF
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", "attachment; filename=bill.pdf");
  res.send(pdfBuffer);
}


export const billService= {
    bill
}