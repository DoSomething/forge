/**
 * Main build script. This will compile modules into `neue.js`
 * and `neue.min.js` in dist package, and attach each module to
 * a NEUE global variable attached to the window.
 */

define(function(require) {
  "use strict";

  // Attach modules to window
  window.NEUE = {
    Carousel: require("neue/carousel"),
    Events: require("neue/events"),
    JumpScroll: require("neue/jump-scroll"),
    Menu: require("neue/menu"),
    Messages: require("neue/messages"),
    Modal: require("neue/modal"),
    ScrollIndicator: require("neue/scroll-indicator"),
    Sticky: require("neue/sticky"),
    Validation: require("neue/validation")
  };

  return window.NEUE;
});
