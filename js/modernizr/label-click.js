/**
 * Android browser doesn't trigger a label's associated
 * form item when tapping the label. We only want to
 * enable 'option' styled checkboxes/radio buttons if the
 * expected behavior still functions.
 */

/* jshint strict:false */
/* global Modernizr:false */

Modernizr.addTest("label-click", function() {
  var testLabel = document.createElement("label");
  var testInput = document.createElement("input");
  testInput.setAttribute("type", "checkbox");
  testLabel.appendChild(testInput);
  testLabel.click();

  return testInput.checked;
});

