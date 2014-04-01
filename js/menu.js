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
      $(".chrome--nav").toggleClass("is-visible");
    });

    // Hide footer on mobile until clicked
    $(".chrome--footer .col").addClass("is-collapsed");
    $(".js-footer-col h4").on("click", function() {
      if( window.matchMedia("screen and (max-width: 768px)").matches ) {
        $(this).closest(".col").toggleClass("is-collapsed");
      }
    });

  });

})(jQuery);
