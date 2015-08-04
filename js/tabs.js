/**
 * Initialize and attach event handlers for Tabs pattern.
 */

import $ from 'jquery';

$(document).ready(function() {
  const $tabs = $('.js-tabs');
  const $tabMenuLinks = $tabs.find('.tabs__menu a');

  // Show the first tab in any 'js-tabs' collection.
  $tabs.each(function() {
    $(this).find('.tabs__tab').first().addClass('is-active');
  });

  // View other tabs on click.
  $tabMenuLinks.on('click', function(event) {
    event.preventDefault();

    const $siblings = $(this).parent().siblings();
    const selection = $(this).data('tab') - 1;
    const $innerTabs = $(this).closest('.js-tabs').find('.tabs__tab');
    const tab = $innerTabs.get(selection);

    $siblings.removeClass('is-active');
    $(this).parent().addClass('is-active');

    // Show selected tab.
    $innerTabs.removeClass('is-active');
    $(tab).addClass('is-active');
  });
});


