jQuery ($) ->
  $(document).ready ->
    # toggle dropdown menu navigation on mobile
    $(".js-menu-toggle").click (e)->
      $(".main-menu").toggleClass("is-visible-mobile")

    # toggle search field
    $(".search form input[type='search']").focus (e)->
      $(".utility-link").addClass("is-hidden-on-phones")

    $(".search form input[type='search']").blur (e)->
      $(".utility-link").removeClass("is-hidden-on-phones")
