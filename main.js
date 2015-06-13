requirejs.config({
  baseUrl: 'bower_components',
  paths: {
    lodash: 'lodash/lodash.min',
    jquery: 'jquery/dist/jquery.min'
  }
});


define(['jquery', 'lodash'], function ($, _) {

  var ctx = configureCanvasContext('#paintarea');
  var path = new Path2D("M -50 -50 h 100 v 100 h -100 Z");
  ctx.fillStyle = "rgba(0, 0, 200, 0.2)";

  console.log("ctx", ctx);

  ctx.canvas.addEventListener('mousemove', function(evt) {
    var pos = getMousePos(ctx.canvas, evt);
    ctx.resetTransform();
    ctx.transform(.2, 0, 0, .2, pos.x, pos.y);
    ctx.fill(path);
  }, false);

  function getMousePos(canvas, evt) {
    var rect = ctx.canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  function configureCanvasContext(elementSelector, type, options) {
    var canvas = $(elementSelector).get(0);
    var ctx = canvas.getContext(type || '2d', options);
    var sizeCanvas = function() {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
    };

    $(window).resize(_.debounce(sizeCanvas, 25));
    sizeCanvas();

    return ctx;
  }
});
