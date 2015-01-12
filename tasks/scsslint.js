module.exports = {
  all: [
    'scss/**/*.scss',
    '!scss/styleguide.scss'
  ],

  options: {
    bundleExec: true,
    config: '.scss-lint.yml',
    colorizeOutput: true
  }
};
