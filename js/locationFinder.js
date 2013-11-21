/*global Modernizr, _ */

//
//
// An example code module. Example usage:
//
// ```js
// window.NEUE.LocationFinder.initialize(<JQuery element>, {
//   configuration_option: true
// });
//
// exampleModule.getStatus();
// ```
//
//

// TODO: Move this somewhere more general
// We configure Underscore templating to use brackets (Mustache-style) syntax.
_.templateSettings = {
  evaluate:    /\{\{=(.+?)\}\}/g,
  interpolate: /\{\{(.+?)\}\}/g,
  escape:      /\{\{-(.+?)\}\}/g
};

// We create the global NEUE namespace if it doesn't already exist, and attach our module to it.
window.NEUE = window.NEUE || {};
window.NEUE.LocationFinder = (function() {
  'use strict';

  // We can track whether a module has been initialized or not in the `initialized` variable.
  var initialized = false;
  var Options = {};
  var defaultOptions = {
    url: '/example-data.json'
  };
  
  var State = {};
  // #### State Variables: #### 
  // mode: `Mode` is either "geo" or "zip"

  // #### Views ####
  var $el, $formView, $resultsView;
  var Templates = {};

  // #### Events ####
  var Events = {
    '.js-location-finder-toggle-form click': 'toggleFormType',
    '.js-location-finder-submit click': 'findLocation',
    '.js-location-finder-form submit': 'findLocation'
  };

  // Public: Sets up everything the Location Finder module needs to function.
  function initialize(element, opts) {
    $el = element;

    // We override default options with any settings passed during initialization:
    if ((typeof opts !== 'undefined' && opts !== null)) {
      Options = $.extend({}, defaultOptions, opts);
    } else {
      Options = defaultOptions;
    }

    // Create view containers:
    $formView = $('<div/>', {
      className: 'locfinder-form'
    });

    $resultsView = $('<div/>', {
      className: 'locfinder-results'
    });

    $(document).ready(function() {
      // Clear out the element and place view containers in DOM:
      $el.html('');

      // Let's render our templates:
      Templates.searchFormGeo = _.template( $('#template--locfinder-geo').html() );
      Templates.searchFormZip = _.template( $('#template--locfinder-zip').html() );
      Templates.locationResult = _.template( $('#template--locfinder-result').html() );

      // We'll append our views to the given element.
      $formView.appendTo($el);
      $resultsView.appendTo($el);

      // We'll default to the geolocation form if the browser supports it. Otherwise, we just show the 'ol zip code.
      if(Modernizr.geolocation) {
        $formView.html( Templates.searchFormGeo );
        State.mode = 'geo';
      } else {
        $formView.html( Templates.searchFormZip );
        State.mode = 'zip';
      }

      // Bind our events (declared above).
      _bindEvents(window.NEUE.LocationFinder);

      initialized = true;
    });
  }

  function _bindEvents(rootElement) {
    _.each(Events, function(target, trigger, list) {
      var elementSelector = trigger.split(" ")[0];
      var eventType = trigger.split(" ")[1];

      $el.on(eventType, elementSelector, function(event) {
        event.preventDefault();
        rootElement[target]();
      })


      console.log(elementSelector + " :: " + eventType + " --> " + target);

    });
  }

  // Public: Switches Form View between the geolocation form & the zip-code form.
  function toggleFormType() {
    if(State.mode === 'zip') {
      State.mode = 'geo';
      $formView.html(  Templates.searchFormGeo  );
    } else {
      State.mode = 'zip';
      $formView.html( Templates.searchFormZip );
    }
  }

  // Public: Finds locations near zip/geolocation depending on mode.
  function findLocation() {
    if(initialized) {
      if(State.mode === 'zip') {

        // Doing a zipcode search:

        if(query.match(Options.validation)) {
          console.log('Searchin zip');
          $.get('example-data.json?zip=' + zip, function(data) {
            _printResults(data);
          });
        }

      } else {

        // Doing a geolocation search:
        console.log('Searchin geostuff');

        var latitude = 70.52;
        var longitude = 50.12;

        $.get(Options.url + '?lat=' + latitude + "&long=" + longitude, function(data) {
          _printResults(data);
        });

      }
    }
  }

  // Prints results to the Results View.
  function _printResults(data) {
    $resultsView.html('Results:');

    _.each(data['results'], function(result) {
      $resultsView.append( Templates.locationResult(result) );
    });
  }

  // Reveal public methods.
  return {
    initialize: initialize,
    findLocation: findLocation,
    toggleFormType: toggleFormType
  };
})();
