/**
  
  Show/hide modals.

 */


$(document).ready(function() {
  'use strict';

  // trigger modal on click
  $('.js-close-modal').on('click', function(e) {
    e.preventDefault();
    var href = '#{$(this).attr("href")}';

    $('body').addClass('modal-open');
    $(href).show();

    // close modal when 'x' is clicked
    $('.js-close-modal').on('click', function(e) {
      e.preventDefault();
      $(this).closest('.modal').hide();
      $('body').removeClass('modal-open');
    });
  });

});