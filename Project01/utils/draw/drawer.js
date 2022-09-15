function draw(gl, points, colors) {
  gl.clear(gl.COLOR_BUFFER_BIT);
  setViewProjMatrices(gl);

  var modelMatrix = new Matrix4();

  for (var i = 0; i < points.length; i++) {
    var n = initVertexBuffers(gl, new Float32Array(points[i]), new Float32Array(colors[i]), modelMatrix);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
  }
}

function drawCube(gl, colors, scale, angles, transValues) {
  gl.clear(gl.COLOR_BUFFER_BIT);
  setViewProjMatrices(gl);

  //FRONT
  drawFace(gl, colors, scale, angles, transValues, [0, 0, -1]);
  //BACK
  drawFace(gl, colors, scale, angles, transValues, [0, 0, 1]);
  //LEFT
  drawFace(gl, colors, scale, angles, transValues, [-1, 0, 0], [0, 1, 0]);
  //RIGHT
  drawFace(gl, colors, scale, angles, transValues, [1, 0, 0], [0, 1, 0]);
  //TOP
  drawFace(gl, colors, scale, angles, transValues, [0, 1, 0], [1, 0, 0]);
  //Buttom
  drawFace(gl, colors, scale, angles, transValues, [0, -1, 0], [1, 0, 0]);
}

function drawFace(gl, colors, scale, angles, transValues, translateVec, rotateVec) {
  var g_cube = [-1, 1, 0, -1, -1, 0, 1, 1, 0, 1, -1, 0];
  var modelMatrix = setTransformModelMatrix(scale, angles, transValues, translateVec);
  if (rotateVec) {
    modelMatrix.rotate(90, rotateVec[0], rotateVec[1], rotateVec[2]);
  }
  var n = initVertexBuffers(gl, new Float32Array(g_cube), new Float32Array(colors), modelMatrix);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, n);
}
