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

})();
