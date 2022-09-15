var trans = {
  scale: [0.5, 0.5, 0.8],
  angles: [0, 0, 0],
  angleIncrease: 1,
  transValues: [0, 0, 0],
  transIncrease: 0.02,
};

function updateFigure() {
  if (state.opcTransRot === 1) {
    rotateFigure();
  } else {
    translateFigure();
  }
  drawCube(state.gl, state.g_colors, trans.scale, trans.angles, trans.transValues);
}

function rotateFigure() {
  if (state.ui.pressedKeys[87]) {
    // up   | Rotate x axis +
    trans.angles[0] += trans.angleIncrease;
  } else if (state.ui.pressedKeys[83]) {
    // down | Rotate x axis -
    trans.angles[0] -= trans.angleIncrease;
  } else if (state.ui.pressedKeys[65]) {
    // left
    if (state.ui.pressedKeys[16]) {
      // Rotate z axis +
      trans.angles[2] += trans.angleIncrease;
    } else {
      // Rotate y axis +
      trans.angles[1] += trans.angleIncrease;
    }
  } else if (state.ui.pressedKeys[68]) {
    // right
    if (state.ui.pressedKeys[16]) {
      // Rotate z axis -
      trans.angles[2] -= trans.angleIncrease;
    } else {
      // Rotate y axis -
      trans.angles[1] -= trans.angleIncrease;
    }
  }
}

function translateFigure() {
  if (state.ui.pressedKeys[87]) {
    // up
    if (!state.ui.pressedKeys[16]) {
      // Translate +z
      trans.transValues[1] += trans.transIncrease;
    } else {
      // Translate +y
      trans.transValues[2] += trans.transIncrease;
    }
  } else if (state.ui.pressedKeys[83]) {
    // down
    if (!state.ui.pressedKeys[16]) {
      // Translate -z
      trans.transValues[1] -= trans.transIncrease;
    } else {
      // Translate -y
      trans.transValues[2] -= trans.transIncrease;
    }
  } else if (state.ui.pressedKeys[65]) {
    // left  | Translate -x
    trans.transValues[0] -= trans.transIncrease;
  } else if (state.ui.pressedKeys[68]) {
    // right | Translate +x
    trans.transValues[0] += trans.transIncrease;
  }
}

function scaleFigure(scale, dim) {
  trans.scale[dim] = scale;
  drawCube(state.gl, state.g_colors, trans.scale, trans.angles, trans.transValues);
}

function newColor(color) {
  for (var i = 0; i < 11; i += 3) {
    state.g_colors[i] = color[0];
    state.g_colors[i + 1] = color[1];
    state.g_colors[i + 2] = color[2];
  }
  drawCube(state.gl, state.g_colors, trans.scale, trans.angles, trans.transValues);
}
