/**
 * Indicates current section in nav on scroll. Applies an `.is-active`
 * class when the specified `href` reaches the top of the viewport.
 *
 * Triggered by a `.js-scroll-indicator` on a link.
 */

import $ from "jquery";
import throttle from "lodash/function/throttle";
import sortedIndex from "lodash/array/sortedIndex";

var links = [];

/**
 * Modified binary search. Finds target key, or next lowest if
 * it doesn't exist.
 * @see _.binarySearch
 */
function binarySearch(array, value) {
  var index = sortedIndex(array, value, "offset");
  return array[index];
}

// Registers links and their targets with scroll handler
function prepareIndicator($link) {
  // Calculate the element's offset from the top of the page while anchored
  var $linkTarget = $( $link.attr("href") );
  if( $linkTarget.length ) {
    // Add jQuery object and offset value to link map
    links.push({ offset: $linkTarget.offset().top, link: $link });
  }
}

// Prepare all `.js-scroll-indicator` links on the page.
function preparePage() {
  links = [];

  $(".js-scroll-indicator").find("a").each(function(index, link) {
    prepareIndicator( $(link) );
  });
}

var oldIndicator;
// Scroll handler: highlights the furthest link the user has passed
function updateScrollIndicators() {
  var newIndicator = binarySearch(links, $(window).scrollTop() + 40);
  // @NOTE: We use a 40px offset to trigger indicator slightly after scroll position
  // (so that nav switches closer to where a user will likely be reading the text)

  if(newIndicator && newIndicator.link) {
    var newIndicatorParents = newIndicator.link.parentsUntil(".js-scroll-indicator");
    var oldIndicatorParents = $();

    if(oldIndicator && oldIndicator !== newIndicator) {
      oldIndicator.link.removeClass("is-active");
      oldIndicatorParents = oldIndicator.link.parentsUntil(".js-scroll-indicator");
    }

    newIndicator.link.addClass("is-active");
    newIndicatorParents.addClass("is-active");
    oldIndicatorParents.not(newIndicatorParents).removeClass("is-active");

    oldIndicator = newIndicator;
  }
}

// Attach our functions to their respective events.
$(document).ready(function() {
  preparePage();

  var throttledScroll = throttle(updateScrollIndicators, 60);

  $(window).on("scroll", throttledScroll);
  $(window).on("resize", preparePage);
});
