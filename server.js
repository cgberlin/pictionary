var http = require('http');
var express = require('express');
var socket_io = require('socket.io');
var $ = require('jquery');
var clientCount = 0;
var words = [
"word", "letter", "number", "person", "pen", "class", "people",
"sound", "water", "side", "place", "man", "men", "woman", "women", "boy",
"girl", "year", "day", "week", "month", "name", "sentence", "line", "air",
"land", "home", "hand", "house", "picture", "animal", "mother", "father",
"brother", "sister", "world", "head", "page", "country", "question",
"answer", "school", "plant", "food", "sun", "state", "eye", "city", "tree",
"farm", "story", "sea", "night", "day", "life", "north", "south", "east",
"west", "child", "children", "example", "paper", "music", "river", "car",
"foot", "feet", "book", "science", "room", "friend", "idea", "fish",
"mountain", "horse", "watch", "color", "face", "wood", "list", "bird",
"body", "dog", "family", "song", "door", "product", "wind", "ship", "area",
"rock", "order", "fire", "problem", "piece", "top", "bottom", "king",
"space"
  ];
var randomWord = words[Math.floor(Math.random()*words.length)];
var app = express();
app.use(express.static('public'));

var server = http.Server(app);
var io = socket_io(server);

io.on('connection', function (socket) {
    clientCount++;
    io.sockets.emit('randomWordGen', randomWord);
    console.log('connected a client' + ' ' + clientCount);
    io.sockets.emit('count', clientCount);

    socket.on('draw', function(position){
      socket.broadcast.emit('draw', position);
    });
    socket.on('guessBox', function(guessValue){
      socket.broadcast.emit('incomingGuess', guessValue);
    });
    socket.on('disconnect', function(socket){
      clientCount--;
      console.log('Client disconnected ' + clientCount + ' still connected');
    });
});


server.listen(process.env.PORT || 8080);
console.log('launching server on 8080 now!>>>>>>>>>>>');
