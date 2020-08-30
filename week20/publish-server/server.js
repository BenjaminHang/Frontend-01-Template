const fs = require('fs');
const path = require('path');

const express = require('express');
const multiparty = require('multiparty');
const unzipper = require('unzipper');
const il = require('iconv-lite');

const { getToken, getUserInfo } = require('./auth.js');

const app = express();

const port = 9901;
const serverURL = `http://localhost:${port}`;

const redirect_url = `https://github.com/login/oauth/authorize?client_id=Iv1.b7d36743a4eab25a&redirect_uri=${encodeURIComponent(serverURL)}&state=123456&login=xy`;

app.use('/', (req, res, next) => {
  let cookie = {}
  req.headers.cookie.split(';').forEach(item => {
    const [, key, value] = item.trim().match(/([^=]+)=([^]*)/)
    cookie[key] = value
  })
  req.cookie = cookie
  next()
})

app.use('/', async (req, res, next) => {
  let token = req.cookie.token;
  let { code, state } = req.query;
  if (!token) {
    if (!code || !state) {
      return res.redirect(redirect_url);
    } else {
      token = await getToken(code, state);
      req.cookie.token = token;
    }
  }
  try {
    let userInfo = await getUserInfo(token);
    if (userInfo.name) {
      res.cookie('token', token);
      next();
    } else {
      throw new Error('Authorization failed')
    }
  } catch (error) {
    res.clearCookie('token');
    res.redirect(redirect_url);
  }
})

const basedir = path.resolve(__dirname, '../../week19/publish-system/server/public');

app.use('/upload', (req, res, next) => {
  console.log(req.query.filename)
  if (req.headers["content-type"].includes('multipart/form-data')) {
    let form = new multiparty.Form();
    form.parse(req, function (err, fields, files) {
      Promise.all(files.file.map(file => {
        return new Promise(resolve => {
          let readStream = fs.createReadStream(file.path);
          let writeStream = null;
          if (file.originalFilename.match(/\.zip$/)) {
            writeStream = unzipper.Parse(); // unzipper.Extract({ path: basedir });
          } else {
            writeStream = fs.createWriteStream(path.join(basedir, file.originalFilename))
          }
          readStream.pipe(writeStream).on('entry', function (entry) {
            // if some legacy zip tool follow ZIP spec then this flag will be set
            const isUnicode = entry.props.flags.isUnicode;
            // decode "non-unicode" filename from OEM Cyrillic character set
            const fileName = isUnicode ? entry.path : il.decode(entry.props.pathBuffer, 'utf8'); // GBK
            if (/^__MACOSX\//.test(fileName)) {
              return entry.autodrain();
            }
            const filePath = path.join(basedir, fileName)
            if (entry.type === 'File') {
              entry.pipe(fs.createWriteStream(filePath));
            } else if (entry.type === 'Directory') {
              if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath);
              }
            } else {
              entry.autodrain();
            }
          });
          readStream.on('end', () => {
            resolve('end')
          })
        })
      })).then(() => {
        res.send('publish success');
      })
    })
  } else {
    req.pipe(unzipper.Extract({ path: basedir }));
    req.on('end', (err) => {
      res.send('publish success');
    })
  }
});

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', (req, res, next) => {
  res.redirect('/index.html');
})

app.listen(port);
