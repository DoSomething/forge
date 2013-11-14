//
//
// Give a brief description of what your module does. Usage:
// 
// ```js
// window.DS.ExampleModule.initialize({
//   configuration_option: true
// });
//
// exampleModule.getStatus();
// ```
//
// 

// We create the global DS namespace if it doesn't already exist, and attach our module to it.
window.DS = window.DS || {};
window.DS.ExampleModule = function() {
  'use strict';

  // We can track whether a module has been initialized or not in the `initialized` variable.
  var initialized = false;
  var options = {};

  function privateFunction() {
    
  }

  function anotherPrivateFunction() {
    
  }

  function public__Initialize() {
    function(opts) {
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
  }

  function public__getStatus() {
    
    // We can use the `initialized` varible to ensure that the module has been initialized before other methods can run.
    if(initialized) {
      alert("We're ready to go!")
    }
  }

  // We use the [Revealing Module pattern](http://addyosmani.com/resources/essentialjsdesignpatterns/book/#revealingmodulepatternjavascript)
  // to expose public methods while keeping private methods/variables safe.
  return {
    initialize: public__Initialize,
    getStatus: public__getStatus
  };
};