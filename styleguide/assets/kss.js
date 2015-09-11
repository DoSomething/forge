(function() {
  var $ = window.jQuery;

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

  /**
   * Filtering!
   */
  function includes(text, term) {
    return text.indexOf(term) !== -1;
  }

  $(document).ready(function() {

    // Press `t` to filter patterns
    $(document).on('keydown', function(event) {
      if (event.target !== document.body) return;

      if(event.keyCode === 84) {
        event.preventDefault();
        $('.js-styleguide-filter').focus();
      }
    });

    // Live filtering
    $('.js-styleguide-filter').on('keyup', function(event) {
      var term = $(this).val().toLowerCase();
      var $items = $('.js-styleguide-navigation li');

      // "Jump" to first match if enter is pressed
      if (event.keyCode === 13) {
        event.preventDefault();

        var $first = $items.filter('.is-expanded:not(.is-hidden)').first();

        var $child = $first.find('.is-expanded:not(is-hidden)');
        if ($child.length) {
          $first = $child;
        }

        $first.find('a').first().trigger('click');
      }

      // Remove classes if search field is emptied
      if (term === '') {
        $items
          .removeClass('is-expanded')
          .removeClass('is-hidden');

        return;
      }

      $items.each(function() {
        var contents = $(this).text().toLowerCase();

        if (includes(contents, term)) {
          $(this).addClass('is-expanded');
          $(this).removeClass('is-hidden');
        } else {
          $(this).addClass('is-hidden');
        }
      });

    });

  });

}).call(this);


