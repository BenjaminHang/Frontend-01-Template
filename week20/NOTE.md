#### 无头浏览器

#### lint
* eslint

#### github OAuth

* 获取 github 用户信息

文档 https://docs.github.com/en/developers/apps/identifying-and-authorizing-users-for-github-apps

github api https://api.github.com/

1. GET https://github.com/login/oauth/authorize?client_id=Iv1.b7d36743a4eab25a&redirect_uri=http%3A%2F%2Flocalhost%3A9901&state=123456&login=xy

client_id, redirect_uri, state, login

2. POST https://github.com/login/oauth/access_token

client_id, client_secret, code, redirect_uri, state

3. GET https://api.github.com/user

headers: Authorization, User-Agent


