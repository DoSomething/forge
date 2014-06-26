## Directory Structure
We've structured our CSS to make sure that it doesn't become unmanageable as it grows over time. Here's a roadmap:
  - globals: Variables and mix-ins. no styles should be defined here.
  - vendor: Third-party code, such as Bourbon or the Meyer Reset
  - _main: Site-wide styles, such as page chrome and the grid.
  - _patterns: Reusable interface patterns
  - _pages: Page-specific styles.
  - neue.scss: The "Makefile" for our outputted CSS.
  - helpers.scss: All variables and mixins are compiled here for inclusion in Neue and app stylesheets.
  - ie.scss: Any overrides for IE 9 or lower should be located here.

## Coding Style
 - We write our styles in [SCSS](http://sass-lang.com/) syntax.
 - Use soft-tabs with a two space indent.
 - Put spaces before `{` in rule declarations. Put spaces after `:` in property declarations.
 - Use hex color codes (for example, `#000` or `#18408b`).
 - Use pixels for sizing elements, unless a size should be proportional to the font-size of the element, in which case use ems.
 - Use `//` for comment blocks (instead of `/* */`).
 - Document styles with [KSS](https://github.com/kneath/kss).

## Style Structure
 - Any $variable or @mixin that is used in more than one file should be put in globals/variables.scss. Otherwise it should be placed at the top of the section where it is used.
 - We use [Bourbon Neat](http://neat.bourbon.io/) mixins to fit our interface to a fluid semantic grid. Use grid mixins to fit containers to the grid rather than writing your own layout rules.
 - Always use re-usable elements rather than building an interface from scratch. All top-level styles should be namespaced with their module name. For example, `.campaign--wrapper`. Nested style declarations do not need to be namespaced.
 - Never style `js-` prefixed classes. Use `is-` prefixed styles when CSS and JS interact.


Here's some nice CSS:
```css
// This is a good example!
//
// .primary - styles primary messages
//
// Styleguide 4.7.1 - Formatted Message
.styleguide--format {
  background: rgba(#000, 0.5);
  border: 1px solid #0f0;
  color: #000;
  
  &.primary {
    font-weight: bold;
  }

  .subtitle {
    font-size: 16px;
  }
}
```
