//
//
//  **Initializes site-wide menu chrome functionality.**
//
//

(function($) {
  "use strict";

  $(document).ready(function() {
    // Toggle dropdown menu navigation on mobile:
    $(".js-menu-toggle").on("click", function() {
      $(".main-menu").toggleClass("is-visible-mobile");
    });

    // Hide utility bar items when search field is focused:
    $(".search form input[type='search']").on("focus", function() {
      $(".utility-link").addClass("is-hidden-on-phones");
    });

    $(".search form input[type='search']").on("blur", function() {
      $(".utility-link").removeClass("is-hidden-on-phones");
    });
  });

})(jQuery);
