/**
 * Pins an element to the top of the screen on scroll.
 *
 * Requires pinned element to have `.js-sticky` class, and have
 * a `.is-stuck` modifier class in its CSS (which allows
 * customized sticky behavior based on media queries).
 *
 * @example
 * // .sidebar {
 * //   &.is-stuck {
 * //     position: fixed;
 * //     top: 0;
 * //   }
 * // }
 *
 */

define(function() {
  "use strict";

  var $ = window.jQuery;

  var divs = [];

  // Prepare all `.js-sticky` divs on the page.
  function preparePage() {
    divs = [];

    $(".js-sticky").each(function(index, div) {
      prepareSticky(div);
    });
  }

  // Prepare markup and register divs with scroll handler
  function prepareSticky(div) {
    // Calculate the element's offset from the top of the page while anchored
    var divOffset = $(div).offset().top;

    // Create the data structure that we'll store this stuff in
    var divObj = {
      $el: $(div),
      offset: divOffset
    };

    // Add jQuery object and offset value to divs array
    divs.push(divObj);

    // Now that we're ready, let's calculate how stickies should be displayed
    scrollSticky();
  }

  // Scroll handler: pins/unpins divs on scroll event
  function scrollSticky() {
    $.each(divs, function(index, div) {
      // Compare the distance to the top of the page with the distance scrolled.
      // For each div: if we've scrolled past it's offset, pin it to top.
      if ($(window).scrollTop() > div.offset) {
        div.$el.addClass("is-stuck");
      } else {
        div.$el.removeClass("is-stuck");
      }
    });
  }

  // Attach our functions to their respective events.
  $(function() {
    preparePage();

    $(window).on("scroll", scrollSticky);
    $(window).on("resize", preparePage);
  });
});
