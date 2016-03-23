/**
 * Enables 'toggle' functionality on Footnote pattern.
 */

const $ = require('jquery');

$(document).ready(() => {
  // Look for any `js-footnote-toggle` hooks...
  $('.js-footnote-toggle').each(function () {
    const $content = $(this).closest('.footnote').find('.js-footnote-hidden');

    // Hide content in a footnote if there's a toggle link.
    $content.hide();

    // Make toggle into a link
    $(this).wrapInner('<a href="#"></a>').on('click', (event) => {
      event.preventDefault();
      $content.slideToggle();
    });
  });
});
