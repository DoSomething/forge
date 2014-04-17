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

  NEUE.Modal = (function() {
    // We can only have one modal open at a time; we track that here.
    var modalIsOpen = false;

    // The modal container (including background overlay).
    var $modal = null;

    // The content of the modal.
    var $modalContent = null;

    // Click handler for opening a new modal
    var _openHandler = function(event) {
      event.preventDefault();
      var href = "";

      if( $(this).data("cached-modal") ) {
        href = $(this).data("cached-modal");
      } else if ( event.target.hash.charAt(0) === "#"  ) {
        // We find the modal based on the ID in the link"s `href`. For example,
        // `<a class="js-modal-link" href="#modal--faq">Click me</a>` would open `<div id="modal--faq"></div>`.
        href = $(event.target.hash);
      } else {
        // @TODO: We should handle AJAX loading things in.
      }

      open(href);
    };

    // Open a new modal
    // @param {jQuery} href  Element that will be placed inside the modal.
    var open = function($href) {
      // If Google Analytics is set up, we fire an event to track that a
      // modal has been opened.
      if(typeof(_gaq) !== "undefined" && _gaq !== null) {
        _gaq.push(["_trackEvent", "Modal", "Open", $href, null, true]);
      }

      if( !modalIsOpen ) {
        // create modal in DOM
        $modal = $("<div class=\"modal\"></div>");
        $modalContent = $("<div class='modal-content'></div>");
        $modal.append($modalContent);
        $modalContent.html( $($href).html() );

        // set up overlay and show modal
        $("body").addClass("modal-open");
        $("body").append($modal);
        $modal.addClass("fade-in");
        $modalContent.addClass("fade-in-up");
        $modalContent.addClass( $($href).attr("class") );
        $modal.show();

        // Bind events to close Modal
        $modal.on("click", ".js-close-modal", _closeHandler);
        $modal.on("click", _closeHandler);

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
        $modalContent.html( $($href).html() );
      }

      // We'll set up form validation markup for anything in the modal (since it isn't in the DOM on load)
      // @TODO: Should be providing an event that other modules can hook into (so the Validation Module would take care of this).
      NEUE.Validation.prepareFormLabels($modalContent);
    };

    var _closeHandler = function(event) {
      // Don't let the event bubble.
      if(event.target !== this) {
        return;
      }

      // Only close if this modal has a close button
      if($modalContent.find(".js-close-modal").length === 0) {
        return;
      }

      // Override default link behavior.
      event.preventDefault();

      close();
    };

    // Close modal
    var close = function() {
      // If Google Analytics is set up, we fire an event to track that a
      // modal has been closed.
      if(typeof(_gaq) !== "undefined" && _gaq !== null) {
        _gaq.push(["_trackEvent", "Modal", "Close", $href, null, true]);
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
        modalIsOpen = false;
      }
    };

    $(document).ready(function() {
      // Attach modal handler to `.js-modal-link` elements on click
      $("body").on("click", ".js-modal-link", _openHandler);

      // Close modal events are bound on modal initialization.
    });

    // Expose public API for NEUE.Modal
    return {
      open: open,
      close: close
    };
  })();


})(jQuery);
