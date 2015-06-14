requirejs.config({
  baseUrl: 'bower_components',
  paths: {
    lodash: 'lodash/lodash.min',
    jquery: 'jquery/dist/jquery.min'
  }
});


define(['jquery', 'lodash'], function ($, _) {

  var RADIUS = 50;
  var ALPHA = 0.3;

  var PATHS = [
    new Path2D(regularPolygonePath(3, RADIUS)),
    new Path2D(regularPolygonePath(4, RADIUS, 45)),
    new Path2D(regularPolygonePath(5, RADIUS)),
    new Path2D(regularPolygonePath(6, RADIUS)),
  ];

  var COLORS = [
    [0x00, 0x00, 0x00], // black
    [0x80, 0x80, 0x80], // gray
    [0xff, 0xff, 0xff], // white
    [0xff, 0x00, 0x00], // red
    [0xff, 0x97, 0x00], // orange
    [0xff, 0xff, 0x00], // yellow
    [0x00, 0xff, 0x00], // green
    [0x00, 0x00, 0xff], // blue
    [0x75, 0x09, 0x91], // purple
    [0xff, 0x40, 0xC4], // pink
  ];

  var scale = 1;
  var currentPath = null;

  var ctx = configureCanvasContext('#paintarea');
  setColor(ctx, COLORS[4], ALPHA);
  setPath(PATHS[3]);

  ctx.canvas.addEventListener('mousemove', function(evt) {
    var pos = getMousePos(ctx.canvas, evt);
    ctx.resetTransform();
    ctx.transform(scale, 0, 0, scale, pos.x, pos.y);
    ctx.fill(currentPath);
  }, false);

  function getMousePos(canvas, evt) {
    var rect = ctx.canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  function setColor(ctx, color, alpah) {
    var rgba = color.slice(0);
    rgba.push(alpah);
    ctx.fillStyle = 'rgba(' + rgba + ')';
    console.log("ctx.fillStyle", ctx.fillStyle);
  }

  function setPath(path) {
    currentPath = path;
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

  function regularPolygonePath(sides, radius, offsetDegrees) {
    return pathPoints(pattern(sides, true), regularPolygone(sides, radius, offsetDegrees));
  }

  function pattern(count, closed) {
    var pattern = '';
    for (var i = 0; i < count; ++i) {
      pattern += (i == 0 ? 'M' : 'L') + ' P' + i + ' ';
    }
    return pattern + (closed ? 'z' : '');
  }

  function regularPolygone(sides, radius, offsetDegrees) {
    var offset = (offsetDegrees || -90) / 180 * Math.PI;
    var step = Math.PI * 2 / sides;
    var points = [];

    for (var angle = 0; angle < Math.PI * 2; angle += step) {
      points.push({
        x: radius * Math.cos(angle + offset),
        y: radius * Math.sin(angle + offset)
      });
    }

    return points;
  }

  function pathPoints(pattern, points) {
    return points.reduce(function(acc, point, i) {
      return acc.replace('P' + i, point.x + ' ' + point.y);
    }, pattern);
  }
});
