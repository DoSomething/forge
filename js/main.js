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
    JumpScroll: require("./jump-scroll"),
    Menu: require("./menu"),
    Messages: require("./messages"),
    ScrollIndicator: require("./scroll-indicator"),
    Tabs: require("./tabs"),
    Tile: require("./tile")
  };

  return window.NEUE;
});
