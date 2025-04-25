export interface IBill {
    id: string;
    cloudSpaceUnit: number;
    billingTime: string;
    admissionMsg: number;
    groupMsg: number;
    proReMigraMsg: number;
    professionalAddMsg: number;
    stdNtsMsg: number;
    TutionFeeMsg: number;
    absentMsg: number;
    collegeId: string;
    college: College;
    createdAt: Date;
    updatedAt: Date;
  }
export interface College {
    collegeName: string;
    collegeAddress : string;
    cloudSpacePricePerUnit: number
}  


export function wrapText(text: string, maxWidth: number, font: any, fontSize: number): string[] {
    let lines: string[] = [];
    let currentLine = '';
    
    const words = text.split(' ');
  
    for (let i = 0; i < words.length; i++) {
      const word = words[i];
      const testLine = currentLine ? currentLine + ' ' + word : word;
      const testWidth = font.widthOfTextAtSize(testLine, fontSize);
  
      if (testWidth <= maxWidth) {
        currentLine = testLine;
      } else {
        if (currentLine) lines.push(currentLine);
        currentLine = word;
      }
    }
  
    if (currentLine) lines.push(currentLine);
  
    return lines;
  }
  
  