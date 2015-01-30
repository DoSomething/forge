/**
 * Modernizr test for CSS3 `:checked` selector. This test is not
 * included in Modernizr until 3.0, so adding manually for now.
 */

/* jshint strict:false */
/* global Modernizr:false */

Modernizr.addTest("checked", function(){
  return Modernizr.testStyles("#modernizr {position:absolute} #modernizr input {margin-left:10px} #modernizr :checked {margin-left:20px;display:block}", function( elem ){
    var cb = document.createElement("input");
    cb.setAttribute("type", "checkbox");
    cb.setAttribute("checked", "checked");
    elem.appendChild(cb);
    return cb.offsetLeft === 20;
  });
});

