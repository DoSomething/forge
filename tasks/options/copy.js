module.exports = {
  main: {
    files: [
      { expand: true, src: ["assets/images/**"], dest: "dist/" },
      { expand: true, src: ["assets/kss/**"], dest: "dist/" },
      { expand: true, src: ["assets/fonts/**"], dest: "dist/" },
      { expand: true, src: ["scss/**"], dest: "dist/" },
      { src: "README.md", dest: "dist/README.md" },
      { src: "LICENSE", dest: "dist/LICENSE" },
      { src: "bower.json", dest: "dist/bower.json" },
      { src: "package.json", dest: "dist/package.json" }
    ]
  }
}
