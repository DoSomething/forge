//
// 
//  **Applies a smooth-scroll animation on `.jump-scroll` links.**
//
//

$(document).ready(function() {
  'use strict';

  $('.js-jump-scroll').on('click', function(e) {
    e.preventDefault();

    var href = $(this).attr('href');
    
    // Animate scroll position to the target of the link:
    $('html,body').animate({scrollTop: $(e.target.hash).offset().top}, 'slow', function() {
      // Finally, set the correct hash in the address bar.
      window.location.hash = href;
    });
  });
});