define(function(require) {
  "use strict";

  var $ = window.jQuery;

  var $tabs = $(".js-tabs"),
      $tabMenuLinks = $tabs.find(".tabs__menu a");

  // Show the first tab in any "js-tabs" collection.
  $tabs.each(function() {
    $(this).find(".tabs__tab").first().addClass("is-active");
  });

  // View other tabs on click.
  $tabMenuLinks.on("click", function(event) {
    event.preventDefault();

    var $this = $(this),
        $siblings = $this.parent().siblings(),
        selection = $this.data("tab") - 1,
        $tabs = $this.closest(".js-tabs").find(".tabs__tab"),
        tab = $tabs.get(selection);

    $siblings.removeClass("is-active");
    $this.parent().addClass("is-active");

    // Show selected tab.
    $tabs.removeClass("is-active");
    $(tab).addClass("is-active");

  });

});
