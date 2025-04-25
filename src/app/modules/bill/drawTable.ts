
export const drawTable = (page, font, boldFont, x, y, bill, college, rgb) => {
    const tableX = x; // Starting X position (50)
    const colWidths = [30, 180, 60, 100, 100]; // Fixed column widths
    const fontSize = 12;
    let tableY = y - 20; // Start with a small gap below previous content
    const rowHeights = [];
    const headerHeight = fontSize + 10; // Increased padding for header
  
    // Headers (Static)
    const headers = ['Sl', 'Particulars', 'Unit', 'Unit Price (Taka)', 'Taka'];
  
    // Dynamic Data
    const softwareFee = 4 * college.cloudSpacePricePerUnit;
    const smsCount =
      bill.admissionMsg +
      bill.groupMsg +
      bill.proReMigraMsg +
      bill.professionalAddMsg +
      bill.stdNtsMsg +
      bill.TutionFeeMsg +
      bill.absentMsg;
    const smsRate = 0.4;
    const smsFee = parseFloat((smsCount * smsRate).toFixed(2));
  
    const rows = [
      [
        '1',
        `Monthly cloud space rent & Software Management fee (${bill.billingTime})`,
        '4',
        `${college.cloudSpacePricePerUnit}`,
        `${softwareFee}`,
      ],
      ['2', `SMS Bill (${bill.billingTime})`, `${smsCount}`, `${smsRate}`, `${smsFee}`],
    ];
  
    // Calculate total amount (add values from the rows)
    const totalAmount = softwareFee + smsFee;
  
    // Add Total Amount Row - now with "Total Amount" in the 4th column and the amount in the 5th column
    rows.push([
      '',  // Empty for Sl column
      '',  // Empty for Particulars
      '',  // Empty for Unit
      'Total Amount',  // The text in the 4th column
      `${totalAmount}`,  // The total amount in the 5th column
    ]);
  
    // Helper to wrap text and calculate row heights dynamically
    const wrapText = (text, maxWidth, font, fontSize) => {
      if (!text) return ['']; // Handle empty or undefined text
      const words = text.toString().split(' ');
      const lines = [];
      let line = '';
      for (let word of words) {
        const testLine = line ? line + ' ' + word : word;
        if (font.widthOfTextAtSize(testLine, fontSize) > maxWidth - 4) {
          if (line) lines.push(line);
          line = word;
        } else {
          line = testLine;
        }
      }
      if (line) lines.push(line);
      return lines;
    };
  
    // === Draw Headers ===
    let colX = tableX;
    headers.forEach((header, i) => {
      page.drawText(header, {
        x: colX + 2, // Small padding
        y: tableY - fontSize - 2, // Center text vertically in header cell
        size: fontSize,
        font: boldFont,
        color: rgb(0, 0, 0),
      });
      colX += colWidths[i];
    });
  
    // Add header height to rowHeights
    rowHeights.push(headerHeight);
    tableY -= headerHeight; // Move Y below headers
  
    // === Draw Static Border Under Header ===
    page.drawLine({
      start: { x: tableX, y: tableY },
      end: { x: tableX + colWidths.reduce((a, b) => a + b, 0), y: tableY },
      thickness: 0.5,
      color: rgb(0, 0, 0),
    });
  
    // === Draw Rows ===
    rows.forEach((row, rowIndex) => {
      // If it's the last row (Total Amount), skip empty columns
      if (rowIndex === rows.length - 1) {
        // Wrap text and calculate max height for the "Total Amount" row
        const wrappedCells = row.slice(0, 4).map((text, i) => wrapText(text, colWidths[i] - 4, font, fontSize));
        const maxLines = Math.max(...wrappedCells.map((c) => c.length));
        const rowHeight = maxLines * (fontSize + 2) + 10; // Increased padding for rows, ensuring space for all text
        rowHeights.push(rowHeight);
  
        // Draw only necessary columns for this row (4th and 5th column)
        let colX = tableX;
        row.forEach((text, i) => {
          if (i === 3 || i === 4) { // Only draw 4th and 5th columns (Total Amount row)
            const lines = wrapText(text, colWidths[i] - 4, font, fontSize);
            lines.forEach((line, idx) => {
              page.drawText(line, {
                x: colX + 2,
                y: tableY - idx * (fontSize + 2) - 15, // Adjust for padding
                size: fontSize,
                font,
                color: rgb(0, 0, 0),
              });
            });
          }
          colX += colWidths[i];
        });
  
        tableY -= rowHeight; // Move Y for next row
  
        // Draw Border Under the Row Content
        page.drawLine({
          start: { x: tableX, y: tableY },
          end: { x: tableX + colWidths.reduce((a, b) => a + b, 0), y: tableY },
          thickness: 0.5,
          color: rgb(0, 0, 0),
        });
      } else {
        // Wrap text and calculate max height for the regular rows
        const wrappedCells = row.map((text, i) => wrapText(text, colWidths[i] - 4, font, fontSize));
        const maxLines = Math.max(...wrappedCells.map((c) => c.length));
        const rowHeight = maxLines * (fontSize + 2) + 10; // Increased padding for rows, ensuring space for all text
        rowHeights.push(rowHeight);
  
        colX = tableX;
        row.forEach((text, i) => {
          const lines = wrappedCells[i];
          lines.forEach((line, idx) => {
            page.drawText(line, {
              x: colX + 2,
              y: tableY - idx * (fontSize + 2) - 15, // Adjust for padding
              size: fontSize,
              font,
              color: rgb(0, 0, 0),
            });
          });
          colX += colWidths[i];
        });
  
        tableY -= rowHeight; // Move Y for next row
  
        // Draw Border Under the Row Content
        page.drawLine({
          start: { x: tableX, y: tableY },
          end: { x: tableX + colWidths.reduce((a, b) => a + b, 0), y: tableY },
          thickness: 0.5,
          color: rgb(0, 0, 0),
        });
      }
    });
  
    // === Draw Borders ===
    const totalTableHeight = rowHeights.reduce((a, b) => a + b, 0);
    const tableTopY = y - 20; // Top of the table (header top)
    const tableBottomY = tableY; // Bottom of the table (after last row)
  
    // Draw vertical lines for each column boundary (left and right borders)
    colX = tableX;
    for (let i = 0; i <= colWidths.length; i++) {
      page.drawLine({
        start: { x: colX, y: tableTopY },
        end: { x: colX, y: tableBottomY },
        thickness: 0.5,
        color: rgb(0, 0, 0),
      });
      colX += colWidths[i] || 0;
    }
  
    // Draw top and bottom borders of the table (after header and after last row)
    page.drawLine({
      start: { x: tableX, y: tableTopY },
      end: { x: tableX + colWidths.reduce((a, b) => a + b, 0), y: tableTopY },
      thickness: 0.5,
      color: rgb(0, 0, 0),
    });
  
    page.drawLine({
      start: { x: tableX, y: tableBottomY },
      end: { x: tableX + colWidths.reduce((a, b) => a + b, 0), y: tableBottomY },
      thickness: 0.5,
      color: rgb(0, 0, 0),
    });
  
    return tableBottomY; // Return Y position after table
  };
  
  

  
  
  
  
  

