/**
 * Applies a smooth-scroll animation on links with the `.js-jump-scroll` class.
 */

define(function() {
  "use strict";

  var $ = window.jQuery;

  $(function() {
    $(".js-jump-scroll").on("click", function(event) {
      event.preventDefault();

      var href = $(this).attr("href");

      // Animate scroll position to the target of the link:
      $("html,body").animate({scrollTop: $(event.target.hash).offset().top}, "slow", function() {
        // Finally, set the correct hash in the address bar.
        window.location.hash = href;
      });
    });
  });
});
