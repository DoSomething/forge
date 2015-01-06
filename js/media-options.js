define(function() {
  "use strict";

  var $ = window.jQuery;

  /**
    * Creates an instance of MediaOptionsSelector.
    *
    * @constructor
    * @this {MediaOptionsSelector}
    * @param {jQuery} $fieldGroup The container element for the input field and media element
    * @param {object} options Options.
  */
  var MediaOptionsSelector = function ($fieldGroup, options) {
    if ($fieldGroup === undefined || !$($fieldGroup.length)) { return; }
    if (!this instanceof MediaOptionsSelector) { return new MediaOptionsSelector($fieldGroup, options); }
    var _this = this;

    options = options || {};
    _this.options = options = {
      fieldClassName: (typeof options.fieldClassName === "string") ? options.fieldClassName : "media-options",
      fieldSelector: (typeof options.fieldSelector === "string") ? options.fieldSelector : ".-radio",
      optionSelector: (typeof options.optionSelector === "string") ? options.optionSelector : "label"
    };

    _this.$fieldGroup = $($fieldGroup).addClass(_this.options.fieldClassName);
    _this.$checked = [];
    _this.init();
  };

  MediaOptionsSelector.prototype = {
    /**
      * Adds event listeners to each field
    */
    init: function() {
      var _this = this;

      _this.$fieldGroup.find(_this.options.fieldSelector).each(function() {
        var $field = $(this);

        // if default selected field exists, set to 'selected' state
        if ($field.find("input[type='radio']:checked").length > 0) {
          _this.check($field);
        }

        // add click event to toggle 'selected' class and check/uncheck radios
        $field.find(_this.options.optionSelector).on("click", function () {
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
    check: function($field) {
      $field.addClass("is-selected").find("input[type='radio']").attr("checked", true);
      this.$checked = $field;
    },

    /**
      * Removes checked state to field
      * @param {jQuery} $field The field.
    */
    uncheck: function($field) {
      $field.removeClass("is-selected").find("input[type='radio']").attr("checked", false);
    }
  };

  $(function() {
    // Instantiate the media radio selectors
    $(".js-media-options").each(function() {
      new MediaOptionsSelector($(this), null);
    });
  });

});
