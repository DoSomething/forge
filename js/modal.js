/**
 * @module neue/modal
 * Show/hide modals. Link should have `.js-modal-link` class, and
 * it's `href` should point to the hash of the modal. By convention, the
 * modal ID should be prefixed with `modal--` like so:
 *
 * @example
 * // <script type="text/cached-modal" id="modal--login">
 * //   <!-- content -->
 * // </script>
 *
 */

define(function(require) {
  "use strict";

  var $ = window.jQuery;
  var Modernizr = window.Modernizr;
  var Events = require("./events");

  // We can only have one modal open at a time; we track that here.
  var modalIsOpen = false;

  // The modal container (including background overlay).
  var $modal = null;

  // The content of the modal.
  var $modalContent = null;

  // Reference to current modal source
  var $reference = null;

  // Whether this modal can be closed by the user
  var closeable = false;

  // Return a boolean if modal is open or not
  var isOpen = function() {
    return modalIsOpen;
  };

  // Click handler for opening a new modal
  var _openHandler = function(event) {
    event.preventDefault();
    var href = "";

    if( $(this).data("cached-modal") ) {
      // Preferred method: We load the modal specified in the `data-cached-modal` attribute.
      // This allows `href` to act as a backup if JS is disabled. For example,
      // `<a class="js-modal-link" data-cached-modal="#modal--faq" href="faq.html">Click</a>`
      // would open a modal with the contents of `<div id="modal--faq"></div>`.
      href = $($(this).data("cached-modal"));
    } else if ( event.target.hash.charAt(0) === "#"  ) {
      // We find the modal based on the ID in the link"s `href`. For example,
      // `<a class="js-modal-link" href="#modal--faq">Click me</a>` would open
      // `<div id="modal--faq"></div>`.
      href = $(event.target.hash);
    } else {
      // @TODO: We should handle AJAX loading things in.
    }

    open(href);
  };

  /**
   * Open a new modal
   * @param {jQuery}  $el                 Element that will be placed inside the modal.
   * @param {boolean} [options.animated=true]     Use animation for opening the modal.
   * @param {boolean} [options.closeButton]       Override `data-modal-close` attribute.
   * @param {boolean} [options.skipForm]          Override `data-modal-skip-form` attribute.
   */
  var open = function($el, options) {
    // Default arguments
    options = options || {};
    options.animated = typeof options.animated !== "undefined" ? options.animated : true;
    options.closeButton = typeof options.closeButton !== "undefined" ? options.closeButton : $el.attr("data-modal-close");
    options.skipForm = typeof options.skipForm !== "undefined" ? options.skipForm : $el.attr("data-modal-skip-form");

    var id = $el.attr("id");
    if(id) {
      // Save ID of modal for future reference
      $reference = "#" + id;

      // Set URL hash in the browser
      window.location.hash = "#" + id;
    } else {
      $reference = "";
    }

    // If Google Analytics is set up, we fire an event to track that a
    // modal has been opened.
    if(typeof(_gaq) !== "undefined" && _gaq !== null) {
      _gaq.push(["_trackEvent", "Modal", "Open", $reference, null, true]);
    }

    if( !modalIsOpen ) {
      // create modal in DOM
      $modal = $("<div class=\"modal\"></div>");
      $modalContent = $("<div></div>");
      $modal.append($modalContent);
      $modalContent.html( $el.html() );

      // set up overlay and show modal
      $("body").addClass("modal-open");
      $("body").append($modal);

      if(options.animated && Modernizr.cssanimations) {
        $modal.addClass("fade-in");
        $modalContent.addClass("fade-in-up");
      }

      // copy classes from modal source
      $modalContent.removeClass();
      $modalContent.addClass("modal-content");
      $modalContent.addClass( $el.attr("class") );

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
      $modalContent.removeClass();
      $modalContent.addClass("modal-content");
      $modalContent.addClass( $el.attr("class") );
      $modalContent.html( $($el).html() );
    }

    // We add a "close" button programmatically
    // @param [data-modal-close=true]
    switch (options.closeButton) {
      case "skip":
        // Add a skip button, which delegates to the submitting the form with the given ID
        var $skipForm = $( options.skipForm );
        var $skipLink = $("<a href='#' class='js-close-modal modal-close-button -alt'>skip</a>");
        $modalContent.prepend( $skipLink );
        $skipLink.on("click", function(event) {
          event.preventDefault();
          $skipForm.submit();
        });
        closeable = false; // cannot close modal by clicking background
        break;

      case "yes":
      case "true":
      case "1":
        $modalContent.prepend("<a href='#' class='js-close-modal modal-close-button'>&#215;</a>");
        closeable = true;
        break;
      default:
        closeable = false;
    }

    var closeClass = $el.attr("data-modal-close-class");
    if(closeClass) {
      $modalContent.find(".js-close-modal").addClass(closeClass);
    }

    // We provide an event that other modules can hook into to perform custom functionality when
    // a modal opens (such as preparing things that are added to the DOM, etc.)
    Events.publish("Modal:opened", $modalContent);

    // If Drupal has some messages on the screen, move them inside the modal
    // @TODO: We need a better solution for this.
    var $messages = $(".messages");
    var $messagesClone = $modalContent.find(".js-messages-clone");
    if($messagesClone && $messages.length ) {
      $messagesClone.addClass("modal-messages");
      $messagesClone.html( $messages[0].outerHTML );
      $messagesClone.find(".js-close-message").remove();
    }
  };

  var _closeHandler = function(event) {
    // Don't let the event bubble.
    if(event.target !== this) {
      return;
    }

    // Only close on clicking overlay if this modal has a "x" close button
    if(!closeable) {
      return;
    }

    // Override default link behavior.
    event.preventDefault();

    close();
  };

  /**
   * Close the active modal.
   * @param {boolean} [animated=true] Use animation for closing the modal.
   */
  var close = function(animated) {
    // Default arguments
    animated = typeof animated !== "undefined" ? animated : true;

    // Remove URL hash for modal from browser
    if(window.location.hash === $reference) {
      window.location.hash = "/";
    }

    // If Google Analytics is set up, we fire an event to track that a
    // modal has been closed.
    if(typeof(_gaq) !== "undefined" && _gaq !== null) {
      _gaq.push(["_trackEvent", "Modal", "Close", $reference, null, true]);
    }

    if(animated && Modernizr.cssanimations) {
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

    //If there's a hash in the URL, let's check if its a modal and load it
    var hash = window.location.hash;
    if(hash && hash !== "#/" && $(hash) && $(hash).attr("type") === "text/cached-modal" ) {
      open($(hash), false);
    }

    // Close modal events are bound on modal initialization.
  });


  // Return public API for controlling modals
  return {
    isOpen: isOpen,
    open: open,
    close: close
  };

});
