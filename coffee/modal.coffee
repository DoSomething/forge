jQuery ($) ->
  $(".js-trigger-modal").click (e) ->
    e.preventDefault()
    href = "#{$(this).attr('href')}"

    $("body").addClass("modal-open")
    $(href).show()

  $(".js-close-modal").click (e) ->
    e.preventDefault()
    $(this).closest(".modal").hide()
    $("body").removeClass("modal-open")
