//
//  
//  **Applies a "fade up" animation when the object enters the viewport.**
// Requires the JQuery Visible plugin to calculate object visibility.
//
//

$(document).ready(function() {
  'use strict';

  // Cache all objects that we want to monitor so that we don't have to keep checking the DOM.
  var allFades = $('.js-fade-up-on-scroll');

  // We check each of the "fade" objects to see if its visible on the screen.
  // If so, we add the `.come-in` CSS class to perform the animation.
  function applyFade() {
    allFades.each(function(i, el) {
      el = $(el);
      if(el.realVisible(true)) {
        el.addClass('come-in');
      }
    });
  }

  // Perform a check on initial load, and then again whenever the user scrolls.
  applyFade();
  $(window).scroll(applyFade);
});