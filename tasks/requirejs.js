module.exports = {
  compile: {
    options: {
      baseUrl: "dist/",
      name: "../bower_components/almond/almond",
      paths: {
        "neue": "../js"
      },
      include: "neue/main",
      insertRequire: ["neue/main"],
      out: "dist/neue.js",
      wrap: true,
      preserveLicenseComments: false,
      generateSourceMaps: true,
      optimize: "uglify2"
    }
  }
}
