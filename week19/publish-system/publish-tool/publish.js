const http = require('http');
const querystring = require('querystring');
const fs = require('fs');
const path = require('path');

const archiver = require('archiver');

// const postData = querystring.stringify({
//   'msg': 'Hello World!'
// });

let filename = 'package.zip'; // 'cat.jpg'
const archive = archiver('zip', {
  zlib: { level: 9 } // Sets the compression level.
});
archive.directory('package/', false);
archive.finalize();

const options = {
  port: 9901,
  host: '127.0.0.1',
  method: 'POST',
  path: `/?filename=${filename}`, //1.html',
  headers: {
    'Content-Type': 'application/octet-stream' ,// x-www-form-urlencoded',
    // 'Content-Length': Buffer.byteLength(postData)
  }
};

const req = http.request(options, (res) => {
  console.log(`STATUS: ${res.statusCode}`);
  console.log(`HEADERS: ${JSON.stringify(res.headers)}`);
  res.setEncoding('utf8');
  res.on('data', (chunk) => {
    console.log(`BODY: ${chunk}`);
  });
  res.on('end', () => {
    console.log('No more data in response.');
  })
});

// // req.write(postData);
archive.pipe(req);
// let readStream = fs.createReadStream(path.resolve(__dirname, filename))
// readStream.pipe(req);
archive.on('end', () => {
  req.end();
});

