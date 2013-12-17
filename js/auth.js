//
//
// **Displays the login modal when a user clicks "Sign In".**
//
//

var NEUE = NEUE || {};

(function($) {
  "use strict";

  var Validate = {
    Email: function(e, force) {
      var el = e.target;

      $(this).mailcheck({
        domains: ["yahoo.com", "google.com", "hotmail.com", "gmail.com", "me.com", "aol.com", "mac.com",
                  "live.com", "comcast.net", "googlemail.com", "msn.com", "hotmail.co.uk", "yahoo.co.uk",
                  "facebook.com", "verizon.net", "sbcglobal.net", "att.net", "gmx.com", "mail.com", "outlook.com",
                  "aim.com", "ymail.com", "rocketmail.com", "bellsouth.net", "cox.net", "charter.net", "me.com",
                  "earthlink.net", "optonline.net", "dosomething.org"],
        suggested: function(element, suggestion) {
          // suggested improvement
          showValidationMessage(force, el, "warning", "Did you mean <a class='js-mailcheck-fix' href='#'>" + suggestion.full + "</a>?", true);
          return true;
        },
        empty: function(element) {
          // nothing there!
          if ( element.val().toUpperCase().match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/) ) {
            showValidationMessage(force, el, "success", "Great, thanks!");
            return true;
          } else {
            showValidationMessage(force, el, "error", "Something doesn't look right. Are you sure?");
            return false;
          }
        }
      });
    },

    Name: function(e, force) {
      var el = e.target;
      var inputName = $(el).val();

      if( inputName !== "" ) {
        var capitalizedName = inputName.charAt(0).toUpperCase() + inputName.slice(1);
        showValidationMessage(force, el, "success", "Hey " + capitalizedName + "!");
        return true;
      } else {
        showValidationMessage(force, el, "error", "We need your first name.");
        return false;
      }
    },

    Birthday: function(e, force) {
      var el = e.target;

      var birthday = $(el).val().split("/");
      var birthMonth = parseInt(birthday[0]);
      var birthDay = parseInt(birthday[1]);
      var birthYear = parseInt(birthday[2]);

      var now = new Date();
      var todaysYear = now.getFullYear();
      var todaysMonth = now.getMonth() + 1;
      var todaysDay = now.getDate();

      var age;
      if (birthMonth === todaysMonth && birthDay === todaysDay) {
        showValidationMessage(force, el, "success", "Wow, happy birthday!");
        $("#parent_email_field").slideUp();
        return true;
      } else if( birthYear >= 2000 && birthYear < todaysYear) {
        age = todaysYear - birthYear; // TODO: Make accurate
        showValidationMessage(force, el, "success", "Ok, we'll need a parent's email.");
        $("#parent_email_field").slideDown();
        return true;
      } else if( birthYear >= 1989 && birthYear < 2000) {
        age = todaysYear - birthYear;
        showValidationMessage(force, el, "success", age + ", cool!");
        $("#parent_email_field").slideUp();
        return true;
      } else if (birthYear > 1890 && birthYear < 1989) {
        showValidationMessage(force, el, "success", "Yikes, you're old!");
        $("#parent_email_field").slideUp();
        return true;
      } else if ($(el).val() === "") {
        showValidationMessage(force, el, "error", "We need your birthday.");
        $("#parent_email_field").slideUp();
        return false;
      } else {
        showValidationMessage(force, el, "error", "That doesn't seem right!");
        $("#parent_email_field").slideUp();
        return false;
      }
    },

    PhoneNumber: function(e, force) {
      var el = e.target;
      var inputCell = $(el).val();

      // optional field, so don't try to validate if its empty
      if( inputCell !== "" ) {
        // strip non-numeric characters
        inputCell = inputCell.replace(/[^0-9\.]+/g, "");

        if ( inputCell.match(/^\d{10}$/) ) {
          showValidationMessage(force, el, "success", "Thanks!");
          return true;
        } else {
          showValidationMessage(force, el, "error", "Make sure to enter your full 10-digit number.");
          return false;
        }
      }
    },

    Password: function(e, force) {
      var el = e.target;
      var password = $(el).val();

      // if there's anything in the Password Confirmation box, lets check it again
      if($("#confirm_password").val() !== "") {
        Validate.PasswordConfirmation({ target: $("#confirm_password") });
      }

      if ( password.length < 6 ) {
        showValidationMessage(force, el, "error", "Passwords need to be 6+ characters.");
        return false;
      } else {
        showValidationMessage(force, el, "success", "Tough stuff.");
        return true;
      }
    },

    PasswordConfirmation: function(e, force) {
      var el = e.target;
      var password = $("#password").val();
      var passwordConfirmation = $(el).val();

      if (password !== passwordConfirmation) {
        showValidationMessage(force, el, "error", "That doesn't match. Try again!");
        return false;
      } else {
        if ( $("#password").val() !== "" ) {
          showValidationMessage(force, el, "success", "Great, everything looks in order.");
          return true;
        } else {
          return false;
        }
      }
    }
  };

  var showValidationMessage = function showValidationMessage(force, el, type, message, useHTML) {
    var fieldLabel = $("label[for='" + $(el).attr("id") + "']");

    if((message !== "") && (force || $(el).val().length > 0)) {
      fieldLabel.find(".message").removeClass("error success");
      fieldLabel.find(".message").addClass(type);

      if(useHTML) {
        fieldLabel.find(".message").html(message);
      } else {
        fieldLabel.find(".message").text(message);
      }

      fieldLabel.addClass("showMessage");
    }

    $(el).on("focus", hideValidationMessage);
  };

  var hideValidationMessage = function hideValidationMessage() {
    var fieldLabel = $("label[for='" + $(this).attr("id") + "']");
    fieldLabel.removeClass("showMessage");
  };

  $(document).ready(function() {
    $("#username").on("blur", Validate.Email);
    $("#first_name").on("blur", Validate.Name);
    $("#birthday").on("blur", Validate.Birthday);
    $("#parent_email").on("blur", Validate.Email);
    $("#cell").on("blur", Validate.PhoneNumber);
    $("#password").on("blur", Validate.Password);
    $("#confirm_password").on("blur", Validate.PasswordConfirmation);

    $("#auth-form").on("click", ".js-mailcheck-fix", function() {
      var field = document.getElementById( $(this).closest("label").attr("for") );

      $(field).val( $(this).text() );
      $(field).trigger("blur");
    });

    $(".js-toggle-register").on("click", function() {
      var parentModal = $(this).closest(".modal-content");
      var action = parentModal.find("form").attr("action");

      $(window).scrollTop();

      if(action.match(/login/)) {
        // we're in sign in mode; switching to REGISTER
        parentModal.find(".js-auth-heading").text("Get started by registering for DoSomething.org!");
        parentModal.find(".forgot-password").fadeOut();
        parentModal.find(".is-registration-field").slideDown();
        parentModal.find(".js-submit-link").val("Register");
        $(this).text("I already have an account.");

        parentModal.find("form").attr("action", "/register");
      } else {
        // Must be in register mode; switching to SIGN IN
        parentModal.find(".js-auth-heading").text("Sign in to get started!");
        parentModal.find(".is-registration-field").slideUp();
        parentModal.find(".forgot-password").fadeIn();
        parentModal.find(".js-submit-link").val("Sign In");
        $(this).text("Create a DoSomething.org Account");

        parentModal.find("form").attr("action", "/login");
      }
    });


    $("#auth-form").on("submit", function() {
      var modalContent = $("#modal--auth-login").find(".modal-content");

      $("input:visible").trigger("blur", { force: true });

      if( $(".innerLabel .message.error").length > 0) {
        // there are errors on the form
        modalContent.removeClass("wobble fadeIn fadeInUp");
        modalContent.addClass("wobble");
        setTimeout(function() {
          modalContent.removeClass("wobble");
        }, 1000);

        return false;
      } else {
        // there are no errors
        return true;
      }
    });

  });

  // export the validation functions
  NEUE.Validate = Validate;
})(jQuery);
