# 
# The location finder module must be initialized before it can be used on a page. Usage:
# 
#   ```js
#   window.initializeLocationFinder({
#     mode: 'default' or 'select',
#     endpoint: '<JSON endpoint URL>',
#     validatoin: 
#     
#   });
#   ```
#

# We initialize the module in a closure to protect it from being tampered with.
do ($, window) ->
  initialized = false;
  options = {}

  window.initializeLocationFinder = (opts) ->
    # We track whether the module is initialized and prevent re-initialization.
    if (!initialized) 
      initialized = true;

      # Default options can be overridden by passing JSON value in to initialize method.
      # - **mode:** either 'default' or 'select'
        #    - 'select' makes results clickable, and passes the selected result to a hidden form delegate
      # - **endpoint:** JSON endpoint to connect to
      # - **validation:** regex for form validation, ex: `/^\d{5}$/`
      # - **delegate:** if in 'select' mode, DOM object where selected ID will be output to, ex: $("#formID")
      defaults =
        mode: 'default',
        endpoint: '/example-data.json',
        validation: /[\s\S]*/,
        delegate: $('.js-location-finder-delegate')

      # Override default options with any settings passed during initialization.
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

    # If a `validation` regular expression was set, we check that before proceeding.
    if(zip.match(options.validation))
      $.get "#{options.endpoint}#{zip}", (data)->
        $(".js-location-finder-results-zip").text(zip)

        $(".js-location-finder-results .location-list").html("")
        $.each(data.results, (index, value) ->
          if(options.mode == "select")
            modifier_class = ""
          else
            modifier_class = ""

          $(".js-location-finder-results .location-list").append("""
            <li data-id="#{@gsid}">
              <strong>#{@name}</strong><br>
              #{@street}, #{@city}, #{@state} #{@zip}<br>
              #{if @phone? then @phone + "\n" else "" }
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
      # removed fail handler because jQuery 
      # .fail ->
      #   $(".js-location-finder-results").html("<div class='alert error'>We had trouble talking to the server. Check that your internet connection is working, or try reloading the page.");
      #   $(".js-location-finder-form").slideUp(400)
      #   $(".js-location-finder-results").slideDown(400)
    else
      $(".js-location-finder-button").removeClass("loading")
      $(".js-location-finder-form").append("<div id='js-location-finder-validation-error' class='messages error'>Slow down buddy, that's not a zip code.</div>").slideDown(400)

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