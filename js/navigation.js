/**
 * Event handlers for Navigation pattern.
 */

const $ = require('jquery');

$(document).ready(() => {
  // Toggle dropdown menu navigation on mobile:
  $('.js-navigation-toggle').on('touchstart mousedown', (event) => {
    event.preventDefault();

    $('.chrome').toggleClass('has-mobile-menu');
    $('.navigation').toggleClass('is-visible');
  });

  // Toggle menu on desktop
  $('.navigation__dropdown-toggle').on('click', (event) => {
    event.preventDefault();
    $('.navigation__dropdown').toggleClass('is-visible');
  });
});
