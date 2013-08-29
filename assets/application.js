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

  $ = jQuery;

  window.sidebarActiveLinks = function() {
    var contentTop, topRange;
    topRange = 200;
    contentTop = [];
    $('nav.sidebar').find('a').each(function() {
      return contentTop.push($($(this).attr('href')).offset().top);
    });
    return $(window).scroll(function() {
      var bodyHeight, viewportHeight, windowTop;
      windowTop = $(window).scrollTop();
      bodyHeight = $(document).height();
      viewportHeight = $(window).height();
      return $.each(contentTop, function(i, loc) {
        if (loc > windowTop && (loc < windowTop + topRange || (windowTop + viewportHeight) >= bodyHeight)) {
          $('nav.sidebar a').removeClass("active");
          return $('nav.sidebar a').eq(i).addClass("active");
        }
      });
    });
  };

}).call(this);

/*
//@ sourceMappingURL=application.js.map
*/