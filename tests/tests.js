/* jshint ignore:start */

module("Validation");

test("Name", function() {
  ValidationFunctions.name("John", function(result) {
    ok(result.message == "Hey, John!", "should greet");
  });

  ValidationFunctions.name("", function(result) {
    ok(result.success == false, "should require name");
  });

});

test("Birthdays", function() {
  var now = new Date();
  var birthday_date = (now.getMonth() + 1) + "/" + now.getDate() + "/1990";
  var user_19_years_old = Math.min(now.getMonth() + 2, 12) + "/" + now.getDate() + "/" + (now.getFullYear() - 20);

  ValidationFunctions.birthday(birthday_date, function(result) {
    ok(result.message == "Wow, happy birthday!", "should wish me a happy birthday");
  });

  ValidationFunctions.birthday(user_19_years_old, function(result) {
    ok(result.message == "Cool, 19!", "should tell me my age");
  });

  ValidationFunctions.birthday("yesterday", function(result) {
    ok(result.success == false, "should reject non-formatted dates");
  });

  ValidationFunctions.birthday("1/15/1960", function(result) {
    ok(result.message == "Yikes, you're old!", "should tell old people that they're old");
  });

  ValidationFunctions.birthday("1/15/1860", function(result) {
    ok(result.message == "That doesn't seem right.", "should reject users with birthdates too far in the past");
  });

  ValidationFunctions.birthday("1/15/2095", function(result) {
    ok(result.message == "Are you a time traveller?", "should reject users with future birthdates");
  });

});


test("Emails", function() {
  ValidationFunctions.email("my.name@gmail.com", function(result) {
    ok(result.success == true, "should accept a valid email");
  });

  ValidationFunctions.email("my.name.com", function(result) {
    ok(result.success == false, "should reject an invalid email");
  });

  ValidationFunctions.email("myname@com", function(result) {
    ok(result.success == false, "should reject an invalid email");
  });

  ValidationFunctions.email("myname@gmail.123", function(result) {
    ok(result.success == false, "should reject an invalid email");
  });
});


test("Passwords", function() {
  ValidationFunctions.password("12345", function(result) {
    ok(result.success == false, "should reject if too short");
  });

  ValidationFunctions.password("super$ecure19", function(result) {
    ok(result.success == true, "should be totally chill with a good password");
  });
});

