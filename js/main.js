/**
 * Main build script. This will compile modules into `neue.js`
 * and `neue.min.js` in dist package, and attach each module to
 * a NEUE global variable attached to the window.
 */

define(function(require) {
  "use strict";

  require("neue/vendor/modernizr");

  // Attach modules to window
  window.NEUE = {
    Modal: require("neue/modal"),
    Validation: require("neue/validation"),
    Messages: require("neue/messages"),
    Carousel: require("neue/carousel"),
    JumpScroll: require("neue/jump-scroll"),
    Menu: require("neue/menu"),
    ScrollIndicator: require("neue/scroll-indicator"),
    Sticky: require("neue/sticky")
  };

  return window.NEUE;
});
