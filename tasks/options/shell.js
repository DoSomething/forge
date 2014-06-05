module.exports = {
  dist: {
    command: [
      // checkout master, rebase and push
      "git checkout master",
      "git rebase dev",
      "git push origin master",

      // push to heroku
      "git push heroku master",

      // destroy current dist branch
      "git branch -D dist",
      "git push origin :dist",

      // create a new dist branch off of master
      "git checkout -b dist ",

      // get rid of everything besides the contents of the dist directory
      "find . -maxdepth 1 ! -name 'dist' ! -name 'node_modules' ! -name '.*' | xargs rm -rf",
      "cp -r dist/* .",
      "rm -rf dist",

      // commit those changes and tag with version
      "git add --all .",
      "git commit -m 'Prepared for distribution.'",
      "git tag -a v<%= pkg.version %> -m 'Version <%= pkg.version %>'",

      // push dist branch and tags to origin
      "git push origin dist --tags",

      // and finally, bring us back to the master branch
      "git checkout dev"
    ].join("&&"),
    options: {
      stdout: true,
      failOnError: true
    }
  }
}
