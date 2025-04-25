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

  // Load the eShiksa logo from local file system
  const logoPath = path.resolve(__dirname, '../../assets/eshiksa_logo.png');
  const logoImageBytes = fs.readFileSync(logoPath);
  const logoImage = await doc.embedPng(logoImageBytes);
  const boldFont = await doc.embedFont(StandardFonts.HelveticaBold);

  // Set dimensions & draw the image
  const logoDims = logoImage.scale(0.9); // Adjust size if needed
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

  let y = 750; // Start below the image

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

  // Table Header
  y = drawTable(page, font, boldFont, 50, y, bill, college, rgb);

  const totalAmountInteger = parseInt(totalAmount.toString(), 10);
const word = numberToWords(totalAmountInteger);;  // Convert the number to words
  

  page.drawText(`Amount in word: ${word} Taka Only`, {
    x: 50,
    y: y -= 20,
    font: boldFont,  // Set the bold font
    size: 12,        // Set the font size (adjust as necessary)
    color: rgb(0, 0, 0),  // Set the text color (black)
  });

  page.drawText(`SMS Summary: ${bill.billingTime}`, {
    x: 50,
    y: y -= 20,
    font: boldFont,  // Set the bold font
    size: 12,        // Set the font size (adjust as necessary)
    color: rgb(0, 0, 0),  // Set the text color (black)
  });

  y -= 10;
  y = drawSmsSummaryTable(page, font, boldFont, 50, y, bill, rgb);

  page.drawText(`Please take necessary steps for the payments`, {
    x: 50,
    y: y -= 20,
    font: boldFont,  // Set the bold font
    size: 12,        // Set the font size (adjust as necessary)
    color: rgb(0, 0, 0),  // Set the text color (black)
  });

  const bottomY = 60; // Distance from bottom of the page (adjust as needed)

  drawText("Thank you & Best Regards,", 50, bottomY + 40);
  drawText('Sincerely', 50, bottomY + 20);
  drawText("Shah Mujtahid Mujtaba", 50, bottomY - 5);
  drawText("General Manager", 50, bottomY - 20);

  // Add the current date at the top-right
  const currentDate = new Date().toLocaleDateString('en-GB'); // Format: dd/mm/yyyy
  const dateWidth = font.widthOfTextAtSize(currentDate, 12); // Get width of date text
  const pageWidth = 595; // A4 page width
  const xDate = pageWidth - dateWidth - 50; // Position it 50 units from the right edge
  const yDate = 780; // Position near the top

  // Draw the date at the top-right
  page.drawText(`Date: ${currentDate}`, {
    x: xDate,
    y: yDate,
    size: 12,
    font,
    color: rgb(0, 0, 0),
  });

  // Load the location pin image from the file system
  const locationPinPath = path.resolve(__dirname, '../../assets/home-icon.png');
  const locationPinBytes = fs.readFileSync(locationPinPath);
  const locationPinImage = await doc.embedPng(locationPinBytes);

  // Calculate the total width of the location pin and the text
  const locationText = 'Room No #05 (5th Floor), Ak Complex 19 Green Road,Dhaka-1205, Bangladesh';
  const locationPinWidth = 15;  // Width of the pin icon
  const locationTextWidth = font.widthOfTextAtSize(locationText, 12); // Width of the location text
  const totalWidth = locationPinWidth + 10 + locationTextWidth; // Total width (icon + text + padding)

  // Calculate the X position for centering the content
  const x = (pageWidth - totalWidth) / 2; // Centered X position

  // Draw the location pin image centered near the bottom
  page.drawImage(locationPinImage, {
    x,
    y: bottomY - 45,  // Set the Y position for the pin (near the bottom)
    width: locationPinWidth,
    height: 16,
  });

  // Draw the location text next to the icon, centered
  page.drawText(locationText, {
    x: x + locationPinWidth + 10,  // Position the text to the right of the icon
    y: bottomY - 40,           // Align the text with the pin
    font: font,
    size: 12,
    color: rgb(0, 0, 0),
  });

  // Serialize the document to bytes (this is what you will save or send as a file)
  const pdfBytes = await doc.save();

  return Buffer.from(pdfBytes);
}
