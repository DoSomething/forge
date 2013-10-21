###

 Give a brief description of what your module does. Usage:
 
   ```js
    var exampleModule = window.DSExampleModule();
    exampleModule.initialize({
      configuration_option: true
    });

    exampleModule.getStatus();
   ```

###

$ = jQuery

window.DSExampleModule = ->
  ###
    PRIVATE METHODS & VARIABLES:
  ###
  initialized = false;
  options = {}

  status = ->
    console.log "I am #{options.configuration_option}!"

  ###
    PUBLIC METHODS:
  ###
  initialize: (opts) ->
    defaults =
      configuration_option: false

    # Override default options with any settings passed during initialization.
    if(opts?)
      options = $.extend({}, defaults, opts)
    else
      options = defaults

    # Do anything else we need to set up this module.
    # ...

    status()

  getStatus: ->
    status()
