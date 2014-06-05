/**
 * # Image Carousel
 *
 * Adds simple "previous/next" functionality to slide deck-style image
 * galleries with the following markup:
 *
 * @example
 * //  <div class="js-carousel gallery">
 * //    <div id="prev" class="prev-wrapper">
 * //      <div class="prev-button"><span class="arrow">&#xe605;</span></div>
 * //    </div>
 * //
 * //    <div class="carousel-wrapper">
 * //      <figure id="slide0" class="slide"><img src="./img/example_img0.jpg" /></figure>
 * //      <figure id="slide1" class="slide"><img src="./img/example_img1.jpg" /></figure>
 * //      <figure id="slide2" class="slide"><img src="./img/example_img2.jpg" /></figure>
 * //      <figure id="slide3" class="slide"><img src="./img/example_img3.jpg" /></figure>
 * //    </div>
 * //
 * //    <div id="next" class="next-wrapper">
 * //      <div class="next-button"><span class="arrow">&#xe60a;</span></div>
 * //    </div>
 * //  </div>
 *
 */

define(function() {
  "use strict";

  var $ = window.jQuery;

  $(function() {
    // Show first image
    $("#slide0").addClass("visible");

    // Make carousel stateful
    var counter = 0,
        totalCount = $(".slide").length - 1;

    // Cache carousel buttons
    var $buttons = $("#prev, #next");

    // Decrement counter
    function decrementCounter() {
      // If first slide is shown, restart loop
      // Else, show previous slide
      counter === 0 ? counter = totalCount : counter--;
    }

    // Increment counter
    function incrementCounter() {
      // If last slide is shown, restart loop
      // Else, show next slide
      counter === totalCount ? counter = 0 : counter++;
    }

    // Toggle slide visibility
    function showCurrentSlide( direction ) {
      // Remove "visibile" class from the current slide
      $("#slide" + counter).removeClass("visible");

      // Increment or decrement slide position based on user"s request
      direction === "prev" ? decrementCounter() : incrementCounter();

      // Assign "visible" class to the requested slide
      $("#slide" + counter).addClass("visible");
    }

    // Bind click event to carousel buttons
    $buttons.click(function() {
      showCurrentSlide( $(this).attr("id") );
    });
  });
});
