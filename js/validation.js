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

var NEUE = NEUE || {};
NEUE.Validation = NEUE.Validation || {};
NEUE.Validation.Functions = NEUE.Validation.Functions || {};

(function($) {
  "use strict";

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
