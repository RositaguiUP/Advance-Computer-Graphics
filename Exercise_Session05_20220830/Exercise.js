// varying -> is going to be changed between shaders
var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_FragColor;
  void main() {
    gl_Position = a_Position;
    v_FragColor = a_Color;
    gl_PointSize = 10.0;
  }`;

var FSHADER_SOURCE = `
  precision mediump float;
  varying vec4 v_FragColor;
  void main(){
    gl_FragColor = v_FragColor;
  }`;

function main() {
  var canvas = document.getElementById("webgl");

  window.addEventListener(
    "keydown",
    function onKeyUp(event) {
      changeDeep(event);
    },
    false
  );

  var gl = getWebGLContext(canvas);

  if (!gl) {
    console.log("Failed to get the WebGL context");
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to initialize shaders");
    return;
  }

  canvas.onclick = function (ev) {
    click(ev, gl, canvas);
  };
  canvas.oncontextmenu = function (ev) {
    rightclick(ev, gl);
    return false;
  };

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
}

function rightclick(ev, gl) {
  index++;
}

function initVertexBuffers(gl, vertices, colors) {
  var n = vertices.length;
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get location of a_Position");
    return;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);

  var a_Color = gl.getAttribLocation(gl.program, "a_Color");
  if (!a_Color < 0) {
    console.log("Failed to get location of a_Color");
    return;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Color);

  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);

  return n;
}

var index = 0;
var g_points = [];
var g_colors = [];
var deep = 0;
function click(ev, gl, canvas) {
  var x = ev.clientX;
  var y = ev.clientY;
  var z = deep;
  var rect = ev.target.getBoundingClientRect();

  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  if (g_points.length <= index) {
    var arrayPoints = [];
    g_points.push(arrayPoints);
    var arrayColors = [];
    g_colors.push(arrayColors);
  }

  g_points[index].push(x);
  g_points[index].push(y);
  g_points[index].push(z);

  g_colors[index].push(Math.random());
  g_colors[index].push(Math.random());
  g_colors[index].push(Math.random());

  gl.clear(gl.COLOR_BUFFER_BIT);
  for (var i = 0; i < g_points.length; i++) {
    var n =
      initVertexBuffers(
        gl,
        new Float32Array(g_points[i]),
        new Float32Array(g_colors[i])
      ) / 3;
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
  }
}

function changeDeep(event) {
  if (event.shiftKey) {
    if (deep > -1) {
      deep -= 0.1;
    }
  } else if (event.ctrlKey) {
    if (deep < 1) {
      deep += 0.1;
    }
  }
}
