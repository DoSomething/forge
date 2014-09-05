define(function() {
  "use strict";

  var $ = window.jQuery;

  /**
    * Creates an instance of MediaRadioSelector.
    *
    * @constructor
    * @this {MediaRadioSelector}
    * @param {jQuery} $container The container element for the input field and media element
    * @param {object} opts Options.
  */
  var MediaRadioSelector = function ($fieldGroup, opts) {
    if ($fieldGroup === undefined || !$($fieldGroup.length)) { return; }
    if (!this instanceof MediaRadioSelector) { return new MediaRadioSelector($fieldGroup, opts); }
    var _this = this;
    opts = opts || {};
    _this.cfg = opts = {
      fieldClassName: (typeof opts.fieldClassName === "string") ? opts.fieldClassName : "media-options",
      fieldSelector: (typeof opts.fieldSelector === "string") ? opts.fieldSelector : ".form-type-radio",
      optionSelector: (typeof opts.optionSelector === "string") ? opts.optionSelector : "label"
    };
    _this.$fieldGroup = $($fieldGroup).addClass(_this.cfg.fieldClassName);
    _this.$checked = [];
    _this.init();
  };

  MediaRadioSelector.prototype = {
    /**
      * Adds event listeners to each field
    */
    init: function () {
      var _this = this,
        cfg = _this.cfg;

      _this.$fieldGroup.find(cfg.fieldSelector).each(function (idx) {
        var $field = $(this),
          className = (idx + 1) % 2 === 0 ? "-second" : "-first";

        // add 'index' class name for legacy IE
        $field.addClass(className);

        // if default selected field exists, set to 'selected' state
        if ($field.find("input[type='radio']:checked").length > 0) {
          _this.check($field);
        }

        // add click event to toggle 'selected' class and check/uncheck radios
        $field.find(cfg.optionSelector).on("click", function () {
          if (_this.$checked.length > 0) {
            _this.uncheck(_this.$checked);
          }
          _this.check($field);
        });
      });
    },

    /**
      * Adds checked state to field
      * @param {jQuery} $field The field.
    */
    check: function ($field) {
      $field.addClass("selected").find("input[type='radio']").attr("checked", true);
      this.$checked = $field;
    },

    /**
      * Removes checked state to field
      * @param {jQuery} $field The field.
    */
    uncheck: function ($field) {
      $field.removeClass("selected").find("input[type='radio']").attr("checked", false);
    }
  };

  $(function() {
    // Instantiate the media radio selectors
    $(".js-media-options").each(function () {
      new MediaRadioSelector($(this));
    });
  });

});
