const http = require('http');
const path = require('path');
const readline = require('readline');

let GAToken = '';
const serverOption = {
  port: 9901,
  host: '127.0.0.1'
};

(async function() {
  if (!GAToken) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });
    
    GAToken = await new Promise(resolve => {
      rl.question('please enter github token: ', resolve);
    });
    rl.close();
    if (!GAToken.trim()) {
      process.stdout.write('require github token. https://docs.github.com/en/developers/apps/about-apps#personal-access-tokens');
      process.exit();
    }
  }
  
  const archiver = require('archiver');
  
  function getPath(relativePath) {
    const basePath = process.cwd();
    return path.join(basePath, relativePath || '');
  }
  
  const packageInfo = require(getPath('./package.json'));
  
  let filename = `${packageInfo.name}.zip`;
  const archive = archiver('zip', {
    zlib: { level: 9 }
  });
  archive.directory(getPath('dist/'), false);
  archive.finalize();
  
  const options = Object.assign({}, serverOption, {
    method: 'POST',
    path: `/upload?filename=${filename}`,
    headers: {
      'Content-Type': 'application/octet-stream',
      'Cookie': `token=${GAToken}`
    }
  });
  
  const req = http.request(options, (res) => {
    res.setEncoding('utf8');
    let resText = '';
    res.on('data', (chunk) => {
      resText += chunk;
    });
    res.on('end', () => {
      process.stdout.write(resText);
    })
  });
  
  archive.pipe(req);
  archive.on('end', () => {
    req.end();
  });
})()
