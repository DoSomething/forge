$ = jQuery

window.sidebarActiveLinks = () ->
  topRange   = 200
  contentTop = []

  # Set up content array of locations
  $('nav.sidebar').find('a').each ()->
    contentTop.push $($(this).attr('href')).offset().top

  # Update "active" state on sidebar when scrolling
  $(window).scroll ()->
    windowTop = $(window).scrollTop()
    bodyHeight = $(document).height()
    viewportHeight = $(window).height()

    $.each(contentTop, (i,loc) ->
      if ((loc > windowTop && (loc < windowTop + topRange || (windowTop + viewportHeight) >= bodyHeight)))
        $('nav.sidebar a').removeClass("active")
        $('nav.sidebar a').eq(i).addClass("active")
    )