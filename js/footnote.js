/**
 * Enables "toggle" functionality on Footnote pattern.
 */

define(function() {
  "use strict";

  var $ = window.jQuery;

  $(function() {

    $(".js-footnote-toggle").each(function() {
      var $content = $(this).closest(".footnote").find(".js-footnote-hidden");

      // Hide content in a footnote if there's a toggle link.
      $content.hide();

      // Make toggle into a link
      $(this).wrapInner("<a href='#'></a>").on("click", function(event) {
        event.preventDefault();

        $content.slideToggle();
      });

    });


  });
});
