//
//
//  **Tests for IE flexbox support, and if so apply a fix.**
//
//  For more information:
//  http://thatemil.com/blog/2013/11/03/sticky-footers-flexbox-and-ie10/
//
//

(function() {
  "use strict";

  Modernizr.addTest("flexbox-ie10", Modernizr.testAllProps("flexAlign", "end", true));

})();
