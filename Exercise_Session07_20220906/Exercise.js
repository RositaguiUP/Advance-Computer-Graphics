var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 v_FragColor;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjMatrix;
  void main() {
    gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
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
  var gl = getWebGLContext(canvas);

  if (!gl) {
    console.log("Failed to get the WebGL context");
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to initialize shaders");
    return;
  }

  canvas.oncontextmenu = function (ev) {
    rightclick(ev, gl);
    return false;
  };

  makeClock();

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  draw(gl);
}

var index = 0;
var g_points = [];
var g_colors = [];
var z = 0.0;
var angleMinutes = 0.0;
var angleHours = 0.0;

function rightclick(ev, gl) {
  angleMinutes -= 30.0;
  angleHours -= 2.5;
  if (angleMinutes % 360 == 0) {
    angleMinutes = 0;
  }
  if (angleHours % 360 == 0 && angleHours < 0) angleHours = 0;
  console.log("Min: " + angleMinutes + " Hrs: " + angleHours);
  draw(gl);
}

function initVertexBuffers(gl, vertices, colors, angle) {
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

  var modelMatrix = new Matrix4();

  modelMatrix.setRotate(angle, 0, 0, 1);

  var u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  if (!u_ModelMatrix) {
    console.log("Failed to get location of u_ModelMatrix");
  }
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  var viewMatrix = new Matrix4();
  viewMatrix.setLookAt(0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
  var u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
  if (!u_ViewMatrix) {
    console.log("Failed to get location of u_ViewMatrix");
  }
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  var projMatrix = new Matrix4();
  // projMatrix.setPerspective(120.0, 0.5, 0.1, 5.0);
  var u_ProjMatrix = gl.getUniformLocation(gl.program, "u_ProjMatrix");
  if (!u_ProjMatrix) {
    console.log("Failed to get location of u_ProjMatrix");
  }
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);

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

function draw(gl) {
  gl.clear(gl.COLOR_BUFFER_BIT);
  for (var i = 0; i < g_points.length; i++) {
    var angle = i == 0 ? angleMinutes : angleHours;
    var n =
      initVertexBuffers(
        gl,
        new Float32Array(g_points[i]),
        new Float32Array(g_colors[i]),
        angle
      ) / 3;
    gl.drawArrays(gl.LINES, 0, n);
  }
}

function makeClock() {
  var arrayPointsMinutes = [];
  var arrayColorsMinutes = [];

  g_points.push(arrayPointsMinutes);
  g_colors.push(arrayColorsMinutes);

  g_points[index].push(0.0);
  g_points[index].push(0.0);
  g_points[index].push(0.0);
  g_points[index].push(0.0);
  g_points[index].push(0.6);
  g_points[index].push(0.0);

  g_colors[index].push(1.0);
  g_colors[index].push(0.0);
  g_colors[index].push(0.0);
  g_colors[index].push(0.0);
  g_colors[index].push(0.0);
  g_colors[index].push(1.0);

  index++;

  var arrayPointsHours = [];
  var arrayColorsHours = [];
  g_points.push(arrayPointsHours);
  g_colors.push(arrayColorsHours);

  g_points[index].push(0.0);
  g_points[index].push(0.0);
  g_points[index].push(-0.1);
  g_points[index].push(0.0);
  g_points[index].push(0.4);
  g_points[index].push(-0.1);

  g_colors[index].push(1.0);
  g_colors[index].push(1.0);
  g_colors[index].push(1.0);
  g_colors[index].push(1.0);
  g_colors[index].push(1.0);
  g_colors[index].push(1.0);
}
