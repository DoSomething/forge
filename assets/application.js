(function() {
  $(".js-jump-scroll").on("click", function(e) {
    var href;
    e.preventDefault();
    href = $(this).attr('href');
    return $('html,body').animate({
      scrollTop: $(e.target.hash).offset().top
    }, 'slow', function() {
      return window.location.hash = href;
    });
  });

  $(".js-menu-toggle").on("click", function(e) {
    $(".main-menu").toggleClass("is-visible-mobile");
    return console.log("yo");
  });

  $("form.search input[type='search']").on("focus", function(e) {
    return $(".utility-link").addClass("is-hidden-on-phones");
  });

  $("form.search input[type='search']").on("blur", function(e) {
    return $(".utility-link").removeClass("is-hidden-on-phones");
  });

}).call(this);

/*
//@ sourceMappingURL=application.js.map
*/