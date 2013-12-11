/* jshint ignore:start */

module("Basic Tests");
 
test("Should respond correctly to birthdays", function() {
  equal(
    NEUE.Validate.Tests.birthday(""),
    {"status": "ERROR", "flag": "INVALID"},
    "Shouldn't validate an empty string"
  );

  equal(
    NEUE.Validate.Tests.birthday("4/-1/1990"),
    {"status": "ERROR", "flag": "INVALID"},
    "Shouldn't validate a non-date (negative numbers)"
  );

  equal(
    NEUE.Validate.Tests.birthday("4/1/199g"),
    {"status": "ERROR", "flag": "INVALID"},
    "Shouldn't validate a non-date (letters)"
  );

  equal(NEUE.Validate.Tests.birthday("1/1/2012"), "TOO_YOUNG", "Shouldn't accept 1-year-olds.");
  equal(NEUE.Validate.Tests.birthday("1/1/2005"), "TOO_YOUNG", "Shouldn't accept 9-year-olds.");
  equal(NEUE.Validate.Tests.birthday("4/1/1492"), "ERROR", "Shouldn't accept 1492 as a valid birth year");
  
  equal(NEUE.Validate.Tests.birthday(""), true, "1 is truthy");
  equal(NEUE.Validate.Tests.birthday(""), true, "1 is truthy");
});
