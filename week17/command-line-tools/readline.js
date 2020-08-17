const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('project name? (default) ', (answer) => {
  console.log(`project name: ${answer || 'default'}`);

  rl.close();
});