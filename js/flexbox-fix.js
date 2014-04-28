/**
 * Tests for IE flexbox support, and if so apply a fix.
 *
 * @see http://thatemil.com/blog/2013/11/03/sticky-footers-flexbox-and-ie10/
 */

define(function(require) {
  "use strict";

  require("./vendor/modernizr");

  Modernizr.addTest("flexbox-ie10", Modernizr.testAllProps("flexAlign", "end", true));
});
