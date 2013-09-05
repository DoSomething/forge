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
  # toggle dropdown menu navigation on mobile
  $(".js-menu-toggle").click (e)->
    $(".main-menu").toggleClass("is-visible-mobile")

  # toggle search field
  $("form.search input[type='search']").focus (e)->
    $(".utility-link").addClass("is-hidden-on-phones")

  $("form.search input[type='search']").blur (e)->
    $(".utility-link").removeClass("is-hidden-on-phones")

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