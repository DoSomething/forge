$ = jQuery

$ ->
  $(".js-toggle-video-link").click ->
    $(".js-toggle-video-link").hide()
    $(".scroll-indicator-link").hide()
    $(".js-toggle-video-container").html("<iframe src='http://www.youtube.com/embed/nz8mmznuasw?autoplay=1&amp;modestbranding=1&amp;autohide=1' frameborder='0' allowfullscreen></iframe>")
    $(".js-toggle-video-container").show()

  setScrollIndicatorVisibility()
  $(window).on "scroll touchmove resize", ->
    setScrollIndicatorVisibility()

setScrollIndicatorVisibility = ->
    window_top = $(window).scrollTop()
    content_top = $(".js-scroll-indicator-link-killer").offset().top

    if($(".js-scroll-indicator-link-killer").visible(true))
      $(".scroll-indicator-link").fadeOut(400)
    else if(window_top < content_top)
      $(".scroll-indicator-link").fadeIn(400)

