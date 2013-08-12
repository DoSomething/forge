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

  $(".js-menu-toggle").click(function(e) {
    return $(".main-menu").toggleClass("is-visible-mobile");
  });

  $("form.search input[type='search']").focus(function(e) {
    return $(".utility-link").addClass("is-hidden-on-phones");
  });

  $("form.search input[type='search']").blur(function(e) {
    return $(".utility-link").removeClass("is-hidden-on-phones");
  });

}).call(this);

/*
//@ sourceMappingURL=application.js.map
*/