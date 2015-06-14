requirejs.config({
  baseUrl: 'bower_components',
  paths: {
    lodash: 'lodash/lodash.min',
    jquery: 'jquery/dist/jquery.min'
  }
});


define(['jquery', 'lodash'], function ($, _) {

  var RADIUS = 0.5;
  var ALPHA = 0.3;
  var AUDIO_BASE_URL = 'resources/sounds/';
  var AUDIO_EXT = '.wav';

  var SHAPES = [
    {name: 'triangle', path: new Path2D(regularPolygonePath(3, RADIUS))},
    {name: 'square',   path: new Path2D(regularPolygonePath(4, RADIUS, 45))},
    {name: 'pentagon', path: new Path2D(regularPolygonePath(5, RADIUS))},
    {name: 'hexagon',  path: new Path2D(regularPolygonePath(6, RADIUS))},
  ];

  var COLORS = [
    {name: 'black',  rgb: [0x00, 0x00, 0x00]},
    {name: 'gray',   rgb: [0x80, 0x80, 0x80]},
    {name: 'white',  rgb: [0xff, 0xff, 0xff]},
    {name: 'red',    rgb: [0xff, 0x00, 0x00]},
    {name: 'orange', rgb: [0xff, 0x97, 0x00]},
    {name: 'yellow', rgb: [0xff, 0xff, 0x00]},
    {name: 'green',  rgb: [0x00, 0xff, 0x00]},
    {name: 'blue',   rgb: [0x00, 0x00, 0xff]},
    {name: 'purple', rgb: [0x75, 0x09, 0x91]},
    {name: 'pink',   rgb: [0xff, 0x40, 0xC4]},
  ];

  var scale = 80;
  var currentShape = SHAPES[3];
  var currentColor = COLORS[3];
  var backgroundColor = COLORS[2];
  var altBackgroundColor = COLORS[1];
  var toolWidth = null;
  var colorHeight = null;
  var shapeHeight = null;

  var aCtx = new AudioContext();

  loadSounds(aCtx);

  function loadSounds(aCtx) {
    if (!aCtx) {
      console.warn("Audio Not Supported.");
      return;
    }

    loadSound(aCtx, AUDIO_BASE_URL + 'welcome' + AUDIO_EXT, {name: 'wecome'}, function(d) {
      playSound(aCtx, d.audio);
    });

    SHAPES.forEach(function(shape) {
      loadSound(aCtx, AUDIO_BASE_URL + shape.name + AUDIO_EXT, shape);
    });

    COLORS.forEach(function(color) {
      loadSound(aCtx, AUDIO_BASE_URL + color.name + AUDIO_EXT, color);
    });

  }

  function loadSound(aCtx, url, destination, callback) {
    var request = new XMLHttpRequest();
    request.open('GET', url, true);
    request.responseType = 'arraybuffer';
    destination.audio = null;

    // Decode asynchronously

    request.onload = function() {
      aCtx.decodeAudioData(request.response, function(buffer) {
        destination.audio = buffer;
        if (callback) {
          callback(destination);
        }
      }, function(error) {
        console.error("error loading: ", url);
      });
    };

    request.send();
  }

  function playTool(tool) {
    if (aCtx && tool.audio) {
      playSound(aCtx, tool.audio);
    }
  }

  function playSound(aCtx, buffer) {
    var source = aCtx.createBufferSource();
    source.buffer = buffer;
    source.connect(aCtx.destination);
    source.start(0);
  }

  var ctx = configureCanvasContext('#paintarea');
  setColor(ctx, currentColor, ALPHA);

  ctx.canvas.addEventListener('mousemove', function(evt) {
    var pos = getMousePos(ctx.canvas, evt);
    if (!isTool(ctx, pos)) {
      setPostion(ctx, scale, pos.x, pos.y);
      ctx.fill(currentShape.path);
    }
  }, false);

  function isTool(ctx, pos) {
    var width = ctx.canvas.width;
    var height = ctx.canvas.height;

    if (pos.x < toolWidth) {
      var newColor = COLORS[Math.floor(pos.y / colorHeight)];
      if (newColor != currentColor) {
        setColor(ctx, currentColor = newColor, ALPHA);
        playTool(currentColor);
        render(ctx);
      }
      return true;
    }

    if (pos.x > width - toolWidth) {
      var newShape = SHAPES[Math.floor(pos.y / shapeHeight)];
      if (newShape != currentShape) {
        currentShape = newShape;
        playTool(currentShape);
        render(ctx);
      }
      return true;
    }

    return false;
  }

  function setPostion(ctx, scale, x, y) {
    ctx.resetTransform();
    ctx.transform(scale, 0, 0, scale, x, y);
  }

  function getMousePos(canvas, evt) {
    var rect = ctx.canvas.getBoundingClientRect();
    return {
      x: evt.clientX - rect.left,
      y: evt.clientY - rect.top
    };
  }

  function setColor(ctx, color, alpha) {
    var rgba = color.rgb.slice(0);
    rgba.push(alpha);
    ctx.fillStyle = 'rgba(' + rgba + ')';
  }

  function render(ctx) {

    ctx.restore();
    ctx.save();

    // establish width and height

    var width = ctx.canvas.width;
    var height = ctx.canvas.height;

    // decide how wide the tools should be

    toolWidth = height / COLORS.length;

    // render colors

    colorHeight = toolWidth;
    COLORS.forEach(function(color, i) {
      setColor(ctx, color, 1);
      ctx.fillRect(0, i * toolWidth, toolWidth, toolWidth);
    });

    // render shapes

    setColor(ctx, currentColor == backgroundColor ? altBackgroundColor : backgroundColor, 1);
    ctx.fillRect(width - toolWidth, 0, toolWidth, height);

    shapeHeight = height / SHAPES.length;
    var shapeX = width - toolWidth / 2;
    SHAPES.forEach(function(shape, i) {
      setColor(ctx, currentColor, shape == currentShape ? 1 : 0.3);
      setPostion(ctx, toolWidth * .75, shapeX, (i + 0.5) * shapeHeight);
      ctx.fill(shape.path);
    });

    // set clip

    ctx.resetTransform();
    ctx.rect(toolWidth,0, width - toolWidth * 2, height);
    ctx.clip();
    setColor(ctx, currentColor, ALPHA);
  }

  function configureCanvasContext(elementSelector, type, options) {
    var canvas = $(elementSelector).get(0);
    var ctx = canvas.getContext(type || '2d', options);
    ctx.save();
    var sizeCanvas = function() {
      canvas.width = canvas.clientWidth;
      canvas.height = canvas.clientHeight;
      render(ctx);
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
