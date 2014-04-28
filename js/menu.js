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
    $(".js-footer-col").addClass("is-collapsed");
    $(".js-footer-col h4").on("click", function() {
      if( window.matchMedia("screen and (max-width: 768px)").matches ) {
        $(this).closest(".js-footer-col").toggleClass("is-collapsed");
      }
    });
  });
});
