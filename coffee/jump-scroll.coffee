$(".js-jump-scroll").on("click", (e)->
	e.preventDefault()

	href = $(this).attr('href')
	$('html,body').animate({scrollTop: $(e.target.hash).offset().top}, 'slow', () ->
		window.location.hash = href
	)
)