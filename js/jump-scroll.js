/**
  
  Applies a smooth-scroll animation on `.jump-scroll` links.

 */

$(document).ready(function() {
  'use strict';

  $('.js-jump-scroll').on('click', function(e) {
    e.preventDefault();

    var href = $(this).attr('href');
    $('html,body').animate({scrollTop: $(e.target.hash).offset().top}, 'slow', function() {
      window.location.hash = href;
    });
  });
});