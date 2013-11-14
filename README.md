# DS Neue
This is DS Neue, our interface framework and style guide. Neue is made up of four pillars: typography, a fluid grid-based layout system, re-usable interface patterns, and animations. It's a strong foundation for building beautiful interfaces.

 - **Typography**: Content is the basis of our design, so we need a strong typographic foundation. We define base HTML classes with comfortable font-size and spacing for readability, and a clear information hierarchy between elements.
 - **Layout**: We use a fluid 12-column grid to lay out our interfaces. This promotes consistency and provides rules for layouts to comfortably expand and contract in a multi-device world.
 - **Interface Patterns**: We don't want to re-invent the wheel. Re-usable interface patterns are catalogued within Neue to promote consistency throughout the interface and minimize code bloat.
 - **Animations**: Animations bring our interface to life. We use animation both to add delight and energy to an interface, and to hint at functionality and inform the user's mental model of how an interface functions.

 Neue was built for our internal needs at DoSomething.org, but it could also work for your organization. Feel free to fork this repository and use it as a starting point for your own website and style guide.

# Usage
The latest version of the styleguide is always available online at [styleguide.dosomething.org](http://styleguide.dosomething.org/).

You can also run the styleguide on your local machine! Here's the steps:

  1. Clone this repository.
  2. Run `bundle install` and `npm install` to configure dependencies.
  3. Run `grunt` to build CSS and JS from source (and watch for changes).
  3. Run `rackup` to start the server (or just link to Pow).
  4. Check it out in your browser!

# Code Guidelines
Check out the code guidelines for [CSS/SCSS](CSS Code Guidelines) and [JavaScript](JavaScript Code Guidelines). We use [JSHint](http://www.jshint.com/) to keep our JavaScript neat and tidy.

# License
&copy;2013 DoSomething.org. Neue is free software, and may be redistributed under the terms specified in the LICENSE file. The name and logo for DoSomething.org are trademarks of Do Something, Inc and may not be used without permission.