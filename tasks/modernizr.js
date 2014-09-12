module.exports = {
  dist: {
    "devFile": "remote",
    "outputFile": "dist/modernizr-neue.js",
    "files" : {
      "src": ["js/**/*.js", "scss/**/*.scss"]
    },
    "extra" : {
      "shiv" : false,
      "printshiv" : false,
      "load" : true,
      "mq" : false,
      "video": false
    },
  }
}
