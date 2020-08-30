const https = require('https');
const qs = require('querystring');

const authConfig = {
  client_id: 'Iv1.b7d36743a4eab25a',
  client_secret: '',
  code: '',
  state: ''
};

async function getToken(code, state) {
  const option = {
    hostname: 'github.com',
    path: '/login/oauth/access_token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
  }

  const postData = qs.stringify(Object.assign(authConfig, {
    code, state
  }));
  return await new Promise(resolve => {
    const req = https.request(option, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk
      })
      res.on('end', () => {
        let token = {};
        try {
          token = qs.parse(data);
        } catch (error) {
          console.log(error)
        }
        resolve(token.access_token)
      })
    });
    req.write(postData)
    req.end()
  })
}

async function getUserInfo(token) {
  const option = {
    hostname: 'api.github.com',
    path: '/user',
    method: 'GET',
    headers: {
      'Authorization': `token ${token}`,
      'User-Agent': `ta9xy`
    }
  }
  return await new Promise((resolve, reject) => {
    const req = https.request(option, res => {
      let data = '';
      res.on('data', chunk => {
        data += chunk
      })
      res.on('end', () => {
        let result = {};
        try {
          result = JSON.parse(data);
        } catch (error) {
          console.log(error)
        }
        resolve(result)
      })
    })
    req.on('error', (e) => {
      console.log(e)
      reject(e);
    })
    req.end()
  })
}

module.exports = {
  getToken,
  getUserInfo
}
