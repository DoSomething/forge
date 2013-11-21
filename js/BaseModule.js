/*global _ */

//
//
// Base NEUE Module that should be extended when creating other modules. It
// provides some common methods and organization so you don't have to a lot
// of busywork. See `_exampleModule.js` for an annotated example implementation.
//
// ```js
// window.DS.ExampleModule = window.NEUE.BaseModule.extend({
//   
// });
//
// ```
//
//

(function() {
  "use strict";

  // TODO: Perhaps move this to a general configuration file? Not sure if it makes sense here...
  // We configure Underscore templating to use brackets (Mustache-style) syntax.
  _.templateSettings = {
    evaluate:    /\{\{=(.+?)\}\}/g,
    interpolate: /\{\{(.+?)\}\}/g,
    escape:      /\{\{-(.+?)\}\}/g
  };

  // We create the global NEUE namespace if it doesn"t already exist, and attach our module to it.
  window.NEUE = window.NEUE || {};

  window.NEUE.BaseModule = {
    initialized: false,
    
    Options: {},
    defaultOptions: {},

    State: {},
    Views: {},
    Templates: {},
    Events: {},

    initialize: function(element, opts) {
      this._baseInitialize(element, opts);
      this._initialize();

      this.initialized = true;
    },

    extend: function(extensions) {
      return _.extend(this, extensions);
    },

    _initialize: function() {
      // __You can override this in your module to do some custom initialization.__
    },

    _baseInitialize: function(element, opts) {
      var _this = this;

      this.Views.$el = element;
      this.$el = this.Views.$el; // shortcut!

      // We override default options with any settings passed during initialization:
      if ((typeof opts !== "undefined" && opts !== null)) {
        this.Options = $.extend({}, this.defaultOptions, opts);
      } else {
        this.Options = this.defaultOptions;
      }

      $(document).ready(function() {
        _this.$el.html("");
        _this._prepareTemplates();
        _this._bindEvents();
      });
    },

    _bindEvents: function() {
      var rootElement = this.$el;
      var _this = this;

      _.each(this.Events, function(target, trigger) {
        var elementSelector = trigger.split(" ")[0];
        var eventType = trigger.split(" ")[1];

        rootElement.on(eventType, elementSelector, function(event) {
          event.preventDefault();
          _this[target]();
        });

        console.log("BOUND: " + elementSelector + " :: " + eventType + " --> " + target);
      });
    },

    _prepareTemplates: function() {
      var _this = this;

      _.each(this.Templates, function(templateDOM, templateID) {
        console.log("CREATING TEMPLATE FUNCTION: " + templateID + " :: " + $(templateDOM).html());

        _this.Templates[templateID] = _.template( $(templateDOM).html() );
      });
    }
  };

})();