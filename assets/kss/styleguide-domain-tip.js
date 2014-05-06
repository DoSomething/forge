/**
 * Suggests visiting neue.dosomething.org instead of
 * the old styleguide.dosomething.org!
 */

$(function () {
  // If user visits styleguide.dosomething.org, move them:
  if(window.location.hostname === "styleguide.dosomething.org") {
    window.location.replace("http://neue.dosomething.org/?redirected=true");
  }

  // Then tell them of their folly:
  if(window.location.search === "?redirected=true") {
    var $warning = $("<div class='messages'>The styleguide has moved! Update your bookmarks to <a href='http://neue.dosomething.org'>neue.dosomething.org</a>.");

    $("body").prepend($warning);
    $warning.hide();
    $warning.slideDown();

    NEUE.Messages.attachCloseButton( $warning );
  }
});
