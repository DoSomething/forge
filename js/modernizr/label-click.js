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

  try {
    // Trigger a `click` on the label, so we can check if the
    // corresponding input becomes checked.
    testLabel.click();
  } catch(exception) {
    // If `DOMElement.click()` is not supported, such as in
    // PhantomJS, just fail the test.
    return false;
  }

  return testInput.checked;
});

