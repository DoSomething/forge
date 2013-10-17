jQuery ($) ->
  win = $(window)
  allFades = $(".js-fade-up-on-scroll")

  # check if already visible
  allFades.each (i, el) ->
    el = $(el)
    if(el.real_visible(true))
      el.addClass("come-in")

  $(window).scroll (e) ->
    allFades.each (i, el) ->
      el = $(el)
      if(el.real_visible(true))
        el.addClass("come-in")