requirejs.config({
  baseUrl: 'bower_components',
  paths: {
    lodash:     'lodash/lodash.min',
    jquery:     'jquery/dist/jquery.min',
    jqueryUi:   'jquery-ui/jquery-ui.min',
    touchPunch: 'jqueryui-touch-punch/jquery.ui.touch-punch.min'
  },
  shim: {
    touchPunch: {deps: ['jqueryUi']},
    jqueryUi:   {deps: ['jquery']}
  }
});

define(['jquery', 'lodash'], function ($, _) {

  var RADIUS = 0.5;
  var ALPHA = 0.3;
  var AUDIO_BASE_URL = 'resources/sounds/';
  var AUDIO_EXT = '.wav';
  var FIXED_SHAPES = {
    circle: 'M-0.5,0a0.5,0.5 0 1,0 1,0a0.5,0.5 0 1,0 -1,0',
    heart: 'm -0.41421845,-0.37130752 a 0.29290498,0.29288649 35.614596 0 0 0,0.41419994 L -4.1384716e-8,0.45709242 0.41421845,0.04289242 a 0.29290498,0.29288649 35.614596 0 0 0,-0.41419994 0.29290498,0.29288649 35.614596 0 0 -0.414218491384716,0 0.29290498,0.29288649 35.614596 0 0 -0.414218408615284,0 z',
    star: 'M 1.3397448e-8,-0.5 0.11226698,-0.15452225 0.47552826,-0.15450848 0.18165179,0.05902225 0.29389262,0.40450851 0,0.191 l -0.29389264,0.21350849 0.11224085,-0.34548624 -0.29387646,-0.21353076 0.36326127,-1.374e-5 z',
    doggy: 'm -0.282255,-0.35623482 a 0.12694601,0.25058129 21.712395 0 0 -0.20167,0.2373 0.12694601,0.25058129 21.712395 0 0 0.0664,0.23778 0.12694601,0.25058129 21.712395 0 0 0.20119,-0.23778 0.12694601,0.25058129 21.712395 0 0 -0.0659,-0.2373 z m 0.5645,0 a 0.25058129,0.12694601 68.287605 0 0 -0.0659,0.2373 0.25058129,0.12694601 68.287605 0 0 0.20118,0.23778 0.25058129,0.12694601 68.287605 0 0 0.0664,-0.23778 0.25058129,0.12694601 68.287605 0 0 -0.20167,-0.2373 z m -0.28224999586,0.0122 a 0.30002148,0.34998644 0 0 0 -0.19191000414,0.0811 c 0.006,0.0412 0.004,0.0892 -0.0112,0.14404 -0.0191,0.0674 -0.0524,0.12854 -0.0908,0.17382 -5e-4,0.001 -0.002,0.001 -0.002,0.002 A 0.30002148,0.34998644 0 0 0 4.9500414e-4,0.35623518 0.30002148,0.34998644 0 0 0 0.296905,0.05692518 c -5e-4,-5e-4 -0.001,-0.001 -0.002,-0.002 -0.0384,-0.0453 -0.0716,-0.10644 -0.0908,-0.17382 -0.0156,-0.0548 -0.017,-0.10278 -0.0112,-0.14404 a 0.30002148,0.34998644 0 0 0 -0.1918,-0.0811 z m -0.08740000414,0.2373 c 0.0276,-7e-5 0.0504,0.0227 0.0503,0.0503 7e-5,0.0276 -0.0227,0.0503 -0.0503,0.0503 -0.0276,7e-5 -0.0504,-0.0227 -0.0503,-0.0503 -7e-5,-0.0276 0.0227,-0.0504 0.0503,-0.0503 z m 0.17482,0 c 0.0276,-7e-5 0.0504,0.0227 0.0503,0.0503 8e-5,0.0276 -0.0228,0.0503 -0.0503,0.0503 -0.0276,7e-5 -0.0504,-0.0227 -0.0503,-0.0503 -7e-5,-0.0276 0.0227,-0.0504 0.0503,-0.0503 z m -0.17482,0.0127 a 0.03750269,0.03749885 0 0 0 -0.0376,0.0376 0.03750269,0.03749885 0 0 0 0.0376,0.0376 0.03750269,0.03749885 0 0 0 0.0376,-0.0376 0.03750269,0.03749885 0 0 0 -0.0376,-0.0376 z m 0.17482,0 a 0.03750269,0.03749885 0 0 0 -0.0376,0.0376 0.03750269,0.03749885 0 0 0 0.0376,0.0376 0.03750269,0.03749885 0 0 0 0.0376,-0.0376 0.03750269,0.03749885 0 0 0 -0.0376,-0.0376 z m -0.0942,0.15039 a 0.10000537,0.09999907 0 0 1 0.007000004,0 0.10000537,0.09999907 0 0 1 0.10010999586,0.0996 0.10000537,0.09999907 0 0 1 -0.10010999586,0.1001 0.10000537,0.09999907 0 0 1 -0.10010000414,-0.1001 0.10000537,0.09999907 0 0 1 0.0933,-0.0996 z m -0.043,0.0498 0.04980000414,0.0752 0.04979999586,-0.0752 -0.0996,0 z',
    kitty: 'm -0.4634,-0.49290998 0,0.4236 a 0.49303709,0.42072605 0 0 0 -0.0295,0.1412 A 0.49303709,0.42072605 0 0 0 0,0.49290997 0.49303709,0.42072605 0 0 0 0.4929,0.07189002 a 0.49303709,0.42072605 0 0 0 -0.0295,-0.14172 l 0,-0.42308 -0.26843,0.17896 a 0.49303709,0.42072605 0 0 0 -0.19499,-0.0347 0.49303709,0.42072605 0 0 0 -0.19499,0.0347 l -0.26843,-0.17896 z m 0.31136,0.40601 a 0.09268389,0.07944454 0 0 1 0.006,0 0.09268389,0.07944454 0 0 1 0.0931,0.0791 0.09268389,0.07944454 0 0 1 -0.0931,0.0797 0.09268389,0.07944454 0 0 1 -0.0926,-0.0797 0.09268389,0.07944454 0 0 1 0.0864,-0.0791 z m 0.29119,0 a 0.09268389,0.07944454 0 0 1 0.007,0 0.09268389,0.07944454 0 0 1 0.0926,0.0791 0.09268389,0.07944454 0 0 1 -0.0926,0.0797 0.09268389,0.07944454 0 0 1 -0.0931,-0.0797 0.09268389,0.07944454 0 0 1 0.0864,-0.0791 z m -0.28757,0.0264 a 0.03972129,0.05296008 0 0 0 -0.0367,0.0528 0.03972129,0.05296008 0 0 0 0.0393,0.0533 0.03972129,0.05296008 0 0 0 0.0398,-0.0533 0.03972129,0.05296008 0 0 0 -0.0398,-0.0528 0.03972129,0.05296008 0 0 0 -0.003,0 z m 0.29016,0 a 0.03972129,0.05296008 0 0 0 -0.0357,0.0528 0.03972129,0.05296008 0 0 0 0.0398,0.0533 0.03972129,0.05296008 0 0 0 0.0393,-0.0533 0.03972129,0.05296008 0 0 0 -0.0393,-0.0528 0.03972129,0.05296008 0 0 0 -0.004,0 z m 0.22653,0.14534 a 0.01324181,0.01324208 0 0 1 0.006,0 l 0,5e-4 a 0.01324181,0.01324208 0 0 1 0.006,0.0233 0.01324181,0.01324208 0 0 1 -0.005,0.003 l -0.17844,0.0533 0.20119,0 a 0.01324181,0.01324208 0 0 1 0.001,0 0.01324181,0.01324208 0 0 1 -0.001,0.0263999 l -0.20171,0 0.17896,0.0538 a 0.0132671,0.01326737 0 0 1 -0.008,0.0253 l -0.26223,-0.0791 -0.002,0 a 0.01324181,0.01324208 0 0 1 -0.002,-4.9991e-4 0.0132526,0.01325287 0 0 1 0,-5.001e-4 0.01324548,0.01324575 0 0 1 -5e-4,0 0.01324181,0.01324208 0 0 1 -0.002,-9.9999e-4 0.0132526,0.01325287 0 0 1 -0.001,-5e-4 0.01324181,0.01324208 0 0 1 -0.001,-0.001 0.0132526,0.01325287 0 0 1 -0.001,-5e-4 0.01324181,0.01324208 0 0 1 0,-4.999e-4 0.01324181,0.01324208 0 0 1 -0.002,-0.002 0.01324548,0.01324575 0 0 1 -5e-4,-5e-4 0.01324181,0.01324208 0 0 1 0,-5e-4 0.01324548,0.01324575 0 0 1 -5e-4,-5e-4 0.01324181,0.01324208 0 0 1 0,-4.999e-4 0.01324548,0.01324575 0 0 1 -5e-4,-0.001 0.01324181,0.01324208 0 0 1 0,-5e-4 0.01324548,0.01324575 0 0 1 -5e-4,-5e-4 0.01324181,0.01324208 0 0 1 0,-5e-4 0.01324548,0.01324575 0 0 1 0,-0.001 0.01324181,0.01324208 0 0 1 0,-4.999e-4 0.01324548,0.01324575 0 0 1 0,-0.001 0.01324181,0.01324208 0 0 1 0,-5e-4 0.01324548,0.01324575 0 0 1 0,-0.001 0.01324181,0.01324208 0 0 1 0,-5e-4 0.01324548,0.01324575 0 0 1 5e-4,-9.999e-4 0.01324181,0.01324208 0 0 1 5e-4,-0.002 0.01324548,0.01324575 0 0 1 0,-5e-4 0.01324181,0.01324208 0 0 1 0,-5e-4 0.01324548,0.01324575 0 0 1 0.001,-9.999e-4 0.01324181,0.01324208 0 0 1 0.003,-0.003 0.01324548,0.01324575 0 0 1 5e-4,-5e-4 0.01324181,0.01324208 0 0 1 5e-4,-5e-4 0.01324548,0.01324575 0 0 1 0.001,-5e-4 0.01324181,0.01324208 0 0 1 0.002,-0.001 0.01324548,0.01324575 0 0 1 0.003,-5e-4 0.01324548,0.01324575 0 0 1 0.001,0 0.01324548,0.01324575 0 0 1 0.003,-5e-4 l 0.26067,-0.0781 a 0.01324181,0.01324208 0 0 1 0.001,-5e-4 z m -0.74271,5e-4 a 0.01324181,0.01324208 0 0 1 0.001,0 0.01324181,0.01324208 0 0 1 0.007,5e-4 l 0.26067,0.0781 a 0.01324548,0.01324575 0 0 1 0.003,5e-4 0.01324548,0.01324575 0 0 0 5e-4,0 0.01324548,0.01324575 0 0 1 0.003,5e-4 0.01324181,0.01324208 0 0 1 0.002,0.001 0.01324548,0.01324575 0 0 1 0.001,5e-4 0.01324181,0.01324208 0 0 0 5e-4,5e-4 0.01324548,0.01324575 0 0 0 5e-4,5e-4 0.01324181,0.01324208 0 0 1 0.003,0.003 0.01324548,0.01324575 0 0 1 0.001,9.999e-4 0.01324181,0.01324208 0 0 0 0,5e-4 0.01324548,0.01324575 0 0 0 0,5e-4 0.01324181,0.01324208 0 0 1 5e-4,0.001 0.01324548,0.01324575 0 0 1 5e-4,0.001 0.01324181,0.01324208 0 0 0 0,5e-4 0.01324548,0.01324575 0 0 1 0,9.999e-4 0.01324181,0.01324208 0 0 0 0,5e-4 0.01324548,0.01324575 0 0 0 0,5.001e-4 0.01324181,0.01324208 0 0 0 0,4.999e-4 0.01324548,0.01324575 0 0 1 0,0.001 0.01324181,0.01324208 0 0 0 0,5e-4 0.01324548,0.01324575 0 0 0 -5e-4,4.999e-4 0.01324181,0.01324208 0 0 0 0,5.1e-4 0.01324548,0.01324575 0 0 1 -5e-4,0.001 0.01324181,0.01324208 0 0 0 0,5.001e-4 0.01324548,0.01324575 0 0 0 -5e-4,4.999e-4 0.01324181,0.01324208 0 0 0 0,5e-4 0.01324548,0.01324575 0 0 0 -5e-4,5e-4 0.01324181,0.01324208 0 0 1 -0.001,0.002 0.01324181,0.01324208 0 0 0 0,5.001e-4 0.0132526,0.01325287 0 0 1 -0.001,4.999e-4 0.01324181,0.01324208 0 0 1 -10e-4,0.001 0.0132526,0.01325287 0 0 1 -0.001,5.001e-4 0.01324181,0.01324208 0 0 1 -0.002,9.999e-4 0.01324548,0.01324575 0 0 0 -5e-4,0 0.0132526,0.01325287 0 0 0 0,5e-4 0.01324181,0.01324208 0 0 1 -0.002,5.001e-4 l -0.002,0 -0.26223,0.0791 a 0.0132671,0.01326737 0 0 1 -0.008,-0.0253 l 0.17895,-0.0538 -0.20171,0 a 0.01324181,0.01324208 0 0 1 -0.002,-0.0264001 0.01324181,0.01324208 0 0 1 0.002,0 l 0.2012,0 -0.17844,-0.0533 a 0.01324181,0.01324208 0 0 1 -0.005,-0.003 0.01324181,0.01324208 0 0 1 0.005,-0.0233 z m 0.29481,0.0331 0.1593,0 -0.0797,0.11895995 -0.0797,-0.11895995 z',
    fishy: 'm 0.49999997,-0.16796375 -0.25,0.15039 c -0.45,-0.37499 -0.74999994,0.0996 -0.74999994,0.0996 0,0 0.29999995,0.47509 0.74999995,0.1001 l 0.25,0.1499 0,-0.49999 z m -0.77491,0.15039 c 0.0274,0 0.0498,0.0223 0.0498,0.0498 0,0.0275 -0.0223,0.0498 -0.0498,0.0498 -0.0275,0 -0.0503,-0.0223 -0.0503,-0.0498 0,-0.0275 0.0229,-0.0498 0.0503,-0.0498 z m 0,0.0122 a 0.03749988,0.03749883 0 0 0 -0.0376,0.0376 0.03749988,0.03749883 0 0 0 0.0376,0.0376 0.03749988,0.03749883 0 0 0 0.0376,-0.0376 0.03749988,0.03749883 0 0 0 -0.0376,-0.0376 z'
   };

  var SHAPES = [
    {name: 'triangle', path: new Path2D(regularPolygonePath(3, RADIUS))},
    {name: 'square',   path: new Path2D(regularPolygonePath(4, RADIUS, 45))},
    {name: 'pentagon', path: new Path2D(regularPolygonePath(5, RADIUS))},
    {name: 'hexagon',  path: new Path2D(regularPolygonePath(6, RADIUS))},
    {name: 'circle',   path: new Path2D(FIXED_SHAPES.circle)},
    {name: 'heart',    path: new Path2D(FIXED_SHAPES.heart)},
    {name: 'star',     path: new Path2D(FIXED_SHAPES.star)},
    {name: 'kitty',    path: new Path2D(FIXED_SHAPES.kitty)},
    {name: 'doggy',    path: new Path2D(FIXED_SHAPES.doggy)},
    {name: 'fishy',    path: new Path2D(FIXED_SHAPES.fishy)},
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
  var currentShape = SHAPES[SHAPES.length - 3];
  var currentColor = COLORS[COLORS.length - 1];
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

  ctx.canvas.addEventListener('mousemove', handleMouseMove);
  ctx.canvas.addEventListener('touchmove', handleTouchMove);

  function handleTouchMove(evt) {
    evt.preventDefault();
    paint(ctx, getMousePos(ctx.canvas, evt.changedTouches[0]));
  }

  function handleMouseMove(evt) {
    evt.preventDefault();
    paint(ctx, getMousePos(ctx.canvas, evt));
  }

  function paint(ctx, pos) {
    if (!isTool(ctx, pos)) {
      setColor(ctx, currentColor, computeAlpha(ctx, pos));
      setPostion(ctx, scale, pos.x, pos.y);
      ctx.fill(currentShape.path);
    }
  }

  function computeAlpha(ctx, pos) {
    var width = ctx.canvas.width;
    var height = ctx.canvas.height;
    var ex = pos.x < width  / 2 ? pos.x - toolWidth : (width - toolWidth) - pos.x;
    var ey = pos.y < height / 2 ? pos.y             : (height           ) - pos.y;
    var edgeDistance = Math.max(Math.min(Math.min(ex, ey), scale)  - scale / 2, 0);
    return edgeDistance / (scale / 2) * ALPHA;
  }

  function isTool(ctx, pos) {
    var width = ctx.canvas.width;
    var height = ctx.canvas.height;

    if (pos.x < toolWidth) {
      var newColor = COLORS[Math.floor(pos.y / colorHeight)];
      if (newColor != currentColor) {
        currentColor = newColor;
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
    var $canvas = $(elementSelector);
    var canvas = $canvas.get(0);
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
