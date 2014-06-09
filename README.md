# DS Neue [![Build Status](https://travis-ci.org/DoSomething/neue.svg?branch=dev)](https://travis-ci.org/DoSomething/neue)
This is Neue, our interface framework and pattern library. Neue is made up of four pillars: typography, a fluid grid-based layout system, re-usable interface patterns, and animations. It's a strong foundation for building beautiful interfaces.

 - **Typography**: Content is the basis of our design, so we need a strong typographic foundation. We define base HTML classes with comfortable font-size and spacing for readability, and a clear information hierarchy between elements.
 - **Layout**: We use a fluid 16-column [semantic grid](http://neat.bourbon.io) to lay out our interfaces. This promotes consistency and provides rules for layouts to comfortably expand and contract in a multi-device world.
 - **Interface Patterns**: We don't want to re-invent the wheel. Re-usable interface patterns are catalogued within Neue to promote consistency throughout the interface and minimize code bloat.
 - **Animations**: Animations bring our interface to life. We use animation both to add delight and energy to an interface, and to hint at functionality and inform the user's mental model of how an interface functions.

Neue was built for our internal needs at DoSomething.org, but it could also work for your organization. Feel free to fork this repository and use it as a starting point for your own website and style guide.

# Requirements
### Dependencies
Neue requires [jQuery](http://jquery.com) 1.7.2+ and the included [Modernizr](http://modernizr.com) build (see `js/vendor/modernizr.js`).

### Browser Support
Neue supports Chrome 31+, Safari 5+, Firefox 20+, Android 4+, iOS 5+, and IE8+ (with polyfills). For IE8 support, you'll need to include polyfills to support HTML5 elements, media queries, and rem CSS units. See [HTML5Shiv](aFarkas/html5shiv), [Respond.js](scottjehl/Respond), and [REM-Unit-Polyfill](chuckcarpenter/REM-unit-polyfill) for details.

# Usage
You can get your own copy of Neue by [downloading a release](https://github.com/DoSomething/ds-neue/releases) or by using [Bower](http://bower.io):

```
bower install git@github.com:DoSomething/neue.git
```

Include the bundled `neue.css` and `neue.js` in your page. Be sure to include the bundled `js/vendor/modernizr.js` in your page's `<head>`. That's it! Check out the online [pattern library](http://neue.dosomething.org/) and start building.

You can also integrate Neue into your SCSS/AMD build process. See [Advanced Usage](wiki/Advanced-Usage).

# Contributing
The latest version of the pattern library is always available online at [neue.dosomething.org](http://neue.dosomething.org/).
You can also run the pattern library on your local machine! Here's the steps:

  1. Clone this repository.
  2. Run `bower install`, `bundle install`, and `npm install` to configure dependencies. Yikes.
  3. Run `grunt` to build CSS and JS from source (and watch for changes).
  3. Run `rackup` to start the server (or just link to Pow).
  4. Check it out in your browser!

Check the [Deployment](https://github.com/DoSomething/neue/wiki/Deployments) page on the wiki for instructions to deploy a new version of the Pattern Library. You must be a collaborator on the repo to deploy new versions.

# Code Guidelines
Code guidelines for SCSS and JavaScript can be found as a `README` within their respective directories in the repo. We also use [SCSS-Lint](https://github.com/causes/scss-lint) and [JSHint](http://www.jshint.com/) to keep our code neat and tidy.

# License
&copy;2014 DoSomething.org. Neue is free software, and may be redistributed under the terms specified in the LICENSE file. The name and logo for DoSomething.org are trademarks of Do Something, Inc and may not be used without permission.
