//
//
//  **Show/hide modals.** Link should have `.js-modal-link` class, and
// it's `href` should point to the hash of the modal. By convention, the
// modal ID should be prefixed with `modal--` like so:
//
// <script type="text/cached-modal" id="modal--login">
//    <!-- content -->
// </script>
//
//

var NEUE = NEUE || {};

(function($) {
  "use strict";

  var modalIsOpen = false;
  var $modal, $modalContent;

  $(document).ready(function() {
    // Trigger modal on click:
    $("body").on("click", ".js-modal-link", function(e) {
      e.preventDefault();

      var href;
      if( $(this).data("cached-modal") ) {
        href = $(this).data("cached-modal");
      } else if ( e.target.hash.charAt(0) === "#"  ) {
        // We find the modal based on the ID in the link"s `href`. For example,
        // `<a class="js-modal-link" href="#modal--faq">Click me</a>` would open `<div id="modal--faq"></div>`.
        href = $(e.target.hash);
      } else {
        // @TODO: We should handle AJAX loading things in.
      }

      // If Google Analytics is set up, we fire an event to track that a
      // modal has been opened.
      if(typeof(_gaq) !== "undefined" && _gaq !== null) {
        _gaq.push(["_trackEvent", "Modal", "Open", href, null, true]);
      }

      if( !modalIsOpen ) {
        // create modal in DOM
        $modal = $("<div class=\"modal\"></div>");
        $modalContent = $("<div class='modal-content'></div>");
        $modal.append($modalContent);
        $modalContent.html( $(href).html() );

        // set up overlay and show modal
        $("body").addClass("modal-open");
        $("body").append($modal);
        $modal.addClass("fade-in");
        $modalContent.addClass("fade-in-up");
        $modalContent.addClass( $(href).attr("class") );
        $modal.show();

        modalIsOpen = true;

        //  **This fixes an issue with `position:fixed` and the virtual keyboard
        //  on Mobile Safari.** Since this is a browser bug, we're forced to use
        //  browser-detection here, and should look into removing this as soon
        //  as this is fixed in the future. Yes, it is gross.
        if(  /iPhone|iPad|iPod/i.test(window.navigator.userAgent) ) {
          setTimeout(function () {
            $modal.css({ "position": "absolute", "overflow": "visible", "height": $(document).height() + "px" });
            $modalContent.css({ "margin-top": $(document).scrollTop() + "px" });
          }, 0);
        }
      } else {
        // modal is already open, so just replace current content
        $modalContent.html( $(href).html() );
      }

      // We'll set up form validation markup for anything in the modal (since it isn't in the DOM on load)
      // @TODO: Should be providing an event that other modules can hook into (so the Validation Module would take care of this).
      NEUE.Validation.prepareFormLabels($modalContent);

      // Close modal when "x" is clicked:
      $modal.on("click", ".js-close-modal", function(e) {
        e.preventDefault();

        // If Google Analytics is set up, we fire an event to track that a
        // modal has been closed.
        if(typeof(_gaq) !== "undefined" && _gaq !== null) {
          _gaq.push(["_trackEvent", "Modal", "Close", href, null, true]);
        }

        if(Modernizr.cssanimations) {
          $modalContent.addClass("fade-out-down");
          $modal.addClass("fade-out");

          $("body").removeClass("modal-open");

          $modal.one("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
            $modal.remove();
            modalIsOpen = false;
          });
        } else {
          $("body").removeClass("modal-open");
          $modal.remove();
        }

      });
    });

  });

})(jQuery);
