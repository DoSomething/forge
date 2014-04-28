module.exports = {
  prod: {
    options: {
      report: "gzip",
      mangle: {
        except: ["$"]
      }
    },
    files: {
      "dist/neue.min.js": ["dist/neue.js"]
    }
  }
}
