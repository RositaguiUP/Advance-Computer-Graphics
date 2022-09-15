function rightClick(ev) {
  state.index++;
}

function leftClick(ev) {
  addVertex(ev, state.index, state.g_points, state.g_colors);
}

function keydown(ev) {
  state.ui.pressedKeys[ev.keyCode] = true;
  updateFigure();
}

function keyup(ev) {
  state.ui.pressedKeys[ev.keyCode] = false;
}

function changeTransform() {
  var translate = document.getElementById("translate-fig");
  var rotate = document.getElementById("rotate-fig");
  if (translate.checked) {
    kendoConsole.log("You can translate the figure");
    state.opcTransRot = 0;
  }
  if (rotate.checked) {
    kendoConsole.log("You can rotate the figure");
    state.opcTransRot = 1;
  }
}

function changeColor() {
  var picker = document.getElementById("picker");
  var color = hexToRGB(picker.value, true);

  kendoConsole.log("New color changed: " + picker.value);

  kendoConsole.log("New color is: " + color);
  newColor(color);
  // https://demos.telerik.com/kendo-ui/colorpicker/events
}

function sliderOnChange(e, dim) {
  scaleFigure(e.value, dim);
}

function sliderOnSlide(e, dim) {
  scaleFigure(e.value, dim);
}

function hexToRGB(h, isPct) {
  let r = 0,
    g = 0,
    b = 0;
  isPct = isPct === true;

  if (h.length === 4) {
    r = "0x" + h[1] + h[1];
    g = "0x" + h[2] + h[2];
    b = "0x" + h[3] + h[3];
  } else if (h.length === 7) {
    r = "0x" + h[1] + h[2];
    g = "0x" + h[3] + h[4];
    b = "0x" + h[5] + h[6];
  }

  if (isPct) {
    r = +(r / 255).toFixed(5);
    g = +(g / 255).toFixed(5);
    b = +(b / 255).toFixed(5);
  }

  // return "rgb(" + (isPct ? r + "%," + g + "%," + b + "%" : +r + "," + +g + "," + +b) + ")";
  return [r, g, b];
}
