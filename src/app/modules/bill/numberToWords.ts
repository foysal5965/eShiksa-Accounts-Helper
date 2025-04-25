export function numberToWords(amount: number) {
  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten',
    'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'
  ];
  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];
  const thousands = [
    '', 'Thousand', 'Million', 'Billion', 'Trillion'
  ];

  function convert(number: number) {
    if (number === 0) return 'Zero';
    
    let word = '';
    let i = 0;

    while (number > 0) {
      if (number % 1000 !== 0) {
        word = `${helper(number % 1000)} ${thousands[i]} ${word}`;
      }
      number = Math.floor(number / 1000);
      i++;
    }

    return word.trim();
  }

  function helper(number: number) {
    if (number === 0) return '';
    else if (number < 20) return ones[number];
    else if (number < 100) return `${tens[Math.floor(number / 10)]} ${ones[number % 10]}`;
    else return `${ones[Math.floor(number / 100)]} Hundred ${helper(number % 100)}`;
  }

  // Handling decimal part
  const integerPart = Math.floor(amount);
  const decimalPart = amount - integerPart;

  let integerWords = convert(integerPart);
  let decimalWords = '';

  if (decimalPart > 0) {
    const decimalString = decimalPart.toFixed(2).split('.')[1]; // Get the decimal part as string
    decimalWords = ` point ${decimalString.split('').map(digit => ones[parseInt(digit)]).join(' ')}`;
  }

  return integerWords + decimalWords;
}
