/**
 * Event handlers for Footer pattern.
 */

import $ from "jquery";

$(document).ready(function() {

  // Hide footer on mobile until clicked
  let $collapsible = $(".js-toggle-collapsed");
  $collapsible.addClass("is-collapsed is-toggleable");
  $collapsible.on("click", function() {
    if( window.matchMedia("screen and (max-width: 768px)").matches ) {
      $(this).toggleClass("is-collapsed");
    }
  });

});
