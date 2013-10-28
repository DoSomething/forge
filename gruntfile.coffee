module.exports = (grunt) ->
	grunt.initConfig
		pkg: grunt.file.readJSON('package.json')

		# watch files for changes
		watch:
			sass:
				files: ['scss/**/*.{scss,sass}']
				tasks: ['sass:dist']
			coffee:
				files: ['coffee/vendor/**/*.js', 'coffee/**/*.coffee']
				tasks: ['coffee:compile', 'uglify:js', 'docco']
			livereload:
				files: ['*.html', 'assets/**/*.{js,json}','assets/images/**/*.{png,jpg,jpeg,gif,webp,svg}'],
				options:
					livereload: true

		# compile SCSS
		sass:
			dist:
				files:
					'assets/neue.css': 'scss/neue.scss'
					'assets/neue.dev.css': 'scss/neue.dev.scss'
					'assets/ie.css': 'scss/ie.scss'
				options:
					style: 'compressed'

		# compile CoffeeScript
		coffee:
			compile:
				files:
					'assets/bin/neue.js': ['coffee/*.coffee']

		# concatenate CoffeeScript and third-party JavaScript & minify
		uglify:
			js:
				files:
					'assets/neue.js': ['coffee/vendor/**/*.js', 'assets/bin/neue.js']

		# generate documentation for CoffeeScript files
		docco:
			docs:
				src: ['coffee/*.coffee']
				options:
					output: 'assets/docs'

		# some helper tasks for versioning
		bump:
			options:
				pushTo: 'origin'


	# register grunt tasks
	grunt.registerTask 'build', ['sass:dist', 'coffee:compile', 'uglify:js', 'docco']
	grunt.registerTask 'default', ['build', 'watch']

	# load grunt dependencies
	grunt.loadNpmTasks 'grunt-contrib-sass'
	grunt.loadNpmTasks 'grunt-contrib-coffee'
	grunt.loadNpmTasks 'grunt-contrib-concat'
	grunt.loadNpmTasks 'grunt-contrib-uglify'
	grunt.loadNpmTasks 'grunt-contrib-watch'
	grunt.loadNpmTasks 'grunt-docco2'
	grunt.loadNpmTasks 'grunt-bump'
