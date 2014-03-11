//
//
//  **Indicates current section in nav on scroll.** Applies an `.is-active`
//  class when the specified `href` reaches the top of the viewport.
//
//  Triggered by a `.js-scroll-indicator` on a link.
//
//

(function($) {
  "use strict";

  var links = [];

  // Prepare all `.js-scroll-indicator` links on the page.
  function preparePage() {
    links = [];

    $(".js-scroll-indicator").each(function(index, link) {
      prepareIndicator(link);
    });
  }

  // Registers links and their targets with scroll handler
  function prepareIndicator(link) {
    // Calculate the element's offset from the top of the page while anchored
    var linkTarget = $(link).attr("href");
    var linkTargetOffset = $(linkTarget).offset().top;

    // Create the data structure that we'll store this stuff in
    var linkObj = {
      $el: $(link),
      targetOffset: linkTargetOffset
    };

    // Add jQuery object and offset value to links array
    links.push(linkObj);

    // Now that we're ready, let's calculate how stickies should be displayed
    updateScrollIndicators();
  }

  // Scroll handler: highlights the furthest link the user has passed
  function updateScrollIndicators() {
    $.each(links, function(index, link) {
      // In reverse order (moving up the nav from the bottom), check whether
      // we've scrolled past the link's target. If so, set active and stop.
      var windowOffset = $(window).scrollTop() + link.$el.height() * 2;
      if (windowOffset > link.targetOffset) {
        $(".js-scroll-indicator").removeClass("is-active");
        link.$el.addClass("is-active");
        return;
      }
    });
  }

  // Attach our functions to their respective events.
  $(document).ready(function() {
    preparePage();

    $(window).on("scroll", updateScrollIndicators);
    $(window).on("resize", preparePage);
  });

})(jQuery);
