//
//
// Form validation logic. Form element is validated based on
// `data-validate` attribute, and validation output is placed
// in corresponding <label>. Use `js-validate-required`
// attribute to validate field before submission.
//
// Input field must have `.js-validate` class.
//
// If adding input fields to the DOM after load, run NEUE.Validation.prepareFormLabels
//
//

var NEUE = NEUE || {};
NEUE.Validation = NEUE.Validation || {};
NEUE.Validation.Functions = NEUE.Validation.Functions || {};
NEUE.Validation.prepareFormLabels = NEUE.Validation.prepareFormLabels || {};

(function($) {
  "use strict";

  $(document).ready(function() {
    // Prepare the labels on any `.js-validate` fields in the DOM at load
    NEUE.Validation.prepareFormLabels($("body"));

    // Validate on blur
    $("body").on("blur", ".js-validate", function(e) {
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

    function validate($field, validationFunction, cb) {
      var callback = cb || function($fieldLabel, result) {
        showValidationMessage($fieldLabel, result);
      };

      var fieldValue = $field.val();
      var $fieldLabel = $("label[for='" + $field.attr("id") + "']");
      
      // Don't validate if we don't have a label to show results in / validation function doesn't exist
      if( $fieldLabel && hasValidationFunction(validationFunction) ) {
        if(validationFunction === "match") {
          // the validation function requires an extra argument
          var secondFieldValue = $($field.data("validate-match")).val();
          NEUE.Validation.Functions[validationFunction](fieldValue, secondFieldValue, function(result) {
            callback($fieldLabel, result);
          });
        } else {
          // once we know this is a valid validation (heh), let's do it.
          NEUE.Validation.Functions[validationFunction](fieldValue, function(result) {
            callback($fieldLabel, result);
          });
        }
      }
    }

    // Validate form on submit
    $("body").on("submit", "form", function(e, isValidated) {
      if(isValidated === true) {
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

  // Checks if function exists in the NEUE.Validation.Functions object
  function hasValidationFunction(name) {
    if( name !== "" && NEUE.Validation.Functions[name] && typeof( NEUE.Validation.Functions[name] ) === "function" ) {
      return true;
    } else {
      return false;
    }
  }

  // Prepares form label DOM to display validation messages
  NEUE.Validation.prepareFormLabels = function($parent) {
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


})(jQuery);
