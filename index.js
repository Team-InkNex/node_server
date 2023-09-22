const http = require('http');
const fs=require('fs');
const hostname = '127.0.0.1';
const port = 3000;
 
const server = http.createServer(function(req, res) {
  res.statusCode = 200;
  res.writeHead(200,{'Content-Type':'text/html'})
  fs.readFile('index.html',function(error,data){
    if(error)
    {
        res.write("error, file not found");
    }
    else
    {
      res.write(data);
    }
  
  //res.write('Hello World!');
  res.end();
})
})
