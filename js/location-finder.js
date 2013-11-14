/**

  The Location Finder helps a user find a location near them from a JSON API, using geolocation or zip code.
 
  ```js
  window.DS.ExampleModule.initialize({
    configuration_option: true
  });

  exampleModule.getStatus();
  ```

*/

window.DS = window.DS || {};
window.DS.LocationFinder = function() {
  'use strict';

  // PRIVATE METHODS & VARIABLES:
  var initialized = false;
  var options = {};

  function status() {
    console.log('I am ' + options.configurationOption + '!');
  }

  //  PUBLIC METHODS:
  return {
    initialize: function(opts) {
      var defaults = {
        configurationOption: false
      };

      // Override default options with any settings passed during initialization.
      if ((typeof opts !== 'undefined' && opts !== null)) {
        options = $.extend({}, defaults, opts);
      } else {
        options = defaults;
      }

      // Do anything else we need to set up this module.
      // ...

      status();

      initialized = true;
    },

    getStatus: function() {
      if(initialized) {
        status();
      }
    }

  };
};