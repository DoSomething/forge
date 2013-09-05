(function() {
  var $, idx, idxs, ignore, rule, stickyRelocate, stylesheet, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;

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
    return $(document).ready(function() {
      $(".js-menu-toggle").click(function(e) {
        return $(".main-menu").toggleClass("is-visible-mobile");
      });
      $(".search form input[type='search']").focus(function(e) {
        return $(".utility-link").addClass("is-hidden-on-phones");
      });
      return $(".search form input[type='search']").blur(function(e) {
        return $(".utility-link").removeClass("is-hidden-on-phones");
      });
    });
  });

  if (Modernizr.touch) {
    ignore = /:hover\b/;
    try {
      _ref = document.styleSheets;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        stylesheet = _ref[_i];
        idxs = [];
        _ref1 = stylesheet.cssRules;
        for (idx = _j = 0, _len1 = _ref1.length; _j < _len1; idx = ++_j) {
          rule = _ref1[idx];
          if (rule.type === CSSRule.STYLE_RULE && ignore.test(rule.selectorText)) {
            idxs.unshift(idx);
          }
        }
        for (_k = 0, _len2 = idxs.length; _k < _len2; _k++) {
          idx = idxs[_k];
          stylesheet.deleteRule(idx);
        }
      }
    } catch (_error) {}
  }

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