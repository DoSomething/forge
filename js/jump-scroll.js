/**
 * Applies a smooth-scroll animation on links with the `.js-jump-scroll` class.
 */

import $ from "jquery";

$(document).ready(function() {

  // Attach event handler on `.js-jump-scroll` hook.
  $("body").on("click", ".js-jump-scroll", function(event) {
    event.preventDefault();

    let href = $(this).attr("href");

    // Animate scroll position to the target of the link:
    $("html,body").animate({scrollTop: $(event.target.hash).offset().top}, "slow", function() {
      // Finally, set the correct hash in the address bar.
      window.location.hash = href;
    });
  });

});
