## 学习方法

### 前端技能模型

  * 编程能力
  * 架构能力
  * 工程能力
  * 前端知识

### 整理法 和 追溯法

## 构建知识体系

搜集，整理，思考，输出

## 工程体系

规范，工具，组件，架构

### 解析 url

```javascript
const parseUrl = url => {
  let queries = [];
  let searchObject = {};
  const parser = document.createElement('a');

  parser.href = url;
  parser.search.replace(/^\?/, '').split('&').forEach((query) => {
    const split = query.split('=');
    searchObject[split[0]] = split[1];
  });

  return {
    protocol: parser.protocol,
    host: parser.host,
    hostname: parser.hostname,
    port: parser.port,
    pathname: parser.hostname,
    search: parser.search,
    searchObject,
    hash: parser.hash,
  }
}
```