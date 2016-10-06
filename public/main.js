

var pictionary = function() {
    var guessBox;
    var socket = io();
    var canvas, context;
    var drawing;
    var isDrawer;
    var interval;
    var randomWordFromServer;
    var onKeyDown = function(event) {
              if (event.keyCode != 13) { // Enter
                  return;
              }
              var guessValue = guessBox.val();
              socket.emit('guessBox', guessValue);
              if (guessBox.val() == randomWordFromServer){
                alert('winner');
              }
              guessBox.val('');

            };
    var draw = function(position) {
        context.beginPath();
        context.arc(position.x, position.y,
                         6, 0, 2 * Math.PI);
        context.fill();
    };
    guessBox = $('#guess input');
    guessBox.on('keydown', onKeyDown);
    canvas = $('canvas');
    context = canvas[0].getContext('2d');
    canvas[0].width = canvas[0].offsetWidth;
    canvas[0].height = canvas[0].offsetHeight;
    canvas.mousedown(function(){
        drawing = true;
        interval = setInterval(function(){
          mouseIsDown(drawing);
        }, 50);
    }).mouseup(function(){
        clearInterval(interval);
        drawing = false;
        canvas.off('mousemove');

    });
    function mouseIsDown(drawing){
          if (drawing && isDrawer){
              canvas.on('mousemove', function(event) {
                  var offset = canvas.offset();
                  var position = {x: event.pageX - offset.left,
                                  y: event.pageY - offset.top};
                  draw(position);
                  socket.emit('draw', position);
              });
            }
        }
    socket.on('randomWordGen', function(randomWord){
          randomWordFromServer = randomWord;
        });
    socket.on('draw', draw);
    socket.on('incomingGuess', function(guessValue){
      $('#guesses').append('<p>'+guessValue+'</div>');
      console.log(guessValue);
    });
    socket.on('count', function(clientCount){
      if (clientCount == 1){
        isDrawer = true;
        $('#guess').hide();
        $('#top-message').append('<div><h3>You are the drawer</h3></div><div>Your word is: ' + randomWordFromServer);
      }
    });

};


$(document).ready(function() {
    pictionary();
});
