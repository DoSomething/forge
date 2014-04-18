//
//
//  **System Messages.** Will create a close ("X") button
//  for users with JavaScript enabled that uses the following
//  syntax to hook into this function:
//
//  <div class="js-message">Alert! You win.</div>>
//
//  This will produce the following markup after the script executes:
//
//  <div class="js-message">Alert! You win.
//    <a href="#" class="js-close-message">x</a>
//  </div>>
//
//

var NEUE = NEUE || {};

(function($) {
  "use strict";

  NEUE.Messages = (function() {
    var messageClose = "<a href=\"#\" class=\"js-close-message message-close-button white\">×</a>";

    /**
    * Adds a close button to system message banner, with optional callback.
    *
    * @param {jQuery}   $messages  Object containing message divs to be modified.
    * @param {function} callback   Callback fired after message is closed.
    */
    var attachCloseButton = function($messages, callback) {
      // Create message close button
      $messages.append(messageClose);

      // Close message when "x" is clicked:
      $messages.on("click", ".js-close-message", function(event) {
        event.preventDefault();
        $(this).parent(".messages").slideUp();

        if(callback && typeof callback === "function") {
          callback();
        }
      });
    };

    return {
      attachCloseButton: attachCloseButton
    };
  })();

  $(document).ready(function() {
    NEUE.Messages.attachCloseButton( $(".messages") );
  });
})(jQuery);
