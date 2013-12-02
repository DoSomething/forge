//
//
// The main DS app. This guy runs the show.
//
//

var DS = DS || {};

(function() {
  "use strict";

  // We configure Underscore templating to use brackets (Mustache-style) syntax.
  _.templateSettings = {
    evaluate:    /\{\{#([\s\S]+?)\}\}/g,            // {{# console.log("blah") }}
    interpolate: /\{\{[^#\{]([\s\S]+?)[^\}]\}\}/g,  // {{ title }}
    escape:      /\{\{\{([\s\S]+?)\}\}\}/g,         // {{{ title }}}
  };

  // ## State: ##
  // `DS.State.Server` holds the (initial) application state according to the server.
  // `DS.State.Client` can hold local state that doesn't need to (or isn't ready to) be synced to the server.


})();
