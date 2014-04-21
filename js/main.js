/**
 * Main build script. This will compile modules into `neue.js`
 * and `neue.min.js` in dist package, and attach each module to
 * a NEUE global variable attached to the window.
 */

define("main", function(require) {
  // Attach modules to window
  window.NEUE = {
    Modal: require("./modal"),
    Validation: require("./validation"),
    Messages: require("./system-messages"),
    Carousel: require("./carousel"),
    Flexbox: require("./flexbox-fix"),
    JumpScroll: require("./jump-scroll"),
    Menu: require("./menu"),
    ScrollIndicator: require("./scroll-indicator"),
    Sticky: require("./sticky")
  }

  return window.NEUE;
})
