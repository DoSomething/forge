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
      optimize: "uglify2",
      uglify2: {
        compress: {
          dead_code: true,
          drop_debugger: true,
          drop_console: true,
          global_defs: {
            DEBUG: false
          }
        }
      }
    }
  }
}
