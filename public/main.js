

var pictionary = function() {
    var guessBox;
    var onKeyDown = function(event) {
              if (event.keyCode != 13) { // Enter
                  return;
              }
              var guessValue = guessBox.val();
              socket.emit('guessBox', guessValue);
              guessBox.val('');
            };
    var socket = io();
    var canvas, context;
    var drawing;
    var interval;
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
          if (drawing){
              canvas.on('mousemove', function(event) {
                  var offset = canvas.offset();
                  var position = {x: event.pageX - offset.left,
                                  y: event.pageY - offset.top};
                  draw(position);
                  socket.emit('draw', position);
              });
            }
        }
    socket.on('draw', draw)
    socket.on('incomingGuess', function(guessValue){
      $('#guesses').append('<p>'+guessValue+'</div>');
      console.log(guessValue);
    });
};


$(document).ready(function() {
    pictionary();
});
