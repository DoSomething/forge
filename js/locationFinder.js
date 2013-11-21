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

  window.DS = window.DS || {};
  window.DS.LocationFinder = window.NEUE.BaseModule.extend({
    defaultOptions: {
      url: "/example-data.json",
      validation: /(^\d{5}$)/
    },
    
    // #### Events: ####   
    Events: {
      ".js-location-finder-toggle-form click": "toggleFormType",
      ".js-location-finder-submit click": "findLocation",
      ".js-location-finder-form submit": "findLocation",
      ".js-location-finder-reset-form click": "resetForm"
    },

    // #### State Variables: #### 
    // - mode: "zip" (default), "geo"
    // - searchTerm: holds current search term
    State: {
      mode: "zip",
      searchTerm: ""
    },

    // #### Views: ####
    // - $el
    // - $formView
    // - $resultsView

    // #### Templates: ####
    Templates: {
      searchViewGeo: "#template--locfinder-geo",
      searchViewZip: "#template--locfinder-zip",
      resultsView: "#template--locfinder-results",
      locationResult: "#template--locfinder-location"
    },

    // Sets up everything the Location Finder module needs to function.
    _initialize: function() {
      var _this = this;
      _.bindAll(this, "queryZip", "queryGeolocation", "geolocationError", "printResults");

      // Create view containers:
      this.Views.$formView = $("<div/>", { className: "locfinder-form" });
      this.Views.$resultsView = $("<div/>", { className: "locfinder-results" });

      $(document).ready(function() {
        // We'll append our views to the given element.
        _this.Views.$formView.appendTo(_this.$el);
        _this.Views.$resultsView.appendTo(_this.$el);

        // We'll default to the geolocation form if the browser supports it. Otherwise, we just show the 'ol zip code.
        if(Modernizr.geolocation) {
          _this.Views.$formView.html( _this.Templates.searchViewGeo );
          _this.State.mode = "geo";
        } else {
          _this.Views.$formView.html( _this.Templates.searchViewZip );
          _this.State.mode = "zip";
        }
      });
    },

    // Public: Switches Form View between the geolocation form & the zip-code form.
    toggleFormType: function() {
      if(this.State.mode === "zip") {
        this.State.mode = "geo";
        this.Views.$formView.html(  this.Templates.searchViewGeo  );
      } else {
        this.State.mode = "zip";
        this.Views.$formView.html( this.Templates.searchViewZip );
      }
    },

    // Public: Finds locations near zip/geolocation depending on mode.
    findLocation: function() {
      if(this.initialized) {
        // We put a loading indicator on the button since the geolocation/AJAX request could each take a while.
        this.Views.$formView.find(".js-location-finder-submit").addClass("loading");

        if(this.State.mode === "zip") {
          this.queryZip();
        } else {
          navigator.geolocation.getCurrentPosition(this.queryGeolocation, this.geolocationError);
        }
      }
    },

    queryZip: function() {
      var _this = this;
      var zip = this.Views.$formView.find(".js-location-finder-form input[name=\"zip\"]").val();

      this.State.searchTerm = zip;

      if(zip.match(this.Options.validation)) {
        console.log("Searchin zip");
        $.get(this.Options.url + "?zip=" + zip)
        .done(function(data) {
          _this.printResults(data);
        })
        .fail(function() {
          _this.showError("There was a network error. Double-check that you have internet?");
        });

        // We'll remove the loading indicator from the button since we've done the heavy lifting.
        this.Views.$formView.find(".js-location-finder-submit").removeClass("loading");
      } else {
        this.showError("Hmm, make sure you entered a valid zip code.");
      }
    },

    queryGeolocation: function(position) {
      var _this = this;
      var latitude = position.coords.latitude;
      var longitude = position.coords.longitude;

      this.State.searchTerm = "your location";

      $.get(this.Options.url + "?latitude=" + latitude + "&longitude=" + longitude)
      .done(function(data) {
        _this.printResults(data);
      })
      .fail(function() {
        _this.showError("There was a network error. Double-check that you have internet?");
      });

      // We'll remove the loading indicator from the button since we've done the heavy lifting.
      this.Views.$formView.find(".js-location-finder-submit").removeClass("loading");

      console.log("FOUND YA: " + latitude + ", " + longitude + "!!");
    },

    geolocationError: function(err) {
      this.showError("Geolocation Error: " + err);
    },

    showError: function(errorMessage) {
      this.Views.$formView.find(".js-location-finder-submit").removeClass("loading");
      
      this.Views.$resultsView.slideUp();
      this.Views.$resultsView.html("<div class=\"messages error\">" + errorMessage + "</div>");
      this.Views.$resultsView.slideDown();
    },

    // Prints results to the Results View.
    printResults: function(data) {
      var _this = this;

      this.Views.$resultsView.slideUp(function() {
        _this.Views.$resultsView.html( _this.Templates.resultsView({searchTerm: _this.State.searchTerm }) );

        _.each(data.results, function(result) {
          _this.Views.$resultsView.find(".js-location-finder-results").append( _this.Templates.locationResult(result) );
        });

        _this.Views.$formView.slideUp();
        _this.Views.$resultsView.slideDown();
      });
    },

    resetForm: function() {
      this.Views.$resultsView.slideUp();
      this.Views.$formView.slideDown();
    }

  });

})();