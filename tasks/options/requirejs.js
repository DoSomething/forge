module.exports = {
  compile: {
    options: {
      name: "bower_components/almond/almond",
      paths: {
        "neue": "js"
      },
      include: "neue/main",
      out: "dist/neue.js",
      optimize: "none",
      wrap: true
    }
  }
}
