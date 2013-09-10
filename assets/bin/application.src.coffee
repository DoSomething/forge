$ = jQuery

$ ->
  $(".js-jump-scroll").click (e)->
    e.preventDefault()

    href = $(this).attr('href')
    $('html,body').animate({scrollTop: $(e.target.hash).offset().top}, 'slow', () ->
      window.location.hash = href
    )

$ = jQuery

$ ->
  $(".no-js-feature-warning").hide()
  $(".js-location-finder-results").hide()

  $(".js-location-finder-button").click (e) ->
    e.preventDefault()
    $(this).addClass("loading")

    zip = $(".js-location-finder-input").val()

    $.get '/example-data.json', (data)->
      $(".js-location-finder-results-zip").text(zip)

      $(".js-location-finder-results .location-list").html("")
      $.each(data.results, (index, value) ->
        $(".js-location-finder-results .location-list").append(Handlebars.templates['location.template'](value))
      )

      $(".js-location-finder-form").slideUp(400)
      $(".js-location-finder-results").slideDown(400)

      # bind reset form event
      $(".js-location-finder-reset").click (e) ->
        e.preventDefault()

        $(".js-location-finder-results").slideUp(400)
        $(".js-location-finder-form").slideDown(400)
        $(".js-location-finder-results .location-list").html("")
        $(".js-location-finder-button").removeClass("loading")

    .fail ->
      $(".js-location-finder-results").html("<div class='alert error'>We had trouble talking to the server. Check that your internet connection is working, or try reloading the page.");
      $(".js-location-finder-form").slideUp(400)
      $(".js-location-finder-results").slideDown(400)



$ = jQuery

$ ->
  $(document).ready ->
    # toggle dropdown menu navigation on mobile
    $(".js-menu-toggle").click (e)->
      $(".main-menu").toggleClass("is-visible-mobile")

    # toggle search field
    $(".search form input[type='search']").focus (e)->
      $(".utility-link").addClass("is-hidden-on-phones")

    $(".search form input[type='search']").blur (e)->
      $(".utility-link").removeClass("is-hidden-on-phones")

# removes :hover rules when on touch device
if Modernizr.touch
  ignore = /:hover\b/
  try
    for stylesheet in document.styleSheets
      idxs = []
      # detect hover rules
      for rule, idx in stylesheet.cssRules
        if rule.type is CSSRule.STYLE_RULE and ignore.test(rule.selectorText)
          idxs.unshift idx

      # delete hover rules
      stylesheet.deleteRule idx for idx in idxs
$ = jQuery

window.pinToTop = () ->
  $(window).scroll(stickyRelocate)
  stickyRelocate()

stickyRelocate = (el) ->
  window_top = $(window).scrollTop()
  div_top = $("#js-pin-to-top-anchor").offset().top
  
  if (window_top > div_top)
    $('.js-pin-to-top').addClass('is-stuck')
  else
    $('.js-pin-to-top').removeClass('is-stuck')