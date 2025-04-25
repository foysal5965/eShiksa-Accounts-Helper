export const drawSmsSummaryTable = (page, font, boldFont, x, y, bill, rgb) => {
    const colWidths = [250, 100, 150];
    const rowHeight = 25;
    const fontSize = 12;
    const smsRate = 0.4;
  
    const smsTypes = [
      { name: 'Admission Message', count: bill.admissionMsg || 0 },
      { name: 'Group Message', count: bill.groupMsg || 0 },
      { name: 'Pro Re-migration Message', count: bill.proReMigraMsg || 0 },
      { name: 'Professional Add Message', count: bill.professionalAddMsg || 0 },
      { name: 'Student NTS Message', count: bill.stdNtsMsg || 0 },
      { name: 'Tuition Fee Message', count: bill.TutionFeeMsg || 0 },
      { name: 'Absent Message', count: bill.absentMsg || 0 },
    ];
  
    // Filter out rows with 0 count
    const filteredSmsTypes = smsTypes.filter(item => item.count > 0);
  
    // Prepare rows
    const rows = filteredSmsTypes.map(item => [
      item.name,
      `${item.count}`,
      `${(item.count * smsRate).toFixed(2)}`
    ]);
  
    // Calculate total
    const totalCount = filteredSmsTypes.reduce((sum, item) => sum + item.count, 0);
    const totalAmount = (totalCount * smsRate).toFixed(2);
  
    // Add header and total row
    rows.unshift(['Message Type', 'SMS Count', 'Total']); // Header row
    rows.push(['Total', `${totalCount}`, `${totalAmount}`]); // Footer total row
  
    const numRows = rows.length;
    const numCols = colWidths.length;
    const tableWidth = colWidths.reduce((a, b) => a + b, 0);
    const tableHeight = rowHeight * numRows;
  
    // Draw horizontal borders
    for (let i = 0; i <= numRows; i++) {
      const rowY = y - i * rowHeight;
      page.drawLine({
        start: { x, y: rowY },
        end: { x: x + tableWidth, y: rowY },
        thickness: 0.5,
        color: rgb(0, 0, 0),
      });
    }
  
    // Draw vertical borders
    let colX = x;
    for (let i = 0; i <= numCols; i++) {
      page.drawLine({
        start: { x: colX, y },
        end: { x: colX, y: y - tableHeight },
        thickness: 0.5,
        color: rgb(0, 0, 0),
      });
      colX += colWidths[i] || 0;
    }
  
    // Draw text content
    rows.forEach((row, rowIndex) => {
      let cellY = y - rowIndex * rowHeight - (rowHeight + fontSize) / 2 + 2;
      let cellX = x;
  
      row.forEach((text, colIndex) => {
        page.drawText(text, {
          x: cellX + 5,
          y: cellY,
          size: fontSize,
          font: rowIndex === 0 || rowIndex === rows.length - 1 ? boldFont : font,
          color: rgb(0, 0, 0),
        });
        cellX += colWidths[colIndex];
      });
    });
  
    return y - tableHeight;
  };
  