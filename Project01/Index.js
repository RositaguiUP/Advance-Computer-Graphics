var state = {
  canvas: null,
  gl: null,
  ui: {
    pressedKeys: {},
    opcTransRot: 0,
  },
  index: 0,
  figures: [],
  actualFigure: null,
  selectedFigure: null,
};

function main() {
  state.canvas = document.getElementById("webgl");
  state.gl = getWebGLContext(state.canvas);

  if (!state.gl) {
    console.log("Failed to get the WebGL context");
    return;
  }

  if (!initShaders(state.gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
    console.log("Failed to initialize shaders");
    return;
  }

  // Events
  state.canvas.onclick = function (ev) {
    leftClick(ev);
  };

  state.canvas.oncontextmenu = function (ev) {
    rightClick(ev);
    return false;
  };

  window.addEventListener(
    "keydown",
    function onKeyDown(ev) {
      keydown(ev);
    },
    false
  );

  window.addEventListener(
    "keyup",
    function onKeyUp(ev) {
      keyup(ev);
    },
    false
  );

  // Clear canvas
  state.gl.clearColor(0.0, 0.0, 0.0, 1.0);
  state.gl.clear(state.gl.COLOR_BUFFER_BIT);

  state.actualFigure = figure;
  state.figures.push(state.actualFigure);
}
