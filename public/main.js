

var pictionary = function() {
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
        canvas.unbind('mousemove');
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
};


$(document).ready(function() {
    pictionary();
});
