var figure = {
  points: [],
  colors: [],
  scale: [],
  angles: [],
  transValues: [],
};

function addVertex(ev, index, points, colors) {
  var x = ev.clientX;
  var y = ev.clientY;
  var rect = ev.target.getBoundingClientRect();

  x = (x - rect.left - state.canvas.width / 2) / (state.canvas.width / 2);
  y = (state.canvas.height / 2 - (y - rect.top)) / (state.canvas.height / 2);

  if (points.length <= index) {
    var arrayPoints = [];
    points.push(arrayPoints);
    var arrayColors = [];
    colors.push(arrayColors);
  }

  points[index].push(x);
  points[index].push(y);
  var z = 0.0;
  if (ev.ctrlKey) {
    z = -0.5;
  } else if (ev.shiftKey) {
    z = -1.0;
  }
  points[index].push(z);

  colors[index].push(1);
  colors[index].push(0);
  colors[index].push(0);

  draw(state.gl, points, colors);
}

function addFigure() {}
