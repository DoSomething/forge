/**
 * Client-side form validation logic. Form element is validated based
 * on `data-validate` attribute, and validation output is placed in
 * corresponding `<label>`.
 *
 * Validations can be added later by using the registerValidationFunction
 * method and referencing the function by name in the `data-validate` attribute.
 *
 * Validations give a JSON response to the `done()` callback when they've
 * finished validating with a boolean `success` and a plain-text `message`
 * value. (Alternatively, a `suggestion` value can be passed which will
 * prompt the user "Did you mean {suggestion}?".
 *
 * ## Usage Notes:
 * - Input field must have `.js-validate` class.
 * - Adding a `data-validate-trigger` attribute to *any* field will trigger
 *   another field's validation on blur (by specifying the ID of the other field).
 * - Use `data-validate-match` attribute to ID of field to check equality with
 *   "match" validator.
 * - Use `js-validate-required` attribute to validate field before submission.
 * - If adding input fields to the DOM after load, run `prepareFormLabels`
 */

define(function() {
  "use strict";

  var $ = window.jQuery;

  var validationFunctions = [];

  /**
   * Prepares form label DOM to display validation messages
   * @param {jQuery} $parent Parent element to find & initialize labels within.
   */
  var prepareFormLabels = function($parent) {
    var $fields = $parent.find(".js-validate");

    $fields.each(function() {
      var field = $(this);
      var $fieldLabel = $("label[for='" + field.attr("id") + "']");

      if($fieldLabel.find(".inner-label").length === 0) {
        var $innerLabel = $("<div class='inner-label'></div>");
        $innerLabel.append("<div class='label'>" + $fieldLabel.html() + "</div>");
        $innerLabel.append("<div class='message'></div>");

        $fieldLabel.html($innerLabel);
      }
    });
  };


  /**
   * Register a new validation function.
   *
   * @param {String}    name  The name function will be referenced by in `data-validate` attribute.
   * @param {function}  fn    The validation function. Must accept a string and return `done()` callback.
   *
   */
  var registerValidationFunction = function (name, fn) {
    if(validationFunctions[name]) {
      throw "A validation function with that name has already been registered";
    }

    if(typeof(fn) !== "function") {
      throw "Must attach a function as second parameter";
    }

    validationFunctions[name] = fn;
  };


  /**
   * Validate field with given function.
   *
   * @param {jQuery}    $field                       Field to validate contents of.
   * @param {function}  validationFunction           Function to validate field contents with
   * @param {function}  [cb=showValidationMessage]   Callback function that receives validation result.
   */
  function validate($field, validationFunction, cb) {
    var callback = cb || function($fieldLabel, result) {
      showValidationMessage($fieldLabel, result);
    };

    var fieldValue = $field.val();
    var $fieldLabel = $("label[for='" + $field.attr("id") + "']");

    // Don't validate if we don't have a label to show results in / validation function doesn't exist
    if( $fieldLabel && hasValidationFunction(validationFunction) ) {
      if(validationFunction === "match") {
        // the "match" validation function requires an extra argument
        var secondFieldValue = $($field.data("validate-match")).val();
        validationFunctions[validationFunction](fieldValue, secondFieldValue, function(result) {
          callback($fieldLabel, result);
        });
      } else {
        // once we know this is a valid validation (heh), let's do it.
        validationFunctions[validationFunction](fieldValue, function(result) {
          callback($fieldLabel, result);
        });
      }
    }
  }

  /**
   * Show validation message in markup.
   *
   * @param {jQuery} $fieldLabel Label to display validation message within.
   * @param {Object} result      Object containing `success` and either `message` or `suggestion`
   */
  function showValidationMessage($fieldLabel, result) {
    var $field = $("#" + $fieldLabel.attr("for"));
    var $fieldMessage = $fieldLabel.find(".message");

    $field.removeClass("success error warning shake");
    $fieldMessage.removeClass("success error warning");

    if(result.message) {
      $fieldMessage.text(result.message);

      if(result.success === true) {
        $field.addClass("success");
        $fieldMessage.addClass("success");
      } else {
        $field.addClass("shake");
        $field.addClass("error");
        $fieldMessage.addClass("error");
      }

      // If Google Analytics is set up, we fire an event to
      // mark that a suggestion has been made
      if(typeof(_gaq) !== "undefined" && _gaq !== null) {
        _gaq.push(["_trackEvent", "Form", "Inline Validation Error", $fieldLabel.attr("for"), null, true]);
      }
    }

    if(result.suggestion) {
      $fieldMessage.html("Did you mean " + result.suggestion.full + "? <a href='#' data-suggestion='" + result.suggestion.full + "'class='js-mailcheck-fix'>Fix it!</a>");
      $field.addClass("warning");
      $fieldMessage.addClass("warning");


      // If Google Analytics is set up, we fire an event to
      // mark that a suggestion has been made
      if(typeof(_gaq) !== "undefined" && _gaq !== null) {
        _gaq.push(["_trackEvent", "Form", "Mailcheck Suggestion", result.suggestion.domain, null, true]);
      }
    }

    $fieldLabel.addClass("show-message");

    $(".js-mailcheck-fix").on("click", function(e) {
      e.preventDefault();

      var $field = $("#" + $(this).closest("label").attr("for"));
      $field.val($(this).data("suggestion"));
      $field.trigger("blur");

      // If Google Analytics is set up, we fire an event to
      // mark that a suggestion has been made
      if(typeof(_gaq) !== "undefined" && _gaq !== null) {
        _gaq.push(["_trackEvent", "Form", "Mailcheck Suggestion Used", $(this).text(), null, true]);
      }

    });

    $field.on("focus", function() {
      $field.removeClass("warning error success shake");
      $fieldLabel.removeClass("show-message");
    });

    return result.success;
  }


  /**
   * Checks if function exists in the validationFunctions object.
   *
   * @param {string} name  Name of validation function
   */
  function hasValidationFunction(name) {
    if( name !== "" && validationFunctions[name] && typeof( validationFunctions[name] ) === "function" ) {
      return true;
    } else {
      return false;
    }
  }


  /**
   * Validate form on submit.
   */
  $("body").on("submit", "form", function(e, isValidated) {
    if(isValidated === true) {
      // we're ready to submit the form

      // If Google Analytics is set up, we fire an event to
      // mark that the form has been successfully submitted
      if(typeof(_gaq) !== "undefined" && _gaq !== null) {
        _gaq.push(["_trackEvent", "Form", "Submitted", $(this).attr("id"), null, false]);
      }

      return true;
    } else {
      var $form = $(this);
      var $validationFields = $form.find(".js-validate").filter("[data-validate-required]");
      var validatedResults = [];

      $validationFields.each(function() {
        validate($(this), $(this).data("validate"), function($fieldLabel, result) {
          if( showValidationMessage($fieldLabel, result) ) {
            validatedResults.push(true);
          }

          if(validatedResults.length === $validationFields.length) {
            // we've validated all that can be validated
            $form.trigger("submit", true);
          } else {
            // some validation errors exist on the form

            // If Google Analytics is set up, we fire an event to
            // mark that the form had some errors
            if(typeof(_gaq) !== "undefined" && _gaq !== null) {
              _gaq.push(["_trackEvent", "Form", "Validation Error on submit", $(this).attr("id"), null, true]);
            }

          }
        });
      });

      if($validationFields.length === 0) {
        // if there are no fields to be validated, submit!
        $form.trigger("submit", true);
      }

      return false; // don't submit form, wait for callback with `true` parameter
    }
  });


  $(function() {
    // Prepare the labels on any `.js-validate` fields in the DOM at load
    var $body = $("body");
    prepareFormLabels($body);

    // Validate on blur
    $body.on("blur", ".js-validate", function(e) {
      e.preventDefault();

      // Don't validate empty form fields, that's just rude.
      if($(this).val() !== "") {
        validate($(this), $(this).data("validate"));
      }

      if( $(this).data("validate-trigger") ) {
        var $otherField = $($(this).data("validate-trigger"));

        if($otherField.val() !== "") {
          validate($otherField, $otherField.data("validate"));
        }
      }
    });
  });

  // Register the "match" validation.
  registerValidationFunction("match", function(string, secondString, done) {
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
  });

  return {
    prepareFormLabels: prepareFormLabels,
    registerValidationFunction: registerValidationFunction,
    Functions: validationFunctions
  };
});
