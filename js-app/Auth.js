/* global NEUE */

//
//
// An example code module. Example usage:
//
// ```javascript
// window.DS.ExampleModule.initialize(<JQuery element>, {
//   initialColor: "blue"
// });
//
// window.DS.ExampleModule.getStatus();
// ```
//
//

var DS = DS || {};

(function($) {
  "use strict";

  DS.Auth = NEUE.BaseModule.extend({
    defaultOptions: {

    },

    // #### Events: ####
    Events: {
      ".js-next-login-step click": "nextLoginStep"
    },

    // #### State Variables: ####
    // None for now...

    // #### Views: ####
    // - $el
    // - $loginView
    // - $registerView

    // #### Templates: ####
    Templates: {
      loginView: "#template--auth-login",
      registerView: "#template--auth-register"
    },

    // #### Initialization: ####
    // Sets up everything the Location Finder module needs to function.
    _initialize: function() {
      var _this = this;
      _.bindAll(this, "nextLoginStep");

      // Create view containers:
      this.Views.$modalView = $("<div/>");
      this.Views.$modalView.addClass("modal-content slide-in-fast");
      this.Views.$modalView.append("<a class=\"modal-close-button js-close-modal\" href=\"#\">&times;</a>");
      this.Views.$modalView.append( $("<div/>").addClass("js-modal-content") );

      this.Views.$loginView = $("<div/>", { className: "login-form" });
      this.Views.$registerView = $("<div/>", { className: "register-form" });

      $(document).ready(function() {
        // We'll append our views to the given element.
        _this.$el.html(_this.Views.$modalView);

        // console.log( _this.Views.$modalView.find("js-modal-content") );

        _this.Views.$modalView.find(".js-modal-content").html( _this.Views.$loginView );
        _this.Views.$loginView.html( _this.Templates.loginView );

      });
    },

    nextLoginStep: function() {
      /* jshint ignore:start */
      console.log("YO");
      /* jshint ignore:end */

      this.Views.$modalView.find(".js-modal-content").html(this.Views.$registerView);
      this.Views.$registerView.html(this.Templates.registerView);
    }
  });
})(jQuery);
