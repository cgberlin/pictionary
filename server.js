var http = require('http');
var express = require('express');
var socket_io = require('socket.io');
var clientCount = 0;

var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

io.on('connection', function (socket) {
    clientCount++;
    socket.broadcast.emit('clientCount', clientCount);
    console.log('connected a client' + ' ' + clientCount);
    socket.on('draw', function(position){
      socket.broadcast.emit('draw', position);
    });
    socket.on('guessBox', function(guessValue){
      socket.broadcast.emit('incomingGuess', guessValue);
    });
});
io.on('disconnect', function(socket){
  console.log("client disconnect");
});

server.listen(process.env.PORT || 8080);
console.log('launching server on 8080 now!>>>>>>>>>>>');
