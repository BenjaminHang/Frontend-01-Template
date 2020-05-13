const convertNumberToString = (number, radix = 10) => {
  let sign = number < 0;
  number = sign ? -number : number;
  let i = 0
  while (Math.abs(number - Math.round(number)) > number * Number.EPSILON) {
    number = number * radix;
    i++
  }

  number = Math.round(number);
  
  let string = '';
  let j = 0;
  while (number > 0) {
    if (i !== 0 && i === j) {
      string = '.' + string;
    }
    string = number % radix + string;
    j++;
    number = Math.floor(number / radix);
  }
  if (j === 0) {
    string = '0';
  } else if (i === j){
    string = '0.' + string
  }

  return (sign ? '-' : '') + string;
}

console.log(convertNumberToString(123.23))