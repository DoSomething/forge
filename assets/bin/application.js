(function() {
  var $, bindResetButton, findLocation, idx, idxs, ignore, rule, setScrollIndicatorVisibility, stickyRelocate, stylesheet, _i, _j, _k, _len, _len1, _len2, _ref, _ref1;

  $ = jQuery;

  $(function() {
    var allFades, win;
    win = $(window);
    allFades = $(".js-fade-up-on-scroll");
    allFades.each(function(i, el) {
      el = $(el);
      if (el.real_visible(true)) {
        return el.addClass("come-in");
      }
    });
    return $(window).scroll(function(e) {
      return allFades.each(function(i, el) {
        el = $(el);
        if (el.real_visible(true)) {
          return el.addClass("come-in");
        }
      });
    });
  });

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

  window.initializeLocationFinder = function() {
    $(".no-js-feature-warning").hide();
    $(".no-js-hide-feature").show();
    $(".js-location-finder-results").hide();
    $(".js-location-finder-button").click(function(e) {
      e.preventDefault();
      return findLocation();
    });
    return $(".js-location-finder-form").submit(function(e) {
      e.preventDefault();
      return findLocation();
    });
  };

  findLocation = function() {
    var zip;
    $(this).addClass("loading");
    zip = $(".js-location-finder-input").val();
    if (zip.match(/^\d{5}$/)) {
      return $.get('/example-data.json', function(data) {
        $(".js-location-finder-results-zip").text(zip);
        $(".js-location-finder-results .location-list").html("");
        $.each(data.results, function(index, value) {
          return $(".js-location-finder-results .location-list").append("<li>\n  <strong>" + value.name + "</strong><br>\n  " + value.street + ", " + value.city + ", " + value.state + " " + value.zip + "<br>\n  (555) 555-5555\n</li>");
        });
        $(".js-location-finder-form").slideUp(400);
        $(".js-location-finder-results").slideDown(400);
        return bindResetButton();
      }).fail(function() {
        $(".js-location-finder-results").html("<div class='alert error'>We had trouble talking to the server. Check that your internet connection is working, or try reloading the page.");
        $(".js-location-finder-form").slideUp(400);
        return $(".js-location-finder-results").slideDown(400);
      });
    } else {
      $(".js-location-finder-button").removeClass("loading");
      $(".js-location-finder-form").append("<div id='js-location-finder-validation-error' class='alert error'>Slow down buddy, that's not a zip code.</div>").slideDown(400);
      return $(".js-location-finder-input").bind("propertychange input keyup", function() {
        return $("#js-location-finder-validation-error").delay(800).slideUp(400, function() {
          return $("#js-location-finder-validation-error").remove();
        });
      });
    }
  };

  bindResetButton = function() {
    return $(".js-location-finder-reset").click(function(e) {
      e.preventDefault();
      $(".js-location-finder-results").slideUp(400);
      $(".js-location-finder-form").slideDown(400);
      $(".js-location-finder-results .location-list").html("");
      return $(".js-location-finder-button").removeClass("loading");
    });
  };

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

  $ = jQuery;

  $(function() {
    return $(".js-toggle-video-link").click(function() {
      $(".js-toggle-video-link").hide();
      $(".scroll-indicator-link").hide();
      $(".js-toggle-video-container").html("<iframe src='http://www.youtube.com/embed/nz8mmznuasw?autoplay=1&amp;modestbranding=1&amp;autohide=1' frameborder='0' allowfullscreen></iframe>");
      return $(".js-toggle-video-container").show();
    });
  });

  window.initializeScrollIndicatorVisibility = function() {
    setScrollIndicatorVisibility();
    return $(window).on("scroll touchmove resize", function() {
      return setScrollIndicatorVisibility();
    });
  };

  setScrollIndicatorVisibility = function() {
    var content_top, window_top;
    window_top = $(window).scrollTop();
    content_top = $(".js-scroll-indicator-link-killer").offset().top;
    if ($(".js-scroll-indicator-link-killer").visible(true)) {
      return $(".scroll-indicator-link").fadeOut(400);
    } else if (window_top < content_top) {
      return $(".scroll-indicator-link").fadeIn(400);
    }
  };

}).call(this);

/*
//@ sourceMappingURL=application.js.map
*/