var DS = DS || {};

(function() {
    "use strict";
    _.templateSettings = {
        evaluate: /\{\{#([\s\S]+?)\}\}/g,
        interpolate: /\{\{[^#\{]([\s\S]+?)[^\}]\}\}/g,
        escape: /\{\{\{([\s\S]+?)\}\}\}/g
    };
})();

var DS = window.DS || {};

(function($) {
    "use strict";
    DS.LocationFinder = NEUE.BaseModule.extend({
        defaultOptions: {
            url: "/example-data.json",
            validation: /(^\d{5}$)/
        },
        Events: {
            ".js-location-finder-toggle-mode click": "toggleMode",
            ".js-location-finder-submit click": "findLocation",
            ".js-location-finder-form submit": "findLocation",
            ".js-location-finder-reset-form click": "resetForm"
        },
        Templates: {
            searchViewGeo: "#template--locfinder-geo",
            searchViewZip: "#template--locfinder-zip",
            resultsView: "#template--locfinder-results",
            locationResult: "#template--locfinder-location"
        },
        _initialize: function() {
            var _this = this;
            _.bindAll(this, "onModeChange", "queryZip", "queryGeolocation", "geolocationError", "printResults");
            _this.State.reset({
                mode: "zip",
                searchTerm: ""
            });
            this.Views.$formView = $("<div/>", {
                className: "locfinder-form"
            });
            this.Views.$resultsView = $("<div/>", {
                className: "locfinder-results"
            });
            $(document).ready(function() {
                _this.Views.$formView.appendTo(_this.$el);
                _this.Views.$resultsView.appendTo(_this.$el);
                _this.State.bindEvent("mode", "onModeChange");
                if (Modernizr.geolocation) {
                    _this.State.set("mode", "geo");
                } else {
                    _this.State.set("mode", "zip");
                }
            });
        },
        onModeChange: function() {
            if (this.State.get("mode") === "zip") {
                this.Views.$formView.html(this.Templates.searchViewZip);
            } else {
                this.Views.$formView.html(this.Templates.searchViewGeo);
            }
        },
        toggleMode: function() {
            if (this.State.get("mode") === "zip") {
                this.State.set("mode", "geo");
            } else {
                this.State.set("mode", "zip");
            }
        },
        findLocation: function() {
            if (this.initialized) {
                this.Views.$formView.find(".js-location-finder-submit").addClass("loading");
                if (this.State.get("mode") === "zip") {
                    this.queryZip();
                } else {
                    navigator.geolocation.getCurrentPosition(this.queryGeolocation, this.geolocationError);
                }
            }
        },
        queryZip: function() {
            var _this = this;
            var zip = this.Views.$formView.find("input[name='zip']").val();
            if (zip.match(this.Options.validation)) {
                _this.State.set("searchTerm", zip);
                $.get(this.Options.url + "?zip=" + zip).done(function(data) {
                    _this.printResults(data);
                }).fail(function() {
                    _this.showError("There was a network error. Double-check that you have internet?");
                });
            } else {
                this.showError("Hmm, make sure you entered a valid zip code.");
            }
        },
        queryGeolocation: function(position) {
            var _this = this;
            var latitude = position.coords.latitude;
            var longitude = position.coords.longitude;
            this.State.set("searchTerm", "your location");
            $.get(this.Options.url + "?latitude=" + latitude + "&longitude=" + longitude).done(function(data) {
                _this.printResults(data);
            }).fail(function() {
                _this.showError("There was a network error. Double-check that you have internet?");
            });
        },
        geolocationError: function(err) {
            if (err.code === 1) {
                this.showError("Sorry, it seems like you might have refused to share your location with us. Try using a zip code instead?");
            } else {
                this.showError("We couldn't find your location because of a network error.");
            }
        },
        showError: function(errorMessage) {
            this.Views.$formView.find(".js-location-finder-submit").removeClass("loading");
            this.Views.$resultsView.slideUp();
            this.Views.$resultsView.html('<div class="messages error">' + errorMessage + "</div>");
            this.Views.$resultsView.slideDown();
        },
        printResults: function(data) {
            var _this = this;
            this.Views.$resultsView.slideUp(function() {
                _this.Views.$resultsView.html(_this.Templates.resultsView({
                    searchTerm: _this.State.get("searchTerm")
                }));
                _.each(data.results, function(result) {
                    _this.Views.$resultsView.find(".js-location-finder-results").append(_this.Templates.locationResult(result));
                });
                _this.Views.$formView.slideUp();
                _this.Views.$resultsView.slideDown(function() {
                    _this.Views.$formView.find(".js-location-finder-submit").removeClass("loading");
                });
            });
        },
        resetForm: function() {
            this.Views.$resultsView.slideUp();
            this.Views.$formView.slideDown();
        }
    });
})(jQuery);