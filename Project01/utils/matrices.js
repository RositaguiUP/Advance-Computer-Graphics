function initVertexBuffers(gl, vertices, colors, modelMatrix) {
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LESS);

  // Model | Object
  var u_ModelMatrix = getUniformLocation(gl, "u_ModelMatrix");
  gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);

  // Vertex
  var n = vertices.length / 3;
  var vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.DYNAMIC_DRAW);
  setVertexAttrib(gl, "a_Position");

  gl.bindBuffer(gl.ARRAY_BUFFER, null);

  // Color
  var colorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, colors, gl.DYNAMIC_DRAW);
  setVertexAttrib(gl, "a_Color");
  return n;
}

function setViewProjMatrices(gl) {
  // View | Camera
  var u_ViewMatrix = getUniformLocation(gl, "u_ViewMatrix");
  var viewMatrix = new Matrix4();
  viewMatrix.setLookAt(0.0, 0.0, 0.5, 0.0, 0.0, 0.0, 0.0, 1.0, 0.0);
  gl.uniformMatrix4fv(u_ViewMatrix, false, viewMatrix.elements);

  // Projection | Perspective
  var u_ProjMatrix = getUniformLocation(gl, "u_ProjMatrix");
  var projMatrix = new Matrix4();
  // projMatrix.setOrtho(-1.0, 1.0, -1.0, 1.0, 1.0, 2.0);
  // projMatrix.setPerspective(60.0, 0.1, 0.8, 2.0);
  gl.uniformMatrix4fv(u_ProjMatrix, false, projMatrix.elements);
}

function setTransformModelMatrix(scale, angles, transValues, translateVec) {
  var modelMatrix = new Matrix4();
  modelMatrix.setScale(scale[0], scale[1], scale[2]);
  modelMatrix.rotate(angles[0], 1, 0, 0);
  modelMatrix.rotate(angles[1], 0, 1, 0);
  modelMatrix.rotate(angles[2], 0, 0, 1);
  modelMatrix.translate(translateVec[0] + transValues[0], translateVec[1] + transValues[1], translateVec[2] + transValues[2]);
  return modelMatrix;
}

function getUniformLocation(gl, name) {
  var matrix = gl.getUniformLocation(gl.program, name);
  if (!matrix) {
    console.log("Failed to get location of " + name);
    return;
  }
  return matrix;
}

function setVertexAttrib(gl, name) {
  var attrib = gl.getAttribLocation(gl.program, name);
  if (attrib < 0) {
    console.log("Failed to get location of " + name);
    return;
  }
  gl.vertexAttribPointer(attrib, 3, gl.FLOAT, false, 0, 0);
  gl.enableVertexAttribArray(attrib);
}
