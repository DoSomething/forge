//
//
//  **Pins an element to the top of the screen on scroll.**
// Requires pinned element to have `.js-pin-to-top` class, and an
// adjacent `#js-pin-to-top-anchor` element to keep track of its
// original position in the document while pinned.
//
//

(function($) {
  "use strict";

  // Get the global NEUE object and attach our function to it.
  window.NEUE = window.NEUE || {};
  window.NEUE.pinToTop = function() {
    // We cache the element anchor"s offset from the top of the page
    var divTop = $("#js-pin-to-top-anchor").offset().top;

    // We compare the distance to the top of the page with the distance scrolled.
    // If we have scrolled past the anchor element, we apply CSS class to pin the element to top.
    var stickyRelocate = function() {
      if ($(window).scrollTop() > divTop) {
        $(".js-pin-to-top").addClass("is-stuck");
      } else {
        $(".js-pin-to-top").removeClass("is-stuck");
      }
    };

    $(window).on("scroll", stickyRelocate);

    // Run the function on initialization, in case window position is already scrolled on page load.
    stickyRelocate();
  };

})(jQuery);
