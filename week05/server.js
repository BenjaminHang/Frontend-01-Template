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
.flex-box {
    display: flex;
    width: 120px;
    flexWrap: wrap;
    background-color: rgb(0,100,200);
}
.flex-1 {
    width: 100px;
    height: 20px;
    background-color: rgb(0,100,50);
}
.flex-2 {
    width: 50px;
    height: 40px;
    background-color: rgb(100,50,0);
}
.flex-3 {
    width: 75px;
    height: 10px;
    background-color: rgb(50,0,100);
}
    </style>
</head>
<body>
    <div>
        <img id="myid" class="img-class" title="imgTitle" style="width:200px"/>
        <img />
    </div>
    <div class="flex-box">
        <div class="flex-1"></div>
        <div class="flex-2"></div>
        <div class="flex-3"></div>
    </div>
</body>
</html>`);
});

server.listen(8088);


