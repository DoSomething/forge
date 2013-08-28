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
