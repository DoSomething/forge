# Neue [![Build Status](https://img.shields.io/wercker/ci/550b2c5b67ccfc73272e2f42.svg)](https://travis-ci.org/DoSomething/neue) [![NPM](https://img.shields.io/npm/v/dosomething-neue.svg)](https://www.npmjs.com/package/dosomething-neue)
This is [Neue](http://neue.dosomething.org), our interface framework and pattern library. It defines a set of base styles and common patterns shared throughout our website. It's a strong foundation for building beautiful interfaces.

Neue was built for our internal needs at DoSomething.org, but it could also work for your organization. Feel free to fork this repository and use it as a starting point for your own website and style guide, or read more about [why we open-source our code](https://blog.dosomething.org/we-open-sourced-our-code-heres-why-you-should-too/).

### Usage
You can get your own copy of Neue by [downloading a release](https://github.com/DoSomething/neue/releases) or by using [NPM](http://npmjs.com):

```
npm install dosomething-neue
```

Include the bundled `dist/neue.css` and `dist/neue.js` in your page. Be sure to include jQuery 1.7+ and the bundled Modernizr build `dist/modernizr.js`. That's it! Check out the online [pattern library](http://neue.dosomething.org/) and start building.

Neue supports Chrome 39+, Firefox 34+, Safari 7+, Android 4+, iOS 7+, and Internet Explorer 8+ (with polyfills). For IE 8 support, you'll need to include [HTML5Shiv](https://www.github.com/aFarkas/html5shiv) and [Respond.js](https://www.github.com/scottjehl/Respond).

### Local Development 
You can also run the pattern library on your local machine! Here's the steps:

  1. Fork & clone this repository.
  2. Run `npm install` to configure dependencies.
  3. Run `grunt` to build assets, watch for changes, and run styleguide server.
  4. Check it out at `localhost:3000` in your browser!

### License
&copy;2015 DoSomething.org. Neue is free software, and may be redistributed under the terms specified in the [LICENSE](blob/dev/LICENSE.md) file. The name and logo for DoSomething.org are trademarks of Do Something, Inc and may not be used without permission.
