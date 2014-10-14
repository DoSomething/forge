# Neue [![Build Status](http://img.shields.io/travis/DoSomething/neue/dev.svg?style=flat)](https://travis-ci.org/DoSomething/neue) 
This is [Neue](http://neue.dosomething.org), our interface framework and pattern library. It defines a set of base styles and common patterns shared throughout our website. It's a strong foundation for building beautiful interfaces.

Neue was built for our internal needs at DoSomething.org, but it could also work for your organization. Feel free to fork this repository and use it as a starting point for your own website and style guide.

# Usage
You can get your own copy of Neue by [downloading a release](https://github.com/DoSomething/ds-neue/releases) or by using [Bower](http://bower.io):

```
bower install DoSomething/neue#~5.0.0
```

Include the bundled `dist/neue.css` and `dist/neue.js` in your page. Be sure to include jQuery 1.7+ and the bundled `dist/modernizr-neue.js` in your page's `<head>`. That's it! Check out the online [pattern library](http://neue.dosomething.org/) and start building.

You can also integrate Neue into your app's SCSS/AMD build process. See [Advanced Usage](wiki/Advanced-Usage). See [CONTRIBUTING](blob/dev/CONTRIBUTING.md) to set up Neue for local development.

### Browser Support
Neue supports Chrome 31+, Safari 5+, Firefox 20+, Android 4+, iOS 5+, and IE8+ (with polyfills). For IE8 support, you'll need to include polyfills to support HTML5 elements, media queries, and rem CSS units. See [HTML5Shiv](aFarkas/html5shiv) and [Respond.js](scottjehl/Respond) for more information.

# License
&copy;2014 DoSomething.org. Neue is free software, and may be redistributed under the terms specified in the [LICENSE](blob/dev/LICENSE.md) file. The name and logo for DoSomething.org are trademarks of Do Something, Inc and may not be used without permission.
