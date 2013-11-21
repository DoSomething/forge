/*global Modernizr, _ */

//
//
// An example code module. Example usage:
//
// ```js
// window.DS.LocationFinder.initialize(<JQuery element>, {
//   configuration_option: true
// });
//
// exampleModule.getStatus();
// ```
//
//

(function() {
  "use strict";

  // TODO: Move this somewhere more general
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

  // ------------------------------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------------------------------
  // ------------------------------------------------------------------------------------------------------------



  window.DS = window.DS || {};
  window.DS.LocationFinder = window.NEUE.BaseModule.extend({
    defaultOptions: {
      url: "/example-data.json"
    },
    
    // #### Events: ####   
    Events: {
      ".js-location-finder-toggle-form click": "toggleFormType",
      ".js-location-finder-submit click": "findLocation",
      ".js-location-finder-form submit": "findLocation"
    },

    // #### State Variables: #### 
    // - mode: "zip" (default), "geo"
    State: {
      mode: "zip"
    },

    // #### Views: ####
    // - $el
    // - $formView
    // - $resultsView

    // #### Templates: ####
    Templates: {
      searchFormGeo: "#template--locfinder-geo",
      searchFormZip: "#template--locfinder-zip",
      locationResult: "#template--locfinder-result"
    },

    // Sets up everything the Location Finder module needs to function.
    _initialize: function() {
      var _this = this;

      // Create view containers:
      this.Views.$formView = $("<div/>", {
        className: "locfinder-form"
      });

      this.Views.$resultsView = $("<div/>", {
        className: "locfinder-results"
      });

      $(document).ready(function() {
        // We'll append our views to the given element.
        _this.Views.$formView.appendTo(_this.$el);
        _this.Views.$resultsView.appendTo(_this.$el);

        // We'll default to the geolocation form if the browser supports it. Otherwise, we just show the 'ol zip code.
        if(Modernizr.geolocation) {
          _this.Views.$formView.html( _this.Templates.searchFormGeo );
          _this.State.mode = "geo";
        } else {
          _this.Views.$formView.html( _this.Templates.searchFormZip );
          _this.State.mode = "zip";
        }
      });
    },

    // Public: Switches Form View between the geolocation form & the zip-code form.
    toggleFormType: function() {
      if(this.State.mode === "zip") {
        this.State.mode = "geo";
        this.Views.$formView.html(  this.Templates.searchFormGeo  );
      } else {
        this.State.mode = "zip";
        this.Views.$formView.html( this.Templates.searchFormZip );
      }
    },

    // Public: Finds locations near zip/geolocation depending on mode.
    findLocation: function() {
      if(this.initialized) {
        if(this.State.mode === "zip") {
          if(query.match(this.Options.validation)) {
            console.log("Searchin zip");
            $.get("example-data.json?zip=" + zip, function(data) {
              this._printResults(data);
            });
          }
        } else {
          var latitude = 70.52;
          var longitude = 50.12;

          var _this = this;
          $.get(this.Options.url + "?lat=" + latitude + "&long=" + longitude, function(data) {
            _this._printResults(data);
          });
        }
      }
    },

    // Prints results to the Results View.
    _printResults: function(data) {
      var _this = this;
      this.Views.$resultsView.html("Results:");

      _.each(data.results, function(result) {
        _this.Views.$resultsView.append( _this.Templates.locationResult(result) );
      });
    }
  });

})();