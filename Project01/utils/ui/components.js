var min = 0.05;
var max = 1;

$(document).ready(function () {
  $("#scale-x").kendoSlider({
    change: function (e) {
      sliderOnChange(e, 0);
    },
    slide: function (e) {
      sliderOnSlide(e, 0);
    },
    min: min,
    max: max,
    smallStep: 0.05,
    largeStep: 0.1,
    value: 0.5,
  });
});

$(document).ready(function () {
  $("#scale-y").kendoSlider({
    change: function (e) {
      sliderOnChange(e, 1);
    },
    slide: function (e) {
      sliderOnSlide(e, 1);
    },
    min: min,
    max: max,
    smallStep: 0.05,
    largeStep: 0.1,
    value: 0.5,
  });
});

$(document).ready(function () {
  $("#scale-z").kendoSlider({
    change: function (e) {
      sliderOnChange(e, 2);
    },
    slide: function (e) {
      sliderOnSlide(e, 2);
    },
    min: min,
    max: max,
    smallStep: 0.05,
    largeStep: 0.1,
    value: 0.5,
  });
});

/*
$(document).ready(function () {
  $("#picker").kendoColorPicker({
    value: "#00ccff",
    dataRole: "colorpicker",
    dataOpacity: "true",
    dataViews: "['gradient']",
  });
});
*/
