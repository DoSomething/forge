/**
 * Event handlers for Navigation pattern.
 */

import $ from "jquery";

$(document).ready(function() {

  // Toggle dropdown menu navigation on mobile:
  $(".js-navigation-toggle").on("touchstart mousedown", function(event) {
    event.preventDefault();

    $(".chrome").toggleClass("has-mobile-menu");
    $(".navigation").toggleClass("is-visible");
  });

  // Toggle menu on desktop
  $(".navigation__dropdown-toggle").on("click", function(event) {
    event.preventDefault();
    $(".navigation__dropdown").toggleClass("is-visible");
  });

});
