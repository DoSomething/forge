# JavaScript Code Guidelines
We have some code guidelines to make sure that everyone can work on the same project without the codebase becoming a mess. We also use [JSHint](http://www.jshint.com/) to keep our JavaScript neat and tidy. It runs as a Grunt task and will warn you of some common code style issues.


#### General Syntax
 - Use soft-tabs with a two space indent.
 - Place an empty newline at the end of the file.
 - Use `===` and `!==`. Never use `==` and `!=`.
 - Use double-quotes (ex: `"string"`) rather than single-quotes (ex: `'bad string'`).

#### Naming
 - Use `camelCase` when naming objects, functions, and instances.
 - Use `PascalCase` when naming constructors or classes.
 - Use a leading underscore `_` when naming private properties, for example: `var _privateProperty = 0;`
 - Prefix jQuery object variables with a $. For example, `var $sidebar = $(".sidebar");`.
 - When saving a reference to `this` use `_this`.
 - Always name your functions. This is helpful for stack traces. Ex: `var log = function log(msg) { };`

#### Objects, Arrays, & Variables
 - Use the literal syntax for object creation (ex: `var item = {};`)
 - Use the literal syntax for array creation (ex: `var items = [];`)
 - Always use var to declare variables. Not doing so will result in global variables, and global variables are bad. If defining a global variable for namespacing, explicitly attach it to the `window` object to make your intent clear.
 - Assign variables at the top of their scope. This helps avoid issues with variable declaration and assignment hoisting related issues.
  
#### Commenting
 - Use `//` for both single line comments and multi-line comments. (In rare cases with regular expressions, `/*  */` can be terminated early.)
 - Use `// FIXME: ` to annotate problems.
 - Use `// TODO: ` to annotate solutions to problems.

#### Modules
 - The file should be named with `camelCase` and match the name of the single export.
 - Always declare `"use strict";` at the top of the module.
 - See `_exampleModule.js` for a working example.
