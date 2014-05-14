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

    // Don't validate if validation doesn't exist
    if(!validations[validation]) {
      console.error("A validation with the name "+ validation + " has not been registered.");
      return;
    }

    // Get field info
    var fieldValue = $field.val();
    // Finally, let's not validate blank fields unless forced to
    if(force || $field.val() !== "") {
      validations[validation].fn(fieldValue, function(result) {
        callback($field, result);
      });
    }
  };

  /**
   * Register a new validation.
   *
   * @param {String}    name              The name function will be referenced by in `data-validate` attribute.
   * @param {Object}    validation        Collection of validation rules to apply
   * @param {Function}  [validation.fn]   Custom validation, with callback `done({success: [boolean], message: [string], suggestion: [string]})`.
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

    $field.removeClass("success error warning shake");
    $fieldMessage.removeClass("success error warning");

    // Highlight/animate field
    if(result.success === true) {
      $field.addClass("success");
      $fieldMessage.addClass("success");
    } else {
      $field.addClass("shake");
      $field.addClass("error");
      $fieldMessage.addClass("error");

      Events.publish("Validation:InlineError", $fieldLabel.attr("for"));
    }

    // Show validation message
    if(result.message) {
      $fieldMessage.text(result.message);
    }

    if(result.suggestion) {
      $fieldMessage.html("Did you mean " + result.suggestion.full + "? <a href='#' data-suggestion='" + result.suggestion.full + "'class='js-mailcheck-fix'>Fix it!</a>");
      $field.addClass("warning");
      $fieldMessage.addClass("warning");

      Events.publish("Validation:Suggestion", result.suggestion.domain);
    }

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
    });

    return result.success;
  };

  /**
   * Validate form on submit.
   */
  $("body").on("submit", "form", function(e, isValidated) {
    if(isValidated === true) {
      // completed a previous runthrough & validated;
      // we're ready to submit the form
      return true;
    } else {
      var $form = $(this);
      var $validationFields = $form.find("[data-validate]").filter("[data-validate-required]");
      var validatedResults = [];

      $validationFields.each(function() {
        validateField($(this), true, function($field, result) {
          showValidationMessage($field, result);

          if( result.success ) {
            validatedResults.push(true);
          }

          if(validatedResults.length === $validationFields.length) {
            // we've validated all that can be validated
            $form.trigger("submit", true);
            Events.publish("Validation:Submitted", $(this).attr("id") );
          } else {
            // some validation errors exist on the form

            // If Google Analytics is set up, we fire an event to
            // mark that the form had some errors
            Events.publish("Validation:SubmitError", $(this).attr("id") );
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

    Events.subscribe("Modal:opened", function(topic, args) {
      prepareFields(args.find("[data-validate]"));
    });
  });

  return {
    prepareFields: prepareFields,
    registerValidation: registerValidation,
    registerValidationFunction: registerValidationFunction,
    showValidationMessage: showValidationMessage,
    Validations: validations
  };
});
