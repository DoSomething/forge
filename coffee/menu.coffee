# menu logic

$(".js-menu-toggle").on("click", (e)->
	$(".main-menu").toggleClass("is-visible-mobile")
	console.log "yo"
)