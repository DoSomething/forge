define(function() {
  "use strict";

  var $ = window.jQuery;

  /**
   * Replace the `video` tag in a tile with a static image, based on either the `poster`
   * attribute of the video, or an included `img` fallback source.
   */
  function replaceVideoWithImage() {
    var poster = $(this).attr('poster') || $(this).find('img').attr('src');
    $(this).replaceWith($("<img>").attr('src', poster));
  }

  // On Mobile Safari, we need to replace `<video>` with a static image so the "play" control does not appear.
  // Yes, this is browser sniffing - but we're fixing a browser-specific quirk so I don't think it's evil.
  if (window.navigator.userAgent.match(/iPad/i) || window.navigator.userAgent.match(/iPhone/i)) {
    $(function() {
      $(".tile video").each(replaceVideoWithImage);
    });
  }
});
