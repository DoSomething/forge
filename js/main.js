/**
 * Main build script. This will compile modules into `neue.js`
 * and `neue.min.js` in dist package, and attach each module to
 * a NEUE global variable attached to the window.
 */

define(function(require) {
  "use strict";

  // Attach modules to window
  window.NEUE = {
    Carousel: require("./carousel"),
    Events: require("./events"),
    JumpScroll: require("./jump-scroll"),
    MediaSelector: require("./media-selector"),
    Menu: require("./menu"),
    Messages: require("./messages"),
    Modal: require("./modal"),
    ScrollIndicator: require("./scroll-indicator"),
    Sticky: require("./sticky"),
    Validation: require("./validation")
  };

  return window.NEUE;
});
