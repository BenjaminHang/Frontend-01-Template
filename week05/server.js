const http = require('http');

const server = http.createServer((req, res) => {
  console.log('request received!');
  console.log(req.headers);
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Transfer-Encoding', 'chunked');
  res.end(`<html maaa=a >
<head>
    <style>
body>div>#myid.img-class[title=imgTitle]{
    width:100px;
    background-color: #ff5000;
}
body div img{
    width:30px;
    background-color: #ff1111;
}
    </style>
</head>
<body>
    <div>
        <img id="myid" class="img-class" title="imgTitle" style="width:200px"/>
        <img />
    </div>
</body>
</html>`);
});

server.listen(8088);


