var trans = {
  angleIncrease: 1,
  transIncrease: 0.02,
};

function updateFigure(fig) {
  if (state.opcTransRot === 1) {
    rotateFigure(fig);
  } else {
    translateFigure(fig);
  }
  draw(state.gl, state.figures);
}

function rotateFigure(fig) {
  if (state.ui.pressedKeys[87]) {
    // up   | Rotate x axis +
    fig.angles[0] += trans.angleIncrease;
  } else if (state.ui.pressedKeys[83]) {
    // down | Rotate x axis -
    fig.angles[0] -= trans.angleIncrease;
  } else if (state.ui.pressedKeys[65]) {
    // left
    if (state.ui.pressedKeys[16]) {
      // Rotate z axis +
      fig.angles[2] += trans.angleIncrease;
    } else {
      // Rotate y axis +
      fig.angles[1] += trans.angleIncrease;
    }
  } else if (state.ui.pressedKeys[68]) {
    // right
    if (state.ui.pressedKeys[16]) {
      // Rotate z axis -
      fig.angles[2] -= trans.angleIncrease;
    } else {
      // Rotate y axis -
      fig.angles[1] -= trans.angleIncrease;
    }
  }
}

function translateFigure(fig) {
  if (state.ui.pressedKeys[87]) {
    // up
    if (!state.ui.pressedKeys[16]) {
      // Translate +z
      fig.transValues[1] += trans.transIncrease;
    } else {
      // Translate +y
      fig.transValues[2] += trans.transIncrease;
    }
  } else if (state.ui.pressedKeys[83]) {
    // down
    if (!state.ui.pressedKeys[16]) {
      // Translate -z
      fig.transValues[1] -= trans.transIncrease;
    } else {
      // Translate -y
      fig.transValues[2] -= trans.transIncrease;
    }
  } else if (state.ui.pressedKeys[65]) {
    // left  | Translate -x
    fig.transValues[0] -= trans.transIncrease;
  } else if (state.ui.pressedKeys[68]) {
    // right | Translate +x
    fig.transValues[0] += trans.transIncrease;
  }
}

function scaleFigure(fig, scale, dim) {
  fig.scale[dim] = scale;
  draw(state.gl, state.figures);
}

function newColor(fig, color) {
  for (var i = 0; i < fig.colors.length - 1; i += 3) {
    fig.colors[i] = color[0];
    fig.colors[i + 1] = color[1];
    fig.colors[i + 2] = color[2];
  }
  console.log("Colors: " + fig.colors);
  draw(state.gl, state.figures);
}
