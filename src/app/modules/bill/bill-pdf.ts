import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { drawTable } from './drawTable';
import { numberToWords } from './numberToWords';
import { drawSmsSummaryTable } from './smsSummaryTable';
import { wrapText } from './bill.interface';

export async function generateBillPdf(bill: any, college: any, totalAmount: number) {
  const doc = await PDFDocument.create();
  const page = doc.addPage([595, 842]); // A4 size
  const font = await doc.embedFont(StandardFonts.Helvetica);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);
  const pageWidth = 595;

  // Load the main logo
  const logoPath = path.resolve(__dirname, '../../assets/eshiksa_logo.png');
  const logoImageBytes = fs.readFileSync(logoPath);
  const logoImage = await doc.embedPng(logoImageBytes);

  // Load the footer logo (corrected)
  const footerLogoPath = path.resolve(__dirname, '../../assets/eshiksafooter.png');
  const footerLogoBytes = fs.readFileSync(footerLogoPath);
  const footerLogoImage = await doc.embedPng(footerLogoBytes);

  const logoDims = logoImage.scale(0.9);
  page.drawImage(logoImage, {
    x: 50,
    y: 770,
    width: logoDims.width,
    height: logoDims.height,
  });

  const drawText = (text: string, x: number, y: number, size = 12) => {
    page.drawText(text, {
      x,
      y,
      size,
      font,
      color: rgb(0, 0, 0),
    });
  };

  let y = 750;

  drawText(`Invoice No: EMS/5000/MDF/50`, 50, y -= 5);
  drawText(`To`, 50, y -= 25);
  drawText(`The Principal`, 50, y -= 17);
  drawText(`${college.collegeName}`, 50, y -= 20);
  drawText(`${college.collegeAddress}`, 50, y -= 20);

  page.drawText(`Subject: Software & SMS Monthly Bill of ${bill.billingTime}`, {
    x: 50,
    y: y -= 30,
    size: 12,
    font: boldFont,
    color: rgb(0, 0, 0),
  });

  drawText("Dear Sir,", 50, y -= 20);
  drawText("We would like to request you to approve the following bill:", 50, y -= 20);

  y = drawTable(page, font, boldFont, 50, y, bill, college, rgb);

  const totalAmountInteger = parseInt(totalAmount.toString(), 10);
  const word = numberToWords(totalAmountInteger);

  page.drawText(`Amount in word: ${word} Taka Only`, {
    x: 50,
    y: y -= 20,
    font: boldFont,
    size: 12,
    color: rgb(0, 0, 0),
  });

  page.drawText(`SMS Summary: ${bill.billingTime}`, {
    x: 50,
    y: y -= 20,
    font: boldFont,
    size: 12,
    color: rgb(0, 0, 0),
  });

  y -= 10;
  y = drawSmsSummaryTable(page, font, boldFont, 50, y, bill, rgb);

  page.drawText(`Please take necessary steps for the payments`, {
    x: 50,
    y: y -= 20,
    font: boldFont,
    size: 12,
    color: rgb(0, 0, 0),
  });

  const bottomY = 60;

  drawText("Thank you & Best Regards,", 50, bottomY + 40);
  drawText('Sincerely', 50, bottomY + 20);
  drawText("Shah Mujtahid Mujtaba", 50, bottomY - 5);
  drawText("General Manager", 50, bottomY - 20);

  // Add date at top-right
  const currentDate = new Date().toLocaleDateString('en-GB');
  const dateWidth = font.widthOfTextAtSize(currentDate, 12);
  const xDate = pageWidth - dateWidth - 50;
  const yDate = 780;

  page.drawText(`Date: ${currentDate}`, {
    x: xDate,
    y: yDate,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });

  // Add location pin and address centered at bottom
  const locationPinPath = path.resolve(__dirname, '../../assets/home-icon.png');
  const locationPinBytes = fs.readFileSync(locationPinPath);
  const locationPinImage = await doc.embedPng(locationPinBytes);

  const locationText = 'Room No #05 (5th Floor), Ak Complex 19 Green Road,Dhaka-1205, Bangladesh';
  const locationPinWidth = 15;
  const locationTextWidth = font.widthOfTextAtSize(locationText, 12);
  const totalWidth = locationPinWidth + 10 + locationTextWidth;
  const xLocation = (pageWidth - totalWidth) / 2;

  page.drawImage(locationPinImage, {
    x: xLocation,
    y: bottomY - 45,
    width: locationPinWidth,
    height: 16,
  });

  page.drawText(locationText, {
    x: xLocation + locationPinWidth + 10,
    y: bottomY - 40,
    font: font,
    size: 12,
    color: rgb(0, 0, 0),
  });

  // ✅ Draw footer logo at bottom-right
  const footerDims = footerLogoImage.scale(0.1); // Adjust scale as needed
  page.drawImage(footerLogoImage, {
    x: page.getWidth() - footerDims.width ,
    y: 0,
    width: footerDims.width,
    height: footerDims.height,
  });

  const pdfBytes = await doc.save();
  return Buffer.from(pdfBytes);
}
