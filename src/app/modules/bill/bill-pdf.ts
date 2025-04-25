import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'
import fs from 'fs'
import path from 'path'
import { drawTable } from './drawTable'
import { numberToWords } from './numberToWords'

export async function generateBillPdf(bill: any, college: any) {
  const doc = await PDFDocument.create()
  const page = doc.addPage([595, 842]) // A4 size
  const font = await doc.embedFont(StandardFonts.Helvetica)

  // Load the eShiksa logo from local file system
  const logoPath = path.resolve(__dirname, '../../assets/eshiksa_logo.png')
  const logoImageBytes = fs.readFileSync(logoPath)
  const logoImage = await doc.embedPng(logoImageBytes)
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold)
  // Set dimensions & draw the image
  const logoDims = logoImage.scale(0.9) // Adjust size if needed
  page.drawImage(logoImage, {
    x: 50,
    y: 770,
    width: logoDims.width,
    height: logoDims.height,
  })

  const drawText = (text: string, x: number, y: number, size = 12) => {
    page.drawText(text, {
      x,
      y,
      size,
      font,
      color: rgb(0, 0, 0)
    })
  }

  let y = 750 // Start below the image

  drawText(`Invoice No: EMS/5000/MDF/50`, 50, y -= 5)
  drawText(`To`, 50, y -= 25)
  drawText(`The Principal`, 50, y -= 17)
  drawText(`${college.collegeName}`, 50, y -= 20)
  drawText(`${college.collegeAddress}`, 50, y -= 20)

  page.drawText(`Subject: Software & SMS Monthly Bill of ${bill.billingTime}`, {
    x: 50,
    y: y -= 30,
    size: 12,
    font: boldFont,
    color: rgb(0, 0, 0)
  })
  drawText("Dear Sir,", 50, y -= 20)
  drawText("We would like to request you to approve the following bill:", 50, y -= 20)
  // Table Header
  
  // Draw the table
  y = drawTable(page, font, boldFont, 50, y, bill, college, rgb);
  const word = numberToWords(111142)
  console.log(word)
  page.drawText(`Amount in word: ${word} Taka Only`, {
    x: 50,
    y: y -= 20,
    font: boldFont,  // Set the bold font
    size: 12,        // Set the font size (adjust as necessary)
    color: rgb(0, 0, 0)  // Set the text color (black)
  });

const bottomY = 80 // Distance from bottom of the page (adjust as needed)

drawText("Thank you & Best Regards,", 50, bottomY + 40)
drawText("Shah Mujtahid Mujtaba", 50, bottomY + 20)
drawText("General Manager", 50, bottomY)


  const pdfBytes = await doc.save()
  return Buffer.from(pdfBytes)
}
