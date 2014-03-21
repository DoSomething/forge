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

  $(document).ready(function() {

    var message      = "div.messages";
    var messageClose = "<a href=\"#\" class=\"js-close-message message-close-button white\">×</a>";

    // Create message close button
    $(message).append(messageClose);

    // Close message when "x" is clicked:
    $(".js-close-message").on("click", function(e) {
      e.preventDefault();

      $(this).parent(message).slideUp();
    });
  });
})(jQuery);
