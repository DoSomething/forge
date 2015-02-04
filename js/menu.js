/**
 * Initializes site-wide menu chrome functionality.
 */

define(function() {
  "use strict";

  var $ = window.jQuery;

  $(function() {
    // Toggle dropdown menu navigation on mobile:
    $(".js-navigation-toggle").on("touchstart mousedown", function(e) {
      e.preventDefault();

      $(".chrome").toggleClass("has-mobile-menu");
      $(".navigation").toggleClass("is-visible");
    });

    // Hide footer on mobile until clicked
    var $collapsible = $(".js-toggle-collapsed");
    $collapsible.addClass("is-collapsed is-toggleable");
    $collapsible.on("click", function() {
      if( window.matchMedia("screen and (max-width: 768px)").matches ) {
        $(this).toggleClass("is-collapsed");
      }
    });
  });
});
