jQuery ($) ->
  $(".js-toggle-video-link").click ->
    $(".js-toggle-video-link").hide()
    $(".scroll-indicator-link").remove()
    $(".js-toggle-video-container").html($(".js-toggle-video-container").data("embed"))
    $(".js-toggle-video-container").show()



window.initializeScrollIndicatorVisibility = () ->
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

