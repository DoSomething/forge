(function() {
  /**
   * Generate KSS state previews.
   */
  var KssStateGenerator = (function() {
    var psuedo_selectors;

    psuedo_selectors = ['hover', 'enabled', 'disabled', 'active', 'visited', 'focus', 'target', 'checked', 'empty', 'first-of-type', 'last-of-type', 'first-child', 'last-child'];

    function KssStateGenerator() {
      var idx, idxs, pseudos, replaceRule, rule, stylesheet, _i, _len, _len2, _ref, _ref2;
      pseudos = new RegExp("(\\:" + (psuedo_selectors.join('|\\:')) + ")", "g");
      try {
        _ref = document.styleSheets;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          stylesheet = _ref[_i];
          if (stylesheet.href.indexOf(document.domain) >= 0) {
            idxs = [];
            _ref2 = stylesheet.cssRules;
            for (idx = 0, _len2 = _ref2.length; idx < _len2; idx++) {
              rule = _ref2[idx];
              if ((rule.type === CSSRule.STYLE_RULE) && pseudos.test(rule.selectorText)) {
                replaceRule = function(matched, stuff) {
                  return matched.replace(/\:/g, '.pseudo-class-');
                };
                this.insertRule(rule.cssText.replace(pseudos, replaceRule));
              }
              pseudos.lastIndex = 0;
            }
          }
        }
      } catch (_error) {}
    }

    KssStateGenerator.prototype.insertRule = function(rule) {
      var headEl, styleEl;
      headEl = document.getElementsByTagName('head')[0];
      styleEl = document.createElement('style');
      styleEl.type = 'text/css';
      if (styleEl.styleSheet) {
        styleEl.styleSheet.cssText = rule;
      } else {
        styleEl.appendChild(document.createTextNode(rule));
      }
      return headEl.appendChild(styleEl);
    };

    return KssStateGenerator;

  })();

  new KssStateGenerator;

  /**
   * Add 'show code' buttons.
   */
  $(document).ready(function() {
    $(".styleguide-example").each(function () {
      var $markupSample = $(this).find(".styleguide-html");
      var $showMarkupLink = $("<p class='styleguide-markuplink'><a href='#'>Show Markup</a></p>");
      $showMarkupLink.on("click", function (event) {
        event.preventDefault();
        $markupSample.slideToggle();
        $(this).fadeOut();
      });

      if($markupSample.length) {
        $markupSample.hide();
        $(this).append($showMarkupLink);
      }
    });

  });


  /**
   * Animation previews.
   */
  $(document).ready(function() {
    $(".js-styleguide-animation-preview").on("click", function(e) {
      e.preventDefault();
      var animationClass = $(this).attr("data-class");

      $(this).toggleClass(animationClass);

      $(this).one("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
        $(this).removeClass(animationClass);
      });
    })
  });

  /**
   * Mobile table of contents.
   */
  $(document).ready(function() {
    $(".js-styleguide-navigation").addClass("is-hidden");

    $(".js-styleguide-navigation-toggle").on("click", function(e) {
      e.preventDefault();
      $(".js-styleguide-navigation").toggleClass("is-hidden");
    });
  });

}).call(this);


