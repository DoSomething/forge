//
//
// An example code module. Example usage:
//
// ```js
// window.NEUE.ExampleModule.initialize({
//   configuration_option: true
// });
//
// exampleModule.getStatus();
// ```
//
//

// We create the global NEUE namespace if it doesn't already exist, and attach our module to it.
window.NEUE = window.NEUE || {};
window.NEUE.ExampleModule = function() {
  'use strict';

  // We can track whether a module has been initialized or not in the `initialized` variable.
  var initialized = false;
  var options = {};

  function _privateFunction() {

  }

  function _anotherPrivateFunction() {

  }

  function initialize(opts) {
    var defaults = {
      configurationOption: false
    };

    // We override default options with any settings passed during initialization:
    if ((typeof opts !== 'undefined' && opts !== null)) {
      options = $.extend({}, defaults, opts);
    } else {
      options = defaults;
    }

    // ...

    initialized = true;
  }

  function getStatus() {

    // We can use the `initialized` varible to ensure that the module has been initialized before other methods can run.
    if(initialized) {
      _privateFunction();
      _anotherPrivateFunction();

      return 'We\'re ready to go!';
    }
  }

  // We use the [Revealing Module pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript)
  // to expose public methods while keeping private methods/variables safe.
  return {
    initialize: initialize,
    getStatus: getStatus
  };
};
