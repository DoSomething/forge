/**

  Give a brief description of what your module does. Usage:
 
  ```js
  window.DS.ExampleModule.initialize({
    configuration_option: true
  });

  exampleModule.getStatus();
  ```

*/

window.DS = window.DS || {};
window.DS.ExampleModule = function() {
  'use strict';

  // PRIVATE METHODS & VARIABLES:
  var initialized = false;
  var options = {};

  function status() {
    // public method to report status
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