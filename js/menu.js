//
//
//  **Initializes site-wide menu chrome functionality.**
//
//

(function($) {
  "use strict";

  $(document).ready(function() {
    // Toggle dropdown menu navigation on mobile:
    $(".js-toggle-mobile-menu").on("click", function() {
      $(".nav--wrapper .main").toggleClass("is-visible");
    });

    // Hide utility bar items when search field is focused:
    $(".secondary-nav input[type='search']").on("focus", function() {
      $(".secondary-nav-item").addClass("is-hidden-on-tablets");
    });

    $(".secondary-nav input[type='search']").on("blur", function() {
      $(".secondary-nav-item").removeClass("is-hidden-on-tablets");
    });
  });

})(jQuery);
