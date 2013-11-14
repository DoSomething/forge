//
//
//  **Show/hide modals.**
//
//


$(document).ready(function() {
  'use strict';

  // Trigger modal on click:
  $('.js-close-modal').on('click', function(e) {
    e.preventDefault();
    
    // We find the modal based on the ID in the link's `href`. For example,
    // `<a href="#modal--faq">Click me</a>` would open `<div id="modal--faq"></div>`.
    var href = $(e.target.hash);

    $('body').addClass('modal-open');
    $(href).show();

    // Close modal when 'x' is clicked:
    $('.js-close-modal').on('click', function(e) {
      e.preventDefault();
      $(this).closest('.modal').hide();
      $('body').removeClass('modal-open');
    });
  });

});