/**
 * Initialize and attach event handlers for Tabs pattern.
 */

import $ from "jquery";

$(document).ready(function() {

  let $tabs = $(".js-tabs");
  let $tabMenuLinks = $tabs.find(".tabs__menu a");

  // Show the first tab in any "js-tabs" collection.
  $tabs.each(function() {
    $(this).find(".tabs__tab").first().addClass("is-active");
  });

  // View other tabs on click.
  $tabMenuLinks.on("click", function(event) {
    event.preventDefault();

    let $siblings = $(this).parent().siblings();
    let selection = $(this).data("tab") - 1;
    let $tabs = $(this).closest(".js-tabs").find(".tabs__tab");
    let tab = $tabs.get(selection);

    $siblings.removeClass("is-active");
    $(this).parent().addClass("is-active");

    // Show selected tab.
    $tabs.removeClass("is-active");
    $(tab).addClass("is-active");
  });

});


