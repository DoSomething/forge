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


