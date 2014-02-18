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

    // Hide footer on mobile until clicked
    $(".footer--wrapper .col").addClass("is-collapsed");
    $(".js-footer-col h4").on("click", function() {
      if( matchMedia("screen and (max-width: 768px)").matches ) {
        $(this).closest(".col").toggleClass("is-collapsed");
        console.log('do it');
      }
    });

  });

})(jQuery);
