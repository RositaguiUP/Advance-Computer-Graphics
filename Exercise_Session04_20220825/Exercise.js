var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  void main() {
   gl_Position = a_Position;
   gl_PointSize = 10.0;
  }`;

var FSHADER_SOURCE = `
  precision mediump float;
  uniform vec4 u_FragColor;
  void main(){
   gl_FragColor = u_FragColor;
  }`;

function main() {
  var canvas = document.getElementById("webgl");
  var gl = getWebGLContext(canvas);

  if (!gl) {
    console.log("Failed to get the WebGL context");
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to initialize shaders");
    return;
  }

  canvas.onmousedown = function (ev) {
    click(ev, gl, canvas);
  };

  canvas.oncontextmenu = function (ev) {
    rightClick(ev, gl, canvas);
    return false;
  };

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

// Initializes buffer
function initVertexBuffers(gl, vertices) {
  var n = vertices.length;
  // Creates the bridge
  var vertexBuffer = gl.createBuffer();
  // Conects to the GPU
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get location of a_Position");
    return;
  }

  // Uses a_Position as a pointer
  gl.vertexAttribPointer(a_Position, 2, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  var u_FragColor = gl.getUniformLocation(gl.program, "u_FragColor");
  if (!u_FragColor) {
    console.log("Failed to get location of u_FragColor");
    return;
  }

  gl.uniform4f(u_FragColor, 1.0, 0.0, 0.5, 1.0);

  return n;
}

var g_points = [];
var clicksPerFigure = [];
var clicksCounter = 0;

function click(ev, gl, canvas, a_Position, u_FragColor) {
  var x = ev.clientX;
  var y = ev.clientY;
  var rect = ev.target.getBoundingClientRect();

  // Moves the origin to the center of the canvas
  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);
  g_points.push(x);
  g_points.push(y);

  gl.clear(gl.COLOR_BUFFER_BIT);

  clicksCounter += 2;

  var temp_g_points = [];
  var lowerLimit = 0;
  var upperlimit = 0;

  for (var i = 0; i <= clicksPerFigure.length; i++) {
    lowerLimit += i > 0 && clicksPerFigure[i - 1];
    upperlimit =
      i < clicksPerFigure.length ? clicksPerFigure[i] : clicksCounter;
    upperlimit += lowerLimit;
    // Takes the just the points that are from the actual figure
    temp_g_points = g_points.slice(lowerLimit, upperlimit);

    var n = initVertexBuffers(gl, new Float32Array(temp_g_points)) / 2;
    //gl.POINTS gl.LINES gl.LINE_STRIP gl.LINE_LOOP
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
  }
}

// Counts the total clicks when a figure is done (by rightClick)
function rightClick(ev, gl, canvas) {
  clicksPerFigure.push(clicksCounter);
  clicksCounter = 0;
}
