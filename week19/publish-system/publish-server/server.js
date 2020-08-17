const fs = require('fs');
const path = require('path');

const express = require('express');
const unzipper = require('unzipper');

const app = express();

const basedir = path.resolve(__dirname, '../server/public');

app.use('/', (req, res, next) => {
  console.log(req.query.filename)
  // let writeStream = fs.createWriteStream(path.join(basedir, req.query.filename));
  // req.pipe(writeStream);
  req.pipe(unzipper.Extract({ path: basedir}));
  req.on('end', (err) => {
    res.send('hello world');
  })
});

app.listen(9901);
