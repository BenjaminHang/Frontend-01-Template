const stdin = process.stdin;
const stdout = process.stdout;

stdin.setRawMode(true);
stdin.setEncoding('utf8');

void async function () {
  let result = await selection();
  stdout.write(result.match(/^([^]+):/)[1] + '\n');
  process.exit(0);
}()

function selection() {
  return new Promise(resolve => {
    let position = 0;
    let items = [
      'Vue: The Progressive JavaScript Framework',
      'React: A JavaScript library for building user interfaces',
      'Angular: An application design framework and development platform for creating efficient and sophisticated single-page apps'
    ];
    let rows = [];
    let handler = (char) => {
      rows = computeRow();
      clear();
      if (char === '\u0003'){
        process.exit();
      }else if (char === '\r') {
        resolve(items[position]);
        stdout.write('\033[?25h');
        stdin.off('data', handler);
      } else {
        position = select(char, position, rows.length - 1);
        display(items, position);
      }
    }

    let select = (char, p, limit) => {
      if (char === '\u001b\u005b\u0041' && p > 0) { // up
        return p - 1;
      }
      if (char === '\u001b\u005b\u0042' && p < limit) { // down
        return p + 1;
      }
      // if (char === '\u001b\u005b\u0044') {
      //   moveCursor('left', 1);
      // }
      // if (char === '\u001b\u005b\u0043') {
      //   moveCursor('right', 1);
      // }

      return p;
    }

    let moveCursor = (type, offset = '') => {
      if (type === 'up') {
        stdout.write(`${'\033'}[${offset}A`);
      }
      if (type === 'down') {
        stdout.write(`${'\033'}[${offset}B`)
      }
      if (type === 'left') {
        stdout.write(`${'\033'}[${offset}D`)
      }
      if (type === 'right') {
        stdout.write(`${'\033'}[${offset}C`)
      }
    }

    let display = (items, position = 0) => {
      for (let i = 0; i < items.length; i++) {
        stdout.write((i === position ? '-> ' : '   ') + items[i]);
        stdout.write('\n');
      }
      let height = rows.reduce((acc, cur) => acc + cur, 0);
      let curP = rows.slice(0, position).reduce((acc, cur) => acc + cur, 0);
      moveCursor('up', height - curP);
    }

    let clear = () => {
      let height = rows.reduce((acc, cur) => acc + cur, 0);
      let curP = rows.slice(0, position).reduce((acc, cur) => acc + cur, 0);
      moveCursor('down', height - curP);
      for (let i = 0; i < height; i++) {
        moveCursor('up');
        stdout.write('\33[K');
      }
    }

    let computeRow = () => {
      let screenWidth = stdout.getWindowSize()[0];
      return items.map(v => Math.floor((v.length + 3) / screenWidth) + 1);
    }

    stdout.write('\033[?25l');
    rows = computeRow();
    display(items);

    stdin.on('data', handler);
  });
} 
