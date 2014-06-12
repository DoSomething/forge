(function($) {
  "use strict";

  $(document).ready(function() {
    $(".color-tile").each(function() {
      $(this).css("background-color", $(this).data("hex"));
      swapColorLabels($(this));
    });

    $(".color-tile").on("dblclick", function(event) {
      event.preventDefault();

      $(".color-tile").each(function() {
        swapColorLabels($(this));
      });
    });
  });

  function swapColorLabels(swatch) {
    var colorLabel = swatch.find(".js-color-label");
    var hex = swatch.data("hex");
    var rgb = hexToRgb(hex);

    if(colorLabel.text() === hex) {
      colorLabel.text("rgb(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ")");
    } else {
      colorLabel.text(hex);
    }
  }

  function hexToRgb(hex) {
    // Expand shorthand form (e.g. "03F") to full form (e.g. "0033FF")
    var shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
      return r + r + g + g + b + b;
    });

    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null;
  }
})(jQuery);
