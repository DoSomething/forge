module.exports = {
  clean: {
    clean: true, // Require repo to be clean (no unstaged changes)
  },
  validtag: {
    tag: {
      valid: '<%= pkg.version %>', // check if pkg.version is valid semantic version
      lt: '<%= pkg.version %>' // check if highest repo tag is lower than pkg.version
    }
  }
}
