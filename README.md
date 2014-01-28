# DS Neue

[![wercker status](https://app.wercker.com/status/9c3905a0a14be38a75d857e1f7ffdeda "wercker status")](https://app.wercker.com/project/bykey/9c3905a0a14be38a75d857e1f7ffdeda)

This is DS Neue, our interface framework and style guide. Neue is made up of four pillars: typography, a fluid grid-based layout system, re-usable interface patterns, and animations. It's a strong foundation for building beautiful interfaces.

 - **Typography**: Content is the basis of our design, so we need a strong typographic foundation. We define base HTML classes with comfortable font-size and spacing for readability, and a clear information hierarchy between elements.
 - **Layout**: We use a fluid 12-column grid to lay out our interfaces. This promotes consistency and provides rules for layouts to comfortably expand and contract in a multi-device world.
 - **Interface Patterns**: We don't want to re-invent the wheel. Re-usable interface patterns are catalogued within Neue to promote consistency throughout the interface and minimize code bloat.
 - **Animations**: Animations bring our interface to life. We use animation both to add delight and energy to an interface, and to hint at functionality and inform the user's mental model of how an interface functions.

Neue was built for our internal needs at DoSomething.org, but it could also work for your organization. Feel free to fork this repository and use it as a starting point for your own website and style guide.

# Usage
You can get your own copy of the Pattern Library by [downloading a release](https://github.com/DoSomething/ds-neue/releases) or by using [Bower](http://bower.io):

```
bower install git@github.com:DoSomething/ds-neue.git
```

If you want to specify a specific version to install, you can do that as well:

```
bower install git@github.com:DoSomething/ds-neue.git#2.8.0
```

# Contributing
The latest version of the styleguide is always available online at [styleguide.dosomething.org](http://styleguide.dosomething.org/).

You can also run the styleguide on your local machine! Here's the steps:

  1. Clone this repository.
  2. Run `bundle install` and `npm install` to configure dependencies.
  3. Run `grunt` to build CSS and JS from source (and watch for changes).
  3. Run `rackup` to start the server (or just link to Pow).
  4. Check it out in your browser!

Check the [Deployment](https://github.com/DoSomething/ds-neue/wiki/Deployments) page on the wiki for instructions to deploy a new version of the Pattern Library. You must be a collaborator on the repo to deploy new versions.

# Code Guidelines
Code guidelines for SCSS and JavaScript can be found as a `README` within their respective directories in the repo. We also use [JSHint](http://www.jshint.com/) to keep our JavaScript neat and tidy.

# License
&copy;2013 DoSomething.org. Neue is free software, and may be redistributed under the terms specified in the LICENSE file. The name and logo for DoSomething.org are trademarks of Do Something, Inc and may not be used without permission.
