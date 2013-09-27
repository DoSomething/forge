$ = jQuery

# check if already visible



$ ->
  win = $(window)
  allFades = $(".js-fade-up-on-scroll")

  allFades.each (i, el) ->
    el = $(el)
    if(el.real_visible(true))
      el.addClass("come-in")

  $(window).scroll (e) ->
    allFades.each (i, el) ->
      el = $(el)
      if(el.real_visible(true))
        el.addClass("come-in")