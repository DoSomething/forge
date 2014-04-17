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

  NEUE.Modal = {
    // We can only have one modal open at a time; we track that here.
    modalIsOpen: false,

    // The modal container (including background overlay).
    $modal: null,

    // The content of the modal.
    $modalContent: null,

    // Stores the "path" of the current modal
    href: "",

    // Open a new modal
    open: function(event) {
      event.preventDefault();

      if( $(this).data("cached-modal") ) {
        NEUE.Modal.href = $(this).data("cached-modal");
      } else if ( event.target.hash.charAt(0) === "#"  ) {
        // We find the modal based on the ID in the link"s `href`. For example,
        // `<a class="js-modal-link" href="#modal--faq">Click me</a>` would open `<div id="modal--faq"></div>`.
        NEUE.Modal.href = $(event.target.hash);
      } else {
        // @TODO: We should handle AJAX loading things in.
      }

      // If Google Analytics is set up, we fire an event to track that a
      // modal has been opened.
      if(typeof(_gaq) !== "undefined" && _gaq !== null) {
        _gaq.push(["_trackEvent", "Modal", "Open", NEUE.Modal.href, null, true]);
      }

      if( !NEUE.Modal.modalIsOpen ) {
        // create modal in DOM
        NEUE.Modal.$modal = $("<div class=\"modal\"></div>");
        NEUE.Modal.$modalContent = $("<div class='modal-content'></div>");
        NEUE.Modal.$modal.append(NEUE.Modal.$modalContent);
        NEUE.Modal.$modalContent.html( $(NEUE.Modal.href).html() );

        // set up overlay and show modal
        $("body").addClass("modal-open");
        $("body").append(NEUE.Modal.$modal);
        NEUE.Modal.$modal.addClass("fade-in");
        NEUE.Modal.$modalContent.addClass("fade-in-up");
        NEUE.Modal.$modalContent.addClass( $(NEUE.Modal.href).attr("class") );
        NEUE.Modal.$modal.show();

        // Bind events to close Modal
        NEUE.Modal.$modal.on("click", ".js-close-modal", NEUE.Modal.close);
        NEUE.Modal.$modal.on("click", NEUE.Modal.close);

        NEUE.Modal.modalIsOpen = true;

        //  **This fixes an issue with `position:fixed` and the virtual keyboard
        //  on Mobile Safari.** Since this is a browser bug, we're forced to use
        //  browser-detection here, and should look into removing this as soon
        //  as this is fixed in the future. Yes, it is gross.
        if(  /iPhone|iPad|iPod/i.test(window.navigator.userAgent) ) {
          setTimeout(function () {
            NEUE.Modal.$modal.css({ "position": "absolute", "overflow": "visible", "height": $(document).height() + "px" });
            NEUE.Modal.$modalContent.css({ "margin-top": $(document).scrollTop() + "px" });
          }, 0);
        }
      } else {
        // modal is already open, so just replace current content
        NEUE.Modal.$modalContent.html( $(NEUE.Modal.href).html() );
      }

      // We'll set up form validation markup for anything in the modal (since it isn't in the DOM on load)
      // @TODO: Should be providing an event that other modules can hook into (so the Validation Module would take care of this).
      NEUE.Validation.prepareFormLabels(NEUE.Modal.$modalContent);
    },

    // Close modal
    close: function(event) {
      // Don't let the event bubble.
      if(event.target !== this) {
        return;
      }

      // Override default link behavior.
      event.preventDefault();

      // If Google Analytics is set up, we fire an event to track that a
      // modal has been closed.
      if(typeof(_gaq) !== "undefined" && _gaq !== null) {
        _gaq.push(["_trackEvent", "Modal", "Close", NEUE.Modal.href, null, true]);
      }

      if(Modernizr.cssanimations) {
        NEUE.Modal.$modalContent.addClass("fade-out-down");
        NEUE.Modal.$modal.addClass("fade-out");

        $("body").removeClass("modal-open");

        NEUE.Modal.$modal.one("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
          NEUE.Modal.$modal.remove();
          NEUE.Modal.modalIsOpen = false;
        });
      } else {
        $("body").removeClass("modal-open");
        NEUE.Modal.$modal.remove();
        NEUE.Modal.modalIsOpen = false;
      }
    }
  };


  $(document).ready(function() {
    // Trigger modal on click:
    $("body").on("click", ".js-modal-link", NEUE.Modal.open);

    // Close modal events are bound on modal initialization.
  });
})(jQuery);
