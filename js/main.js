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
    Modal: require("./modal"),
    Validation: require("./validation"),
    Messages: require("./messages"),
    Carousel: require("./carousel"),
    Flexbox: require("./flexbox-fix"),
    JumpScroll: require("./jump-scroll"),
    Menu: require("./menu"),
    ScrollIndicator: require("./scroll-indicator"),
    Sticky: require("./sticky")
  };

  return window.NEUE;
});

// // Attach extra validation functions
// require("./validations/match");

// Start everything up!
require("main");
