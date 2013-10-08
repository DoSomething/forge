###

Location finder widget.

Usage:

  window.initializeLocationFinder({
    mode: 'default' or 'select',
    endpoint: '<JSON endpoint URL>',
    target: <if in 'select' mode, DOM object where selected ID will be output to>
  });

###

$ = jQuery
options = {}

window.initializeLocationFinder = (opts) ->
  # set up default options 
  defaults =
    mode: 'default', 
    endpoint: '/example-data.json',
    delegate: $(".js-location-finder-delegate")

  # combine options with default values
  if(opts?)
    options = $.extend({}, defaults, opts)
  else
    options = defaults

  $(".no-js-feature-warning").hide()
  $(".no-js-hide-feature").show()
  $(".js-location-finder-results").hide()

  $(".js-location-finder-button").click (e) ->
    e.preventDefault()
    findLocation()

  $(".js-location-finder-form").submit (e) ->
    e.preventDefault()
    findLocation()


findLocation = ->
  $(this).addClass("loading")

  zip = $(".js-location-finder-input").val()

  # validate input
  if(zip.match(/^\d{5}$/))
    $.get "#{options.endpoint}?zip=#{zip}", (data)->
      $(".js-location-finder-results-zip").text(zip)

      $(".js-location-finder-results .location-list").html("")
      $.each(data.results, (index, value) ->
        if(options.mode == "select")
          modifier_class = ""
        else
          modifier_class = ""

        $(".js-location-finder-results .location-list").append("""
          <li data-id="#{value.id}">
            <strong>#{value.name}</strong><br>
            #{value.street}, #{value.city}, #{value.state} #{value.zip}<br>
            (555) 555-5555
          </li>
          """)
      )

      if(options.mode == "select")
        list_items = $(".js-location-finder-results .location-list li")
        list_items.addClass("js-clickable")
        list_items.click( ->
          $(".js-location-finder-results .location-list").find(".js-clickable").removeClass("js-selected");
          $(this).addClass("js-selected")

          if(options.delegate?)
            options.delegate.val($(this).data("id"))
          else
            console.error("Location finder delegate not set.")
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
      $("#js-location-finder-validation-error").delay(800).slideUp 400, ->
        $("#js-location-finder-validation-error").remove()



bindResetButton = ->
  # bind reset form event
  $(".js-location-finder-reset").click (e) ->
    e.preventDefault()

    $(".js-location-finder-results").slideUp(400)
    $(".js-location-finder-form").slideDown(400)
    $(".js-location-finder-results .location-list").html("")
    $(".js-location-finder-button").removeClass("loading")