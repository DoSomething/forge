$ = jQuery

$ ->
  $(".no-js-feature-warning").hide()
  $(".js-location-finder-results").hide()

  $(".js-location-finder-button").click (e) ->
    e.preventDefault()
    $(this).addClass("loading")

    zip = $(".js-location-finder-input").val()

    # validate input
    if(zip.match(/^\d{5}$/))
      $.get '/example-data.json', (data)->
        $(".js-location-finder-results-zip").text(zip)

        $(".js-location-finder-results .location-list").html("")
        $.each(data.results, (index, value) ->
          $(".js-location-finder-results .location-list").append(Handlebars.templates['location.template'](value))
        )

        $(".js-location-finder-form").slideUp(400)
        $(".js-location-finder-results").slideDown(400)

        bindResetButton()
      .fail ->
        $(".js-location-finder-results").html("<div class='alert error'>We had trouble talking to the server. Check that your internet connection is working, or try reloading the page.");
        $(".js-location-finder-form").slideUp(400)
        $(".js-location-finder-results").slideDown(400)
    else
      $(".js-location-finder-button").removeClass("loading")
      $(".js-location-finder-form").append("<div id='js-location-finder-validation-error' class='alert error'>Slow down buddy, that's not a zip code.</div>").slideDown(400)

      $(".js-location-finder-input").bind "propertychange input keyup", ->
        $("#js-location-finder-validation-error").slideUp 400, ->
          $("#js-location-finder-validation-error").remove()



bindResetButton = ->
  # bind reset form event
  $(".js-location-finder-reset").click (e) ->
    e.preventDefault()

    $(".js-location-finder-results").slideUp(400)
    $(".js-location-finder-form").slideDown(400)
    $(".js-location-finder-results .location-list").html("")
    $(".js-location-finder-button").removeClass("loading")