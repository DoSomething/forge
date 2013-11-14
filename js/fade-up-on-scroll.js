/**
  
  Applies a "fade up" animation when the object enters the viewport.

 */

$(document).ready(function() {
  'use strict';

  var allFades = $('.js-fade-up-on-scroll');

  // check if already visible
  allFades.each(function(i, el) {
    el = $(el);
    if(el.realVisible(true)) {
      el.addClass('come-in');
    }
  });

  $(window).scroll(function() {
    allFades.each(function(i, el) {
      el = $(el);
      if(el.realVisible(true)) {
        el.addClass('come-in');
      }
    });
  });
});