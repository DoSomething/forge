/**
 * Enables "toggle" functionality on Footnote pattern.
 */

import $ from "jquery";

$(document).ready(function() {

  // Look for any `js-footnote-toggle` hooks...
  $(".js-footnote-toggle").each(function() {
    let $content = $(this).closest(".footnote").find(".js-footnote-hidden");

    // Hide content in a footnote if there's a toggle link.
    $content.hide();

    // Make toggle into a link
    $(this).wrapInner("<a href='#'></a>").on("click", function(event) {
      event.preventDefault();

      $content.slideToggle();
    });

  });
});
