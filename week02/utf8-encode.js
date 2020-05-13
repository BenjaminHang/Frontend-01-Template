

function utf8Encode(str) {
  return str.split('').map(char => {
    let code = char.charCodeAt(0);
    if (code < 0x0080) {
      return code.toString(2);
    } else if (code < 0x0800) {
      let b1 = ((code & 0x07c0) << 2) + 0xc000;
      let b2 = (code & 0x003f) + 0x0080;
      return (b1 + b2).toString(2);
    } else {
      let b1 = ((code & 0xf000) << 4) + 0xe00000;
      let b2 = ((code & 0x0fc0) << 2) + 0x8000;
      let b3 = ((code & 0x003f)) + 0x0080;
      return (b1 + b2 + b3).toString(2)
    }
  });
}

console.log(utf8Encode('a'));

// process.stdin.setEncoding('utf8');

// process.stdin.on('readable', () => {
//   let chunk;
//   // Use a loop to make sure we read all available data.
//   while ((chunk = process.stdin.read()) !== null) {
//     if (chunk.slice(0, -1)) {
//       process.stdout.write(`data: ${utf8Encode(chunk.slice(0, -1))}\n`);
//     }
//   }
// });
