/**
 * Initializes site-wide menu chrome functionality.
 */

define(function() {
  "use strict";

  var $ = window.jQuery;

  $(function() {
    // Toggle dropdown menu navigation on mobile:
    $(".js-toggle-mobile-menu").on("click", function() {
      $(".chrome--nav").toggleClass("is-visible");
    });

    // Hide footer on mobile until clicked
    $(".js-toggle-collapsed").addClass("is-collapsed is-toggleable");
    $(".js-toggle-collapsed").on("click", function() {
      if( window.matchMedia("screen and (max-width: 768px)").matches ) {
        $(this).toggleClass("is-collapsed");
      }
    });
  });
});
