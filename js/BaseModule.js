/*global _ */

//
//
// Base NEUE Module that should be extended when creating other modules. It
// provides some common methods and organization so you don't have to a lot
// of busywork. See `_exampleModule.js` for an annotated example implementation.
//

//
// ## Features
//  - Handles initializing modules, including overriding default options if necessary.
//  - Provides a standard location to keep state information, views, templates, and events.
//  - Binds events in the Events object to the root element on initialization.
//  - Prepares any templates in the Templates object.
//
// ---------------------------------------------------------------------------------------------

(function($) {
  "use strict";

  // TODO: Perhaps move this to a general configuration file? Not sure if it makes sense here...
  // We configure Underscore templating to use brackets (Mustache-style) syntax.
  _.templateSettings = {
    evaluate:    /\{\{=(.+?)\}\}/g,
    interpolate: /\{\{(.+?)\}\}/g,
    escape:      /\{\{-(.+?)\}\}/g
  };

  // We create the global NEUE namespace if it doesn"t already exist, and attach BaseModule to it.
  window.NEUE = window.NEUE || {};
  window.NEUE.BaseModule = {
    // The `initialized` variable will track if this module has been initialized yet.
    initialized: false,

    // #### Options ####
    //
    // We store options in the `Options` object. This is created by extending the `defaultOptions` object
    // with any options passed to the initialize method.
    Options: {},
    defaultOptions: {},

    // #### State ####
    //
    // `State` is a nice place to keep module state information. It has no special behavior.
    State: {},

    // #### Views ####
    //
    // `Views` is a nice place to keep your module's views. Views should be stored as references to jQuery objects.
    // The root element for your module (given in the constructor) is stored as `$el`.
    Views: {},

    // #### Templates ####
    // `Templates` stores your Underscore templates. Templates will be compiled during initialization so they can
    // be used at any point later. Syntax:
    //
    // ```javascript
    //  Templates: {
    //    templateName: "<selector>",
    //  }
    //
    // ```

    Templates: {},

    // #### Events ####
    // `Events` should be used to bind any DOM events your module needs. Events are bound to the root element (`$el`)
    // so that they don't have to be re-bound as subviews are added and removed from the DOM. Syntax:
    //
    // ```javascript
    // Events: {
    //   "<selector> <event>": "<handler>"
    // }
    // ```
    //
    Events: {},

    // #### Initialize ####
    // The `initialize` function calls Neue's base module initializer and then a custom initializer if there is one.
    // Once both have run, it sets the `initialized` variable to `true`.
    initialize: function(element, opts) {
      this._baseInitialize(element, opts);

      if (typeof this._initialize === "function") {
        this._initialize();
      }

      this.initialized = true;
    },

    // Just like in Backbone, we extend our modules from this base class.
    extend: function(extensions) {
      return _.extend(this, extensions);
    },

    // The base initialization method is run on all modules.
    _baseInitialize: function(element, opts) {
      var _this = this;

      // We take the element given in the constructor and set it as the base view element.
      this.Views.$el = element;
      this.$el = this.Views.$el; // shortcut!

      // We override default options with any settings passed during initialization:
      if ((typeof opts !== "undefined" && opts !== null)) {
        this.Options = $.extend({}, this.defaultOptions, opts);
      } else {
        this.Options = this.defaultOptions;
      }

      // We clear out the contents of the base view element, prepare our templates, and bind events.
      $(document).ready(function() {
        _this.$el.html("");
        _this._prepareTemplates();
        _this._bindEvents();
      });
    },

    // #### Bind Events ####
    // We iterate through the `Events` object and bind any events defined there to the root element.
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
      });
    },

    // #### Prepare Templates ####
    // We'll compile any templates into Underscore template functions.
    _prepareTemplates: function() {
      var _this = this;

      _.each(this.Templates, function(templateDOM, templateID) {
        _this.Templates[templateID] = _.template( $(templateDOM).html() );
      });
    }
  };

})(jQuery);
