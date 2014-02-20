/* jshint ignore:start */

module("Validation");

test("Name", function() {
  NEUE.Validation.Functions.name("John", function(result) {
    ok(result.message == "Hey, John!", "should greet");
  });

  NEUE.Validation.Functions.name("", function(result) {
    ok(result.success == false, "should require name");
  });

});

test("Birthdays", function() {
  var now = new Date();
  var birthday_date = (now.getMonth() + 1) + "/" + now.getDate() + "/1990";
  var user_19_years_old = Math.min(now.getMonth() + 2, 12) + "/" + now.getDate() + "/" + (now.getFullYear() - 20);

  NEUE.Validation.Functions.birthday(birthday_date, function(result) {
    ok(result.message == "Wow, happy birthday!", "should wish me a happy birthday");
  });

  NEUE.Validation.Functions.birthday(user_19_years_old, function(result) {
    ok(result.message == "Cool, 19!", "should tell me my age");
  });

  NEUE.Validation.Functions.birthday("yesterday", function(result) {
    ok(result.success == false, "should reject non-formatted dates");
  });

  NEUE.Validation.Functions.birthday("1/15/1960", function(result) {
    ok(result.message == "Yikes, you're old!", "should tell old people that they're old");
  });

  NEUE.Validation.Functions.birthday("1/15/1860", function(result) {
    ok(result.message == "That doesn't seem right.", "should reject users with birthdates too far in the past");
  });

  NEUE.Validation.Functions.birthday("1/15/2095", function(result) {
    ok(result.message == "Are you a time traveller?", "should reject users with future birthdates");
  });

});


test("Emails", function() {
  NEUE.Validation.Functions.email("my.name@gmail.com", function(result) {
    ok(result.success == true, "should accept a valid email");
  });

  NEUE.Validation.Functions.email("my.name.com", function(result) {
    ok(result.success == false, "should reject an invalid email");
  });

  NEUE.Validation.Functions.email("myname@com", function(result) {
    ok(result.success == false, "should reject an invalid email");
  });

  NEUE.Validation.Functions.email("myname@gmail.123", function(result) {
    ok(result.success == false, "should reject an invalid email");
  });
});


test("Passwords", function() {
  NEUE.Validation.Functions.password("12345", function(result) {
    ok(result.success == false, "should reject if too short");
  });

  NEUE.Validation.Functions.password("super$ecure19", function(result) {
    ok(result.success == true, "should be totally chill with a good password");
  });
});

