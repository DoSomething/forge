/**
 * Event handlers for Footer pattern.
 */

const $ = require('jquery');

$(document).ready(() => {
  // Hide footer on mobile until clicked
  const $collapsible = $('.js-toggle-collapsed');
  $collapsible.addClass('is-collapsed is-toggleable');
  $collapsible.on('click', function () {
    if (window.matchMedia('screen and (max-width: 768px)').matches) {
      $(this).toggleClass('is-collapsed');
    }
  });
});
