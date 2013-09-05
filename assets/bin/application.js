(function() {
  var $, stickyRelocate;

  $ = jQuery;

  $(function() {
    return $(".js-jump-scroll").click(function(e) {
      var href;
      e.preventDefault();
      href = $(this).attr('href');
      return $('html,body').animate({
        scrollTop: $(e.target.hash).offset().top
      }, 'slow', function() {
        return window.location.hash = href;
      });
    });
  });

  $ = jQuery;

  $(function() {
    $(".js-menu-toggle").click(function(e) {
      return $(".main-menu").toggleClass("is-visible-mobile");
    });
    $("form.search input[type='search']").focus(function(e) {
      return $(".utility-link").addClass("is-hidden-on-phones");
    });
    return $("form.search input[type='search']").blur(function(e) {
      return $(".utility-link").removeClass("is-hidden-on-phones");
    });
  });

  $ = jQuery;

  window.pinToTop = function() {
    $(window).scroll(stickyRelocate);
    return stickyRelocate();
  };

  stickyRelocate = function(el) {
    var div_top, window_top;
    window_top = $(window).scrollTop();
    div_top = $("#js-pin-to-top-anchor").offset().top;
    if (window_top > div_top) {
      return $('.js-pin-to-top').addClass('is-stuck');
    } else {
      return $('.js-pin-to-top').removeClass('is-stuck');
    }
  };

}).call(this);

/*
//@ sourceMappingURL=application.js.map
*/