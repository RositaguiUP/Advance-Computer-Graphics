var figure = {
  id: 0,
  name: "Object 1",
  points: [],
  colors: [],
  scale: [1, 1, 1],
  angles: [0, 0, 0],
  transValues: [0, 0, 0],
};

function addNewFigure() {
  state.actualFigure = {
    id: state.index,
    name: "Object " + (state.index + 1),
    points: [],
    colors: [],
    scale: [1, 1, 1],
    angles: [0, 0, 0],
    transValues: [0, 0, 0],
  };
  state.figures.push(state.actualFigure);
}

function deleteFigure(id) {
  state.figures.splice(
    state.figures.findIndex((item) => item.id === id),
    1
  );
  draw(state.gl, state.figures);
}

function draw(gl, figures) {
  gl.clear(gl.COLOR_BUFFER_BIT);
  setViewProjMatrices(gl);

  var fig;
  var modelMatrix;
  for (var i = 0; i < figures.length; i++) {
    fig = figures[i];
    modelMatrix = setTransformModelMatrix(fig.scale, fig.angles, fig.transValues);
    // console.log(i + ") " + fig.points.length);
    var n = initVertexBuffers(gl, new Float32Array(fig.points), new Float32Array(fig.colors), modelMatrix);
    gl.drawArrays(gl.TRIANGLE_FAN, 0, n);
  }
}

function addVertex(ev, fig) {
  var x = ev.clientX;
  var y = ev.clientY;
  var rect = ev.target.getBoundingClientRect();

  x = (x - rect.left - state.canvas.width / 2) / (state.canvas.width / 2);
  y = (state.canvas.height / 2 - (y - rect.top)) / (state.canvas.height / 2);

  fig.points.push(x);
  fig.points.push(y);
  var z = 0.0;
  if (ev.ctrlKey) {
    z = -0.5;
  } else if (ev.shiftKey) {
    z = -1.0;
  }
  fig.points.push(z);

  fig.colors.push(1);
  fig.colors.push(0);
  fig.colors.push(0);

  state.figures[state.index] = fig;

  state.selectedFigure = state.actualFigure;

  draw(state.gl, state.figures);
}
