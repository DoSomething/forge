module.exports = {
  prod: {
    options: {
      report: "gzip",
      compress: {
        dead_code: true,
        drop_debugger: true,
        join_vars: true,
        drop_console: true,
        global_defs: {
          DEBUG: false
        }
      },
      mangle: {
        except: ["jQuery", "$", "Modernizr", "NEUE"]
      }
    },
    files: {
      "dist/neue.min.js": ["dist/neue.js"]
    }
  }
}
