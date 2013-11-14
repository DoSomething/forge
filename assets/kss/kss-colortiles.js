$(document).ready(function() {
  $('.color-tile').each(function() {
    $(this).css("background-color", $(this).data("hex"));
    swapColorLabels($(this));
  });

  $('.color-tile').click(function() {
    $('.color-tile').each(function() {
      swapColorLabels($(this));
    });
  });
});

function swapColorLabels(swatch) {
  var color_label = swatch.find('.js-color-label');
  var hex = swatch.data('hex');
  var rgb = hexToRgb(hex);

  if(color_label.text() == hex) {
    color_label.text('rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')');
  } else {
    color_label.text(hex);
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