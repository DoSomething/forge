/**
 * Indicates current section in nav on scroll. Applies an `.is-active`
 * class when the specified `href` reaches the top of the viewport.
 *
 * Triggered by a `.js-scroll-indicator` on a link.
 */

import $ from 'jquery';
import throttle from 'lodash/function/throttle';
import sortedIndex from 'lodash/array/sortedIndex';

let oldIndicator;
let offsets = [];
let links = [];

/**
 * Prepare all `.js-scroll-indicator` links on the page.
 */
function preparePage() {
  offsets = [];
  links = [];

  $('.js-scroll-indicator').find('a').each(function(index, el) {
    const $link = $(el);

    // Calculate the element's offset from the top of the page while anchored
    const $linkTarget = $($link.attr('href'));
    if ($linkTarget.length) {
      // Add jQuery object and offset value to link map
      offsets.push($linkTarget.offset().top);
      links.push($link);
    }
  });
}

/**
 * Scroll handler to highlight the link the user is currently reading.
 */
function updateScrollIndicators() {
  // @NOTE: We use a 40px offset to trigger indicator slightly after scroll position
  // (so that nav switches closer to where a user will likely be reading the text)
  const offsetIndex = sortedIndex(offsets, $(window).scrollTop() + 40);
  const newIndicator = links[offsetIndex];

  if (newIndicator) {
    const newIndicatorParents = newIndicator.parentsUntil('.js-scroll-indicator');

    if (oldIndicator && oldIndicator !== newIndicator) {
      const oldIndicatorParents = oldIndicator.parentsUntil('.js-scroll-indicator').not(newIndicatorParents);
      oldIndicatorParents.removeClass('is-active');
      oldIndicator.removeClass('is-active');
    }

    newIndicator.addClass('is-active');
    newIndicatorParents.addClass('is-active');

    oldIndicator = newIndicator;
  }
}

/**
 * Attach event listeners and prepare link references on load.
 */
$(document).ready(function() {
  preparePage();

  $(window).on('scroll', throttle(updateScrollIndicators, 60));
  $(window).on('resize', preparePage);
});
