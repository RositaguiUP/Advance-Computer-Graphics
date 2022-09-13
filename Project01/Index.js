var VSHADER_SOURCE = `
  attribute vec4 a_Position;
  attribute vec4 a_Color;
  varying vec4 u_FragColor;
  uniform mat4 u_ModelMatrix;
  uniform mat4 u_ViewMatrix;
  uniform mat4 u_ProjMatrix;
  void main() {
    gl_Position = u_ProjMatrix * u_ViewMatrix * u_ModelMatrix * a_Position;
    u_FragColor = a_Color;
  }`;

var FSHADER_SOURCE = `
  precision mediump float;
  varying vec4 u_FragColor;
  void main(){
    gl_FragColor = u_FragColor;
  }`;

var canvas;
var gl;

var rotate = false;
var breath = false;
var increase = true;

var angle = 0.0;
var size = 0.5;
var rotAxis = [1, 1, 1];

var index = 0;
var g_points = [];
var g_colors = [];
//for (var i = 0; i < 12; i++) colors.push(Math.random());

var opc = 0;

function changeAxis() {
  var allAxis = document.getElementById("all-axis");
  var xAxis = document.getElementById("x-axis");
  var yAxis = document.getElementById("y-axis");
  var zAxis = document.getElementById("z-axis");
  if (allAxis.checked) {
    kendoConsole.log("All");
    rotAxis = [1, 1, 1];
    opc = 0;
  }
  if (xAxis.checked) {
    kendoConsole.log("X");
    rotAxis = [1, 0, 0];
    opc = 1;
  }
  if (yAxis.checked) {
    kendoConsole.log("Y");
    rotAxis = [0, 1, 0];
  }
  if (zAxis.checked) {
    kendoConsole.log("Z");
    rotAxis = [0, 0, 1];
  }
}

function main() {
  canvas = document.getElementById("webgl");
  gl = getWebGLContext(canvas);

  if (!gl) {
    console.log("Failed to get the WebGL context");
    return;
  }

  if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to initialize shaders");
    return;
  }
  canvas.onclick = function (ev) {
    leftClick(ev);
  };

  canvas.oncontextmenu = function (ev) {
    rightClick(ev);
    return false;
  };

  gl.clearColor(1.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);
  draw();
}

function update() {
  if (breath) {
    if (increase) {
      size += 0.005;
    } else {
      size -= 0.005;
    }

    if (size >= 0.8 || size <= 0.3) {
      increase = !increase;
    }
  }

  if (rotate) angle += 1.0;

  if (breath || rotate) {
    draw();
    requestAnimationFrame(update, canvas);
  }
}

function rightClick(ev) {
  /*breath = breath ? false : true;
  !rotate && update();*/
  index++;
}

function leftClick(ev) {
  /*rotate = rotate ? false : true;
  !breath && update();*/
  if (opc == 0) {
    addVertex(ev);
  } else {
    var pixels = Array.from(pixelsFromMouseClick(ev));
    if (pixels[0] === 255) {
      console.log("cube selected");
    }
    /*var obj = selectFigure(pixels);
    if (obj) {
      console.log("cube " + obj.id + " selected!");
    }*/
  }
}

function initVertexBuffers(gl, vertices, colors, modelMatrix) {
  var n = vertices.length / 3;
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);

  var a_Position = gl.getAttribLocation(gl.program, "a_Position");
  if (a_Position < 0) {
    console.log("Failed to get program for a_Position");
    return;
  }
  gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Position);

  var u_ModelMatrix = gl.getUniformLocation(gl.program, "u_ModelMatrix");
  if (!u_ModelMatrix) {
    console.log("Failed to get location of u_ModelMatrix");
    return;
  }
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);

  var a_Color = gl.getAttribLocation(gl.program, "a_Color");
  if (a_Color < 0) {
    console.log("Failed to get location of a_Color");
    return;
  }
  gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(a_Color);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);
  return n;
}

function setViewProjMatrices() {
  var u_ViewMatrix = gl.getUniformLocation(gl.program, "u_ViewMatrix");
  if (!u_ViewMatrix) {
    console.log("Failed to get location of u_ViewMatrix");
    return;
  }
  var viewMatrix = new Matrix4();
  viewMatrix.setLookAt(0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  var u_ProjMatrix = gl.getUniformLocation(gl.program, "u_ProjMatrix");
  if (!u_ProjMatrix) {
    console.log("Failed to get location of u_ProjMatrix");
    return;
  }
  var projMatrix = new Matrix4();
  //projMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, 1.0, 2.0);
  //projMatrix.setPerspective(60.0, 1, 0.1, 5.0);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
}

function draw() {
  //gl.clear(gl.COLOR_BUFFER_BIT);
  setViewProjMatrices();
  var modelMatrix = new Matrix4();

  for (var i = 0; i < g_points.length; i++) {
    var n = initVertexBuffers(
      gl,
      new Float32Array(g_points[i]),
      new Float32Array(g_colors[i]),
      modelMatrix
    );
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
  }
}

function addVertex(ev) {
  var x = ev.clientX;
  var y = ev.clientY;
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
  var z = 0.0;
  if (ev.ctrlKey) {
    z = -0.5;
  } else if (ev.shiftKey) {
    z = -1.0;
  }
  g_points[index].push(z);

  g_colors[index].push(1);
  g_colors[index].push(0);
  g_colors[index].push(0);

  draw();
}

function drawFace(translateVec, rotateVec) {
  var g_cube = [-1, 1, 0, -1, -1, 0, 1, 1, 0, 1, -1, 0];
  var modelMatrix = new Matrix4();
  modelMatrix.setScale(size, size, size);
  modelMatrix.rotate(angle, rotAxis[0], rotAxis[1], rotAxis[2]);
  modelMatrix.translate(translateVec[0], translateVec[1], translateVec[2]);
  if (rotateVec) {
    modelMatrix.rotate(90, rotateVec[0], rotateVec[1], rotateVec[2]);
  }
  var n = initVertexBuffers(
    gl,
    new Float32Array(g_cube),
    modelMatrix,
    new Float32Array(colors)
  );
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}

function addFigure() {}

function selectFigure(ev, pixels) {
  pixels = pixels.map(function (n) {
    return n / 255;
  });
  return state.app.objects.find(function (obj) {
    return (
      pixels.length == obj.selColor.length &&
      pixels.every(function (v, i) {
        return v === obj.selColor[i];
      })
    );
  });

  console.log("Aqui");
}

function pixelInputToCanvasCoord(ev) {
  var x = ev.clientX;
  var y = ev.clientY;
  var rect = ev.target.getBoundingClientRect();

  x = (x - rect.left - canvas.width / 2) / (canvas.width / 2);
  y = (canvas.height / 2 - (y - rect.top)) / (canvas.height / 2);

  /*var x = event.clientX,
    y = event.clientY,
    rect = event.target.getBoundingClientRect();
  x = x - rect.left;
  y = rect.bottom - y;*/
  return { x: x, y: y };
}

function pixelsFromMouseClick(event) {
  var point = pixelInputToCanvasCoord(event);
  var pixels = new Uint8Array(4);
  //  returns pixel data from the frame buffer, starting with the pixel whose lower left corner is at location ( x , y ), into client memory starting at location data .
  gl.readPixels(point.x, point.y, 1, 1, gl.RGBA, gl.UNSIGNED_BYTE, pixels);

  console.log(pixels);
  return pixels;
}
