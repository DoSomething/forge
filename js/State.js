// Keeps track of state for modules. Can trigger events on state changes.

var NEUE = NEUE || {};

(function() {
  "use strict";

  // We create the global NEUE namespace if it doesn"t already exist, and attach BaseModule to it.
  NEUE.State = function State(initialState, context) {
    var state = {};
    var bindings = {};
    var _this = context;

    if(initialState) {
      state = initialState;
    }

    var reset = function reset(array) {
      state = array;
    };

    var set = function set(key, value) {
      // Set the key to the provided value. Trigger any events bound to changing that key.
      state[key] = value;

      if(bindings[key]) {
        for(var i = 0; i < bindings[key].length; i++) {
          var func = _this[bindings[key][i]];
          if (func && _.isFunction(func)) {
            func();
          }
        }
      }

    };


    var get = function get(key) {
      // Return the value of the given key, if it exists.
      return state[key];
    };

    var bindEvent = function bindEvent(key, callback) {
      // Add callback function to array of callbacks for event, if it exists. Otherwise, add the first one.
      // TODO: Check if function

      if (bindings[key]) {
        bindings[key].push(callback);
      } else {
        bindings[key] = [callback];
      }
    };

    var unbindEvent = function unbindEvent(key) {
      // TODO: Handle cases where multiple callbacks are bound to a single key
      if(bindings[key]) {
        delete bindings.key;
      }
    };

    // We use the Revealing Module pattern to make sure that state is only accessed through getters/setters.
    return {
      reset: reset,
      set: set,
      get: get,
      bindEvent: bindEvent,
      unbindEvent: unbindEvent
    };
  };

})();
