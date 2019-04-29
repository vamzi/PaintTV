//
// # SimpleServer
//
// A simple chat server using Socket.IO, Express, and Async.
//
var http = require('http');
var path = require('path');
const fs = require('fs');
var async = require('async');
var socketio = require('socket.io');
var express = require('express');
var ss = require('socket.io-stream'); ss.forceBase64 = true;
var sleep = require('sleep');
//
// ## SimpleServer `SimpleServer(obj)`
//
// Creates a new instance of SimpleServer with the following options:
//  * `port` - The HTTP port to listen on. If `process.env.PORT` is set, _it overrides this value_.
//
var router = express();
var server = http.createServer(router);
var io = socketio.listen(server);
 var captcha = require('node-captcha');

//routing paths start
//var engines = require('consolidate');
router.set('view engine', 'jade');

router.use(express.static(path.resolve(__dirname, 'client')));
router.get('/paint', function (req, res) {
  res.sendfile('views/paint.html', {root: __dirname+'/client/' });
 
});
router.get('/view', function (req, res) {
  res.sendfile('views/viewpaint.html', {root: __dirname+'/client/' });
 
});
router.get('/vid', function (req, res) {
  res.sendfile('views/vid.html', {root: __dirname+'/client/' });
 
});
router.get('/captcha',function (req,res) {
 var options = {"fileMode" : 2,
   "size" : 4,
   "noise" : true,
   "complexity" : 4 ,
   "height" : 250,
   "width" : 500,
 }
   captcha(options,function(text, data){
    res.end(data);
  });
  
});
router.get('/images/:fname',function(req,res){
  var file_name=req.params.fname;
  console.log("REQ: "+file_name);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'image/jpeg')
  //res.writeHead(200, {'Content-Type': 'image/jpeg' });
  res.sendfile('ImagesUploaded/'+file_name,{root: __dirname+'/client/' });
});
var messages = [];
var sockets = [];

io.sockets.on('connection', function (socket) {
console.log(socket.id);
sockets.push(socket.id);
  socket.on('pptspush', function (data) {
    broadcast('pptsdown',data);
   // console.log(data);
  });
    socket.on('strokepush', function (data) {
    broadcast('strokedown',data);
    console.log(data);
  });
  socket.on('strokepush', function (data) {
    broadcast('strokedown',data);
    console.log(data);
  });
  socket.on('clearcanvas', function (data) {
    broadcast('clrcd',data);
    console.log(data);
  });
    socket.on('canvasbg', function (data) {
    console.log(data);
  });
   ss(socket).on('file', function(stream,data) {
   stream.pipe(fs.createWriteStream('client/ImagesUploaded/'+data.name));
  sleep.sleep(5);
   broadcast('file-down',data);

  

  });
});

//routing paths end
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function(){
  var addr = server.address();
  console.log("Server running at", addr.address + ":" + addr.port);
});

function broadcast(event, data) {
  sockets.forEach(function (socket) {
    io.sockets.to(socket).emit(event, data);
  });
}
 