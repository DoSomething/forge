/**
 * Client-side form validation logic. Form element is validated based
 * on `data-validate` attribute, and validation output is placed in
 * corresponding `<label>`.
 *
 * Validations can be added later by extending `NEUE.Validation.Validations`.
 * Validators can be added later by extending `NEUE.Validation.Validators`.
 *
 * finished validating with a boolean `success` and a plain-text `message`
 * value. (Alternatively, a `suggestion` value can be passed which will
 * prompt the user "Did you mean {suggestion}?".
 *
 * ## Usage Notes:
 * - Input field must have `data-validate` attribute.
 * - If adding input fields to the DOM after load, run `prepareFields`
 */

define(function(require) {
  "use strict";

  var $ = window.jQuery;
  var Events = require("./events");

  var validations = [];

  /**
   * Prepares form label DOM to display validation messages & register event handler
   * @param {jQuery} $fields Fields to register validation handlers to.
   */
  var prepareFields = function($fields) {
    $fields.each(function() {
      var $field = $(this);

      prepareLabel( $("label[for='" + $field.attr("id") + "']") );

      $field.on("blur", function(event) {
        event.preventDefault();
        validateField( $field );
      });
    });
  };

  /**
   * Prepare field label DOM to display validation messages.
   * @param {jQuery} $label Label element to prepare.
   */
  var prepareLabel = function($label) {
    // Check to make sure we haven't already prepared this before
    if($label.find(".inner-label").length === 0) {
      var $innerLabel = $("<div class='inner-label'></div>");
      $innerLabel.append("<div class='label'>" + $label.html() + "</div>");
      $innerLabel.append("<div class='message'></div>");

      $label.html($innerLabel);
    }
  };

  /**
   * Trigger a validation on a form element.
   * @param {jQuery}   $field                            Form element to be validated.
   * @param {jQuery}   [force = false]                   Force validation (even on empty fields).
   * @param {function} [callback=showValidationMessage]  Callback function that receives validation result
   */
  var validateField = function($field, force, callback) {
    // Default arguments
    force = typeof force !== "undefined" ? force : false;
    callback = typeof callback !== "undefined" ? callback : function($field, result) {
      showValidationMessage($field, result);
    };

    var validation = $field.data("validate");

    // Trigger any other linked validation
    var validationTrigger = $field.data("validate-trigger");
    if(validationTrigger) {
      validateField( $(validationTrigger) );
    }


    // Don't validate if validation doesn't exist
    if(!validations[validation]) {
      console.error("A validation with the name "+ validation + " has not been registered.");
      return;
    }

    // For <input>, <select>, and <textarea> tags we provide
    // the field's value as a string
    if( isFormField($field) ) {
      // Get field info
      var fieldValue = $field.val();

      // Finally, let's not validate blank fields unless forced to
      if(force || fieldValue !== "") {
        if(validation === "match") {
          var matchFieldValue = $($field.data("validate-match")).val();
          validations[validation].fn(fieldValue, matchFieldValue, function(result) {
            callback($field, result);
          });
        } else {
          validations[validation].fn(fieldValue, function(result) {
            callback($field, result);
          });
        }
      }
    } else {
      // For all other tags, we pass the element directly
      if(validation === "match") {
        var $matchField = $($field.data("validate-match"));
        validations[validation].fn($field, $matchField, function(result) {
          callback($field, result);
        });
      } else {
        validations[validation].fn($field, function(result) {
          callback($field, result);
        });
      }
    }
  };

  /**
   * Register a new validation.
   *
   * @param {String}    name              The name function will be referenced by in `data-validate` attribute.
   * @param {Object}    validation        Collection of validation rules to apply
   * @param {Function}  [validation.fn]   Custom validation
   */
  var registerValidation = function(name, validation) {
    if(validations[name]) {
      throw "A validation function with that name has already been registered";
    }

    validations[name] = validation;
  };

  /**
   * @DEPRECATED: Will be removed in a future version in favor of `registerValidation`.
   */
  var registerValidationFunction = function(name, func) {
    var v = {
      fn: func
    };

    registerValidation(name, v);
  };

  /**
   * Show validation message in markup.
   *
   * @param {jQuery} $field              Field to display validation message for.
   * @param {Object} result              Object containing `success` and either `message` or `suggestion`
   */
  var showValidationMessage = function($field, result) {
    var $fieldLabel = $("label[for='" + $field.attr("id") + "']");
    var $fieldMessage = $fieldLabel.find(".message");
    var fieldLabelHeight = $fieldLabel.height();
    var fieldMessageHeight;

    $field.removeClass("success error warning shake");
    $fieldMessage.removeClass("success error warning");

    // Highlight/animate field
    if(result.success === true) {
      $field.addClass("success");
      $fieldMessage.addClass("success");
    } else {
      $field.addClass("error");
      $fieldMessage.addClass("error");

      if( isFormField($field) ) {
        $field.addClass("shake");
      }

      Events.publish("Validation:InlineError", $fieldLabel.attr("for"));
    }

    // Show validation message
    if(result.message) {
      $fieldMessage.text(result.message);
    }

    if(result.suggestion) {
      $fieldMessage.html("Did you mean " + result.suggestion.full + "? <a href='#' data-suggestion='" + result.suggestion.full + "'class='js-mailcheck-fix'>Fix it!</a>");
      Events.publish("Validation:Suggestion", result.suggestion.domain);
    }

    fieldMessageHeight = $fieldMessage.height();

    // Set label height if it needs to be multiline.
    if(fieldMessageHeight > fieldLabelHeight) {
      $fieldLabel.css("height", fieldMessageHeight + "px");
    } else {
      // Clear previous multiline height if no longer needed.
      $fieldLabel.css("height", "");
    }

    // Animate in the validation message
    $fieldLabel.addClass("show-message");

    $(".js-mailcheck-fix").on("click", function(e) {
      e.preventDefault();

      var $field = $("#" + $(this).closest("label").attr("for"));
      $field.val($(this).data("suggestion"));
      $field.trigger("blur");

      // If Google Analytics is set up, we fire an event to
      // mark that a suggestion has been made
      Events.publish("Validation:SuggestionUsed", $(this).text() );
    });

    $field.on("focus", function() {
      $field.removeClass("warning error success shake");
      $fieldLabel.removeClass("show-message");
      $fieldLabel.css("height", "");
    });

    return result.success;
  };


  /**
   * Disable form submission.
   * @param {jQuery} $form Form to disable submission for.
   */
  var disableFormSubmit = function($form) {
    // Prevent double-submissions
    var $submitButton = $form.find(":submit");

    // Disable that guy
    $submitButton.attr("disabled", true);
    $submitButton.addClass("loading");

    // If <button>, add a loading style
    if($submitButton.prop("tagName") === "BUTTON") {
      // Neue's `.loading` class only works on <a> or <button> :(
      $submitButton.addClass("loading");
    }
  };


  /**
   * Re-enable form submission.
   * @param {jQuery} $form Form to enable submission for.
   */
  var enableFormSubmit = function($form) {
    var $submitButton = $form.find(":submit");
    $submitButton.attr("disabled", false);
    $submitButton.removeClass("loading disabled");
  };

  /**
   * Returns whether element is <input>, <select>, or <textarea>.
   * @param {jQuery} $el  Element to check type of.
   * @return {boolean}
   */
  var isFormField = function($el) {
    var tag = $el.prop("tagName");
    return ( tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" );
  };

  /**
   * Validate form on submit.
   */
  $("body").on("submit", "form", function(event, isValidated) {
    var $form = $(this);
    var $validationFields = $form.find("[data-validate]");

    // Disable form submission to prevent double-clicks.
    disableFormSubmit($form);

    // We want to validate all [data-validate] field that are either required, or have user input.
    $validationFields = $validationFields.map(function() {
      var $this = $(this);
      if(typeof $this.attr("data-validate-required") !== "undefined" || $this.val() !== "") {
        return $this;
      }
    });

    // If no fields should be validated, submit!
    if($validationFields.length === 0) {
      return true;
    }

    if(isValidated === true) {
      // completed a previous runthrough & validated;
      // we're ready to submit the form
      return true;
    } else {
      event.preventDefault();

      var validatedFields = 0;
      var validatedResults = 0;
      var scrolledToError = false;

      $validationFields.each(function() {
        validateField($(this), true, function($field, result) {
          validatedFields++;
          showValidationMessage($field, result);

          if(result.success) {
            validatedResults++;
          }

          // If this is the first error in the form, scroll to it.
          if(!scrolledToError && result.success === false) {
            scrolledToError = true;
            $("html,body").animate({scrollTop: $field.offset().top - 32}, 200);
          }

          // Once we're done validating all fields, check status of form
          if(validatedFields === $validationFields.length) {
            if(validatedResults === $validationFields.length) {
              // we've validated all that can be validated
              Events.publish("Validation:Submitted", $(this).attr("id") );
              $form.trigger("submit", true);
            } else {
              Events.publish("Validation:SubmitError", $(this).attr("id") );
              enableFormSubmit($form);
            }
          }
        });
      });

      return false; // don't submit form, wait for callback with `true` parameter
    }
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

  $(function() {
    // Prepare the labels on any `[data-validate]` fields in the DOM at load
    prepareFields( $("body").find("[data-validate]") );
  });

  return {
    prepareFields: prepareFields,
    registerValidation: registerValidation,
    registerValidationFunction: registerValidationFunction,
    validateField: validateField,
    showValidationMessage: showValidationMessage,
    Validations: validations
  };
});
