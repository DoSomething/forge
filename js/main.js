/**
 * Main build script. This will compile modules into `neue.js`
 * and `neue.min.js` in dist package, and attach each module to
 * a NEUE global variable attached to the window.
 */

define("jquery", function() {
  "use strict";

  // Shim jQuery so we can access it as an AMD module
  return window.jQuery;
});

define("main", function(require) {
  "use strict";

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

// Start everything up!
require("main");
