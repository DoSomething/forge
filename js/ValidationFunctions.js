//
//
// Some basic validation functions for use with `validation.js`.
// Validations can be added later by attaching to the
// `NEUE.Validation.Functions` object and referencing the function
// by name in the `data-validate` attribute.
//
// Validations give a JSON response to the `done()` callback
// when they've finished validating with a boolean `success`
// and a plain-text `message` value. (Alternatively, a
// `suggestion` value can be passed which will prompt
// the user "Did you mean {suggestion}?".
//
//

/* global Kicksend */

var NEUE = NEUE || {};
NEUE.Validation = NEUE.Validation || {};
NEUE.Validation.Functions = NEUE.Validation.Functions || {};

(function() {
  "use strict";

  NEUE.Validation.Functions = {
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

      // parse date from string
      if( /^\d{1,2}\/\d{1,2}\/\d{4}$/.test(string) ) {
        // default, typed by user MM/DD/YYYY
        birthday = string.split("/");
        birthMonth = parseInt(birthday[0]);
        birthDay = parseInt(birthday[1]);
        birthYear = parseInt(birthday[2]);
      } else {
        return done({
          success: false,
          message: "Enter your birthday MM/DD/YYYY!"
        });
      }

      // fail if incorrect month
      if (birthMonth > 12) {
        return done({
          success: false,
          message: "That doesn't seem right."
        });
      }

      // fail if incorrect day
      // @TODO: Doesn't account for non-31 day months or leap years... meh.
      if (birthDay > 31) {
        return done({
          success: false,
          message: "That doesn't seem right."
        });
      }

      // create date objects
      var birthDate = new Date(birthYear, birthMonth - 1, birthDay);
      var now = new Date();
      var age = Math.floor( (now - birthDate) / 31536000000 );
      // 31536000000 milliseconds in a year! math!

      if (age < 0)  {
        return done({
          success: false,
          message: "Are you a time traveller?"
        });
      } else if( age > 0 && age <= 25  ) {

        if (birthDate.getMonth() === now.getMonth() && now.getDate() === birthDate.getDate() ) {
          return done({
            success: true,
            message: "Wow, happy birthday!"
          });
        } else if ( age < 10) {
          return done({
            success: true,
            message: "Wow, you're " + age + "!"
          });
        } else {
          return done({
            success: true,
            message: "Cool, " + age + "!"
          });
        }

      } else if (age > 25 && age < 130) {
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
    },

    match: function(string, secondString, done) {
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
    },

    phone: function(string, done) {
      // Matches server-side validation from `dosomething_user_valid_cell()` in `dosomething_user.module`.
      var sanitizedNumber = string.replace(/[^0-9]/g, "");
      var isValidFormat = /^(?:\+?1([\-\s\.]{1})?)?\(?([0-9]{3})\)?(?:[\-\s\.]{1})?([0-9]{3})(?:[\-\s\.]{1})?([0-9]{4})/.test(string);
      var allRepeatingDigits = /([0-9]{1})\1{9,}/.test(sanitizedNumber);
      var hasRepeatingFives = /555/.test(string);

      if(isValidFormat && !allRepeatingDigits && !hasRepeatingFives) {
        return done({
          success: true,
          message: "Thanks!"
        });
      } else {
        return done({
          success: false,
          message: "Enter a valid telephone number."
        });
      }

    }
  };

})();
