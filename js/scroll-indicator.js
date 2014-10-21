/**
 * Indicates current section in nav on scroll. Applies an `.is-active`
 * class when the specified `href` reaches the top of the viewport.
 *
 * Triggered by a `.js-scroll-indicator` on a link.
 */

define(function() {
  "use strict";

  var $ = window.jQuery;
  var links = [];

  /**
   * @see _.throttle
   */
  var throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;

    options || (options = {});

    var later = function() {
      previous = new Date();
      timeout = null;
      result = func.apply(context, args);
    };

    return function() {
      var now = new Date();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;

      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }

      return result;
    };
  };

  /**
   * @see _.sortedIndex
   */
  function sortedIndex(array, value, key) {
    var low = 0,
    high = array ? array.length : low;

    while (low < high) {
      var mid = (low + high) >>> 1; // jshint ignore:line
      (array[mid][key] < value) ? low = mid + 1 : high = mid;
    }

    return low ? low - 1 : low;
  }

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
  $(function() {
    preparePage();

    var throttledScroll = throttle(updateScrollIndicators, 60);

    $(window).on("scroll", throttledScroll);
    $(window).on("resize", preparePage);
  });

});

