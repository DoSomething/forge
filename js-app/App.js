/*global DS, _ */

//
//
// The main DS app. This guy runs the show.
//
//

(function() {
  "use strict";

  // We configure Underscore templating to use brackets (Mustache-style) syntax.
  _.templateSettings = {
    evaluate:    /\{\{#([\s\S]+?)\}\}/g,            // {{# console.log("blah") }}
    interpolate: /\{\{[^#\{]([\s\S]+?)[^\}]\}\}/g,  // {{ title }}
    escape:      /\{\{\{([\s\S]+?)\}\}\}/g,         // {{{ title }}}
  };

  window.DS = window.DS || {};

  // ## State: ##
  // `DS.State.Server` holds the (initial) application state according to the server.
  window.DS.State = window.DS.State || {};
  window.DS.State.Server = DS.State.Server || {};
  window.DS.State.App = DS.State.App || {};



  // #### Standard Modules: ####
  // These modules are **always** initialized. (Other modules are initialized as needed.)
  window.DS.Auth.initialize();


})();
