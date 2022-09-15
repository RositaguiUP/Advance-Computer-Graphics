function rightClick(ev) {
  state.index++;
  addNewFigure();
  var dropdownlist = $("#objects").data("kendoDropDownList");
  dropdownlist.setDataSource(state.figures);
}

function leftClick(ev) {
  addVertex(ev, state.actualFigure);
}

function onChangeSelectedObject() {
  var dropdownlist = $("#objects").data("kendoDropDownList");
  var selectedIndex = state.figures.findIndex((item) => item.id === parseInt(dropdownlist.value()));
  state.selectedFigure = state.figures[selectedIndex];
}

function onDelete(id) {
  var dropdownlist = $("#objects").data("kendoDropDownList");
  deleteFigure(parseInt(dropdownlist.value()));
  dropdownlist.setDataSource(state.figures);
}

function keydown(ev) {
  state.ui.pressedKeys[ev.keyCode] = true;
  updateFigure(state.selectedFigure);
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

function sliderOnChange(e, dim) {
  scaleFigure(state.selectedFigure, e.value, dim);
}

function sliderOnSlide(e, dim) {
  scaleFigure(state.selectedFigure, e.value, dim);
}

function changeColor() {
  var picker = document.getElementById("picker");
  var color = hexToRGB(picker.value, true);

  kendoConsole.log("New color changed: " + picker.value);

  kendoConsole.log("New color is: " + color);
  newColor(state.selectedFigure, color);
  // https://demos.telerik.com/kendo-ui/colorpicker/events
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
