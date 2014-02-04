//
//
// Form validation logic. Form element is validated based on
// `data-validate` attribute, and validation output is placed
// in corresponding <label>. Use `js-validate-required`
// attribute to validate field before submission.
//
// Input field must have `.js-validate` class.
//
//

/* global Kicksend */

var ValidationFunctions = ValidationFunctions || {};

(function($) {
  "use strict";

  ValidationFunctions = {
    name: function(string, done) {
      if( string !== "" ) {
        return done({
          success: true,
          message: "Hey, " + string + "!"
        });
      } else {
        return done({
          success: false,
          message: "We need your first name."
        });
      }
    },

    birthday: function(string, done) {
      var birthday, birthMonth, birthDay, birthYear;

      if( string.match(/[0-9]*\/[0-9]*\/[0-9]*/) ) {
        // default, typed by user MM/DD/YYYY
        birthday = string.split("/");
        birthMonth = parseInt(birthday[0]);
        birthDay = parseInt(birthday[1]);
        birthYear = parseInt(birthday[2]);
      } else if( string.match(/[0-9]*\-[0-9]*\-[0-9]*/) )  {
        // output from HTML5 date picker
        birthday = string.split("-");
        birthMonth = parseInt(birthday[1]);
        birthDay = parseInt(birthday[2]);
        birthYear = parseInt(birthday[0]);
      } else {
        return done({
          success: false,
          message: "Enter your birthday MM/DD/YYYY!"
        });
      }

      var birthDate = new Date(birthYear, birthMonth - 1, birthDay);
      var now = new Date();

      var age = Math.floor( (now - birthDate) / 31536000000 );
      // 31536000000 milliseconds in a year! math!

      if (age < 0)  {
        return done({
          success: false,
          message: "Are you a time traveller?"
        });
      } else if( age > 0 && age <= 13 ) {
        return done({
          success: false,
          message: "You need to be 13+ to join, sorry!"
        });
      } else if( age > 13 && age <= 24) {

        if (birthDate.getMonth() === now.getMonth() && now.getDate() === birthDate.getDate() ) {
          return done({
            success: true,
            message: "Wow, happy birthday!"
          });
        } else {
          return done({
            success: true,
            message: "Cool, " + age + "!"
          });
        }

      } else if (age > 24 && age < 130) {
        return done({
          success: true,
          message: "Yikes, you're old!"
        });
      } else if (string === "") {
        return done({
          success: false,
          message: "We need your birthday."
        });
      } else {
        return done({
          success: false,
          message: "That doesn't seem right."
        });
      }
    },


    email: function(string, done) {
      // basic regex sanity check
      if ( string.toUpperCase().match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/) ) {
        // we use mailcheck.js to find some common email mispellings
        Kicksend.mailcheck.run({
          email: string,
          domains: ["yahoo.com", "google.com", "hotmail.com", "gmail.com", "me.com", "aol.com", "mac.com",
                    "live.com", "comcast.net", "googlemail.com", "msn.com", "hotmail.co.uk", "yahoo.co.uk",
                    "facebook.com", "verizon.net", "sbcglobal.net", "att.net", "gmx.com", "mail.com", "outlook.com",
                    "aim.com", "ymail.com", "rocketmail.com", "bellsouth.net", "cox.net", "charter.net", "me.com",
                    "earthlink.net", "optonline.net", "dosomething.org"],
          suggested: function(s) {
            return done({
              success: true,
              suggestion: s
            });
          },
          empty: function() {
            return done({
              success: true,
              message: "Great, thanks!"
            });
          }
        });
      } else {
        return done({
          success: false,
          message: "We need a valid email."
        });
      }
    },


    password: function(string, done) {
      if(string.length > 6) {
        return done({
          success: true,
          message: "Keep it secret, keep it safe!"
        });
      } else {
        return done({
          success: false,
          message: "Must be 6+ characters."
        });
      }
    }
  };

  $(document).ready(function() {
    // Prepare the label in the DOM if its not already there.
    $(".js-validate").each(function() {
      var field = $(this);
      var $fieldLabel = $("label[for='" + field.attr("id") + "']");

      if($fieldLabel.find(".inner-label").length === 0) {
        var $innerLabel = $("<div class='inner-label'></div>");
        $innerLabel.append("<div class='label'>" + $fieldLabel.html() + "</div>");
        $innerLabel.append("<div class='message'></div>");

        $fieldLabel.html($innerLabel);
      }
    });

    // Validate on blur
    $("body").on("blur", ".js-validate", function(e) {
      e.preventDefault();

      var $field = $(this);
      var fieldValue = $field.val();
      var $fieldLabel = $("label[for='" + $field.attr("id") + "']");

      // Don't validate if we don't have a label to show results in.
      // Don't validate empty form fields, that's just rude.
      if($fieldLabel && fieldValue !== "") {
        var validationFunction = $(this).data("validate");
        if( hasValidationFunction(validationFunction) ) {
          // once we know this is a valid validation (heh), let's do it.
          ValidationFunctions[validationFunction](fieldValue, function(result) {
            showValidationMessage($fieldLabel, result);
          });
        }
      }
    });

    // Validate form on submit
    $("form").on("submit", function(e, isValidated) {
      if(isValidated === true) {
        return true;
      } else {
        var $form = $(this);
        var $validationFields = $form.find(".js-validate").filter("[data-validate-required]");
        var validationResults = [];

        $validationFields.each(function() {
          var $field = $(this);
          var fieldValue = $field.val();
          var $fieldLabel = $("label[for='" + $field.attr("id") + "']");

          var validationFunction = $(this).data("validate");

          if( hasValidationFunction(validationFunction) ) {
            ValidationFunctions[validationFunction](fieldValue, function(result) {
              validationResults.push(showValidationMessage($fieldLabel, result));
              if(validationResults.length === $validationFields.length) {
                // we've validated all that can be validated
                $form.trigger("submit", true);
              }
            });
          }
        });

        if($validationFields.length === 0) {
          // if there are no fields to be validated, submit!
          $form.trigger("submit", true);
        }

        return false; // don't submit form, wait for callback with `true` parameter
      }
    });

    function showValidationMessage($fieldLabel, result) {
      var $field = $("#" + $fieldLabel.attr("for"));
      var $fieldMessage = $fieldLabel.find(".message");

      $field.removeClass("shake");
      $fieldMessage.removeClass("success error warning");

      if(result.message) {
        $fieldMessage.text(result.message);

        if(result.success === true) {
          $fieldMessage.addClass("success");
        } else {
          $field.addClass("shake");
          $fieldMessage.addClass("error");
        }
      }

      if(result.suggestion) {
        $fieldMessage.html("Did you mean <a href='#' class='js-mailcheck-fix'>" + result.suggestion.full + "</a>?");
        $fieldMessage.addClass("warning");
      }

      $fieldLabel.addClass("show-message");

      $(".js-mailcheck-fix").on("click", function(e) {
        e.preventDefault();

        var $field = $("#" + $(this).closest("label").attr("for"));
        $field.val($(this).text());
        $field.trigger("blur");
      });

      $field.on("focus", function() {
        $fieldLabel.removeClass("show-message");
      });

      return result.success;
    }
  });

  // Checks if function exists in the ValidationFunctions object
  function hasValidationFunction(name) {
    if( name !== "" && ValidationFunctions[name] && typeof( ValidationFunctions[name] ) === "function" ) {
      return true;
    } else {
      return false;
    }
  }


})(jQuery);
