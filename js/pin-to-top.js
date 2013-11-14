/**
  
  Pins a div to the top of the screen on scroll.

 */

window.DS = window.DS || {};

window.DS.pinToTop = function() {
  'use strict';

  var stickyRelocate = function() {
    var windowTop = $(window).scrollTop();
    var divTop = $('#js-pin-to-top-anchor').offset().top;
    
    if (windowTop > divTop) {
      $('.js-pin-to-top').addClass('is-stuck');
    } else {
      $('.js-pin-to-top').removeClass('is-stuck');
    }
  };

  $(window).scroll(stickyRelocate);
  stickyRelocate();
};

