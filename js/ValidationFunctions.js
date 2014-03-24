//
//
// Some basic validation functions for use with `validation.js`.
// Validations can be added later by attaching to the
// `NEUE.Validation.Functions` object and referencing the function
// by name in the `data-validate` attribute.
//
// Validations give a JSON response to the `done()` callback
// when they've finished validating with a boolean `success`
// and a plain-text `message` value. (Alternatively, a
// `suggestion` value can be passed which will prompt
// the user "Did you mean {suggestion}?".
//
//

var NEUE = NEUE || {};
NEUE.Validation = NEUE.Validation || {};
NEUE.Validation.Functions = NEUE.Validation.Functions || {};

(function() {
  "use strict";

  NEUE.Validation.Functions.match = function(string, secondString, done) {
    if(string === secondString && string !== "") {
      return done({
        success: true,
        message: "Looks good!"
      });
    } else {
      return done({
        success: false,
        message: "That doesn't match."
      });
    }
  };


})();
