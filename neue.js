(function () {/**
 * @license almond 0.2.9 Copyright (c) 2011-2014, The Dojo Foundation All Rights Reserved.
 * Available via the MIT or new BSD license.
 * see: http://github.com/jrburke/almond for details
 */
//Going sloppy to avoid 'use strict' string cost, but strict practices should
//be followed.
/*jslint sloppy: true */
/*global setTimeout: false */

var requirejs, require, define;
(function (undef) {
    var main, req, makeMap, handlers,
        defined = {},
        waiting = {},
        config = {},
        defining = {},
        hasOwn = Object.prototype.hasOwnProperty,
        aps = [].slice,
        jsSuffixRegExp = /\.js$/;

    function hasProp(obj, prop) {
        return hasOwn.call(obj, prop);
    }

    /**
     * Given a relative module name, like ./something, normalize it to
     * a real name that can be mapped to a path.
     * @param {String} name the relative name
     * @param {String} baseName a real name that the name arg is relative
     * to.
     * @returns {String} normalized name
     */
    function normalize(name, baseName) {
        var nameParts, nameSegment, mapValue, foundMap, lastIndex,
            foundI, foundStarMap, starI, i, j, part,
            baseParts = baseName && baseName.split("/"),
            map = config.map,
            starMap = (map && map['*']) || {};

        //Adjust any relative paths.
        if (name && name.charAt(0) === ".") {
            //If have a base name, try to normalize against it,
            //otherwise, assume it is a top-level require that will
            //be relative to baseUrl in the end.
            if (baseName) {
                //Convert baseName to array, and lop off the last part,
                //so that . matches that "directory" and not name of the baseName's
                //module. For instance, baseName of "one/two/three", maps to
                //"one/two/three.js", but we want the directory, "one/two" for
                //this normalization.
                baseParts = baseParts.slice(0, baseParts.length - 1);
                name = name.split('/');
                lastIndex = name.length - 1;

                // Node .js allowance:
                if (config.nodeIdCompat && jsSuffixRegExp.test(name[lastIndex])) {
                    name[lastIndex] = name[lastIndex].replace(jsSuffixRegExp, '');
                }

                name = baseParts.concat(name);

                //start trimDots
                for (i = 0; i < name.length; i += 1) {
                    part = name[i];
                    if (part === ".") {
                        name.splice(i, 1);
                        i -= 1;
                    } else if (part === "..") {
                        if (i === 1 && (name[2] === '..' || name[0] === '..')) {
                            //End of the line. Keep at least one non-dot
                            //path segment at the front so it can be mapped
                            //correctly to disk. Otherwise, there is likely
                            //no path mapping for a path starting with '..'.
                            //This can still fail, but catches the most reasonable
                            //uses of ..
                            break;
                        } else if (i > 0) {
                            name.splice(i - 1, 2);
                            i -= 2;
                        }
                    }
                }
                //end trimDots

                name = name.join("/");
            } else if (name.indexOf('./') === 0) {
                // No baseName, so this is ID is resolved relative
                // to baseUrl, pull off the leading dot.
                name = name.substring(2);
            }
        }

        //Apply map config if available.
        if ((baseParts || starMap) && map) {
            nameParts = name.split('/');

            for (i = nameParts.length; i > 0; i -= 1) {
                nameSegment = nameParts.slice(0, i).join("/");

                if (baseParts) {
                    //Find the longest baseName segment match in the config.
                    //So, do joins on the biggest to smallest lengths of baseParts.
                    for (j = baseParts.length; j > 0; j -= 1) {
                        mapValue = map[baseParts.slice(0, j).join('/')];

                        //baseName segment has  config, find if it has one for
                        //this name.
                        if (mapValue) {
                            mapValue = mapValue[nameSegment];
                            if (mapValue) {
                                //Match, update name to the new value.
                                foundMap = mapValue;
                                foundI = i;
                                break;
                            }
                        }
                    }
                }

                if (foundMap) {
                    break;
                }

                //Check for a star map match, but just hold on to it,
                //if there is a shorter segment match later in a matching
                //config, then favor over this star map.
                if (!foundStarMap && starMap && starMap[nameSegment]) {
                    foundStarMap = starMap[nameSegment];
                    starI = i;
                }
            }

            if (!foundMap && foundStarMap) {
                foundMap = foundStarMap;
                foundI = starI;
            }

            if (foundMap) {
                nameParts.splice(0, foundI, foundMap);
                name = nameParts.join('/');
            }
        }

        return name;
    }

    function makeRequire(relName, forceSync) {
        return function () {
            //A version of a require function that passes a moduleName
            //value for items that may need to
            //look up paths relative to the moduleName
            return req.apply(undef, aps.call(arguments, 0).concat([relName, forceSync]));
        };
    }

    function makeNormalize(relName) {
        return function (name) {
            return normalize(name, relName);
        };
    }

    function makeLoad(depName) {
        return function (value) {
            defined[depName] = value;
        };
    }

    function callDep(name) {
        if (hasProp(waiting, name)) {
            var args = waiting[name];
            delete waiting[name];
            defining[name] = true;
            main.apply(undef, args);
        }

        if (!hasProp(defined, name) && !hasProp(defining, name)) {
            throw new Error('No ' + name);
        }
        return defined[name];
    }

    //Turns a plugin!resource to [plugin, resource]
    //with the plugin being undefined if the name
    //did not have a plugin prefix.
    function splitPrefix(name) {
        var prefix,
            index = name ? name.indexOf('!') : -1;
        if (index > -1) {
            prefix = name.substring(0, index);
            name = name.substring(index + 1, name.length);
        }
        return [prefix, name];
    }

    /**
     * Makes a name map, normalizing the name, and using a plugin
     * for normalization if necessary. Grabs a ref to plugin
     * too, as an optimization.
     */
    makeMap = function (name, relName) {
        var plugin,
            parts = splitPrefix(name),
            prefix = parts[0];

        name = parts[1];

        if (prefix) {
            prefix = normalize(prefix, relName);
            plugin = callDep(prefix);
        }

        //Normalize according
        if (prefix) {
            if (plugin && plugin.normalize) {
                name = plugin.normalize(name, makeNormalize(relName));
            } else {
                name = normalize(name, relName);
            }
        } else {
            name = normalize(name, relName);
            parts = splitPrefix(name);
            prefix = parts[0];
            name = parts[1];
            if (prefix) {
                plugin = callDep(prefix);
            }
        }

        //Using ridiculous property names for space reasons
        return {
            f: prefix ? prefix + '!' + name : name, //fullName
            n: name,
            pr: prefix,
            p: plugin
        };
    };

    function makeConfig(name) {
        return function () {
            return (config && config.config && config.config[name]) || {};
        };
    }

    handlers = {
        require: function (name) {
            return makeRequire(name);
        },
        exports: function (name) {
            var e = defined[name];
            if (typeof e !== 'undefined') {
                return e;
            } else {
                return (defined[name] = {});
            }
        },
        module: function (name) {
            return {
                id: name,
                uri: '',
                exports: defined[name],
                config: makeConfig(name)
            };
        }
    };

    main = function (name, deps, callback, relName) {
        var cjsModule, depName, ret, map, i,
            args = [],
            callbackType = typeof callback,
            usingExports;

        //Use name if no relName
        relName = relName || name;

        //Call the callback to define the module, if necessary.
        if (callbackType === 'undefined' || callbackType === 'function') {
            //Pull out the defined dependencies and pass the ordered
            //values to the callback.
            //Default to [require, exports, module] if no deps
            deps = !deps.length && callback.length ? ['require', 'exports', 'module'] : deps;
            for (i = 0; i < deps.length; i += 1) {
                map = makeMap(deps[i], relName);
                depName = map.f;

                //Fast path CommonJS standard dependencies.
                if (depName === "require") {
                    args[i] = handlers.require(name);
                } else if (depName === "exports") {
                    //CommonJS module spec 1.1
                    args[i] = handlers.exports(name);
                    usingExports = true;
                } else if (depName === "module") {
                    //CommonJS module spec 1.1
                    cjsModule = args[i] = handlers.module(name);
                } else if (hasProp(defined, depName) ||
                           hasProp(waiting, depName) ||
                           hasProp(defining, depName)) {
                    args[i] = callDep(depName);
                } else if (map.p) {
                    map.p.load(map.n, makeRequire(relName, true), makeLoad(depName), {});
                    args[i] = defined[depName];
                } else {
                    throw new Error(name + ' missing ' + depName);
                }
            }

            ret = callback ? callback.apply(defined[name], args) : undefined;

            if (name) {
                //If setting exports via "module" is in play,
                //favor that over return value and exports. After that,
                //favor a non-undefined return value over exports use.
                if (cjsModule && cjsModule.exports !== undef &&
                        cjsModule.exports !== defined[name]) {
                    defined[name] = cjsModule.exports;
                } else if (ret !== undef || !usingExports) {
                    //Use the return value from the function.
                    defined[name] = ret;
                }
            }
        } else if (name) {
            //May just be an object definition for the module. Only
            //worry about defining if have a module name.
            defined[name] = callback;
        }
    };

    requirejs = require = req = function (deps, callback, relName, forceSync, alt) {
        if (typeof deps === "string") {
            if (handlers[deps]) {
                //callback in this case is really relName
                return handlers[deps](callback);
            }
            //Just return the module wanted. In this scenario, the
            //deps arg is the module name, and second arg (if passed)
            //is just the relName.
            //Normalize module name, if it contains . or ..
            return callDep(makeMap(deps, callback).f);
        } else if (!deps.splice) {
            //deps is a config object, not an array.
            config = deps;
            if (config.deps) {
                req(config.deps, config.callback);
            }
            if (!callback) {
                return;
            }

            if (callback.splice) {
                //callback is an array, which means it is a dependency list.
                //Adjust args if there are dependencies
                deps = callback;
                callback = relName;
                relName = null;
            } else {
                deps = undef;
            }
        }

        //Support require(['a'])
        callback = callback || function () {};

        //If relName is a function, it is an errback handler,
        //so remove it.
        if (typeof relName === 'function') {
            relName = forceSync;
            forceSync = alt;
        }

        //Simulate async callback;
        if (forceSync) {
            main(undef, deps, callback, relName);
        } else {
            //Using a non-zero value because of concern for what old browsers
            //do, and latest browsers "upgrade" to 4 if lower value is used:
            //http://www.whatwg.org/specs/web-apps/current-work/multipage/timers.html#dom-windowtimers-settimeout:
            //If want a value immediately, use require('id') instead -- something
            //that works in almond on the global level, but not guaranteed and
            //unlikely to work in other AMD implementations.
            setTimeout(function () {
                main(undef, deps, callback, relName);
            }, 4);
        }

        return req;
    };

    /**
     * Just drops the config on the floor, but returns req in case
     * the config return value is used.
     */
    req.config = function (cfg) {
        return req(cfg);
    };

    /**
     * Expose module registry for debugging and tooling
     */
    requirejs._defined = defined;

    define = function (name, deps, callback) {

        //This module may not have dependencies
        if (!deps.splice) {
            //deps is not an array, so probably means
            //an object literal or factory function for
            //the value. Adjust args.
            callback = deps;
            deps = [];
        }

        if (!hasProp(defined, name) && !hasProp(waiting, name)) {
            waiting[name] = [name, deps, callback];
        }
    };

    define.amd = {
        jQuery: true
    };
}());

define("bower_components/almond/almond", function(){});

/**
 * # Image Carousel
 *
 * Adds simple "previous/next" functionality to slide deck-style image
 * galleries with the following markup:
 *
 * @example
 * //  <div class="js-carousel gallery">
 * //    <div id="prev" class="prev-wrapper">
 * //      <div class="prev-button"><span class="arrow">&#xe605;</span></div>
 * //    </div>
 * //
 * //    <div class="carousel-wrapper">
 * //      <figure id="slide0" class="slide"><img src="./img/example_img0.jpg" /></figure>
 * //      <figure id="slide1" class="slide"><img src="./img/example_img1.jpg" /></figure>
 * //      <figure id="slide2" class="slide"><img src="./img/example_img2.jpg" /></figure>
 * //      <figure id="slide3" class="slide"><img src="./img/example_img3.jpg" /></figure>
 * //    </div>
 * //
 * //    <div id="next" class="next-wrapper">
 * //      <div class="next-button"><span class="arrow">&#xe60a;</span></div>
 * //    </div>
 * //  </div>
 *
 */

define('neue/carousel',[],function() {
  

  var $ = window.jQuery;

  $(function() {
    // Show first image
    $("#slide0").addClass("visible");

    // Make carousel stateful
    var counter = 0;

    // Cache carousel buttons
    var $buttons = $("#prev, #next");

    // Decrement counter
    function decrementCounter() {
      // If first slide is shown, restart loop
      // Else, show previous slide
      counter === 0 ? counter = 2 : counter--;
    }

    // Increment counter
    function incrementCounter() {
      // If last slide is shown, restart loop
      // Else, show next slide
      counter === 2 ? counter = 0 : counter++;
    }

    // Toggle slide visibility
    function showCurrentSlide( direction ) {
      // Remove "visibile" class from the current slide
      $("#slide" + counter).removeClass("visible");

      // Increment or decrement slide position based on user"s request
      direction === "prev" ? decrementCounter() : incrementCounter();

      // Assign "visible" class to the requested slide
      $("#slide" + counter).addClass("visible");
    }

    // Bind click event to carousel buttons
    $buttons.click(function() {
      showCurrentSlide( $(this).attr("id") );
    });
  });
});

/**
 * @module neue/events
 * Pub/Sub events: Allows modules to communicate via publishing
 * and subscribing to events.
 *
 * Based on Addy Osmani's Pubsubz, licensed under the GPL.
 * https://github.com/addyosmani/pubsubz
 * http://jsfiddle.net/LxPrq/
 */

define('neue/events',[],function() {
  

  var topics = {};
  var subUid = -1;

  var publish = function(topic, args) {
    if (!topics[topic]) {
      return false;
    }

    setTimeout(function() {
      var subscribers = topics[topic],
      len = subscribers ? subscribers.length : 0;

      while(len--) {
        subscribers[len].func(topic, args);
      }
    }, 0);

    return true;
  };

  var subscribe = function(topic, func) {
    if (!topics[topic]) {
      topics[topic] = [];
    }

    var token = (++subUid).toString();
    topics[topic].push({
      token: token,
      func: func
    });

    return token;
  };

  var unsubscribe = function(token) {
    for (var m in topics) {
      if (topics[m]) {
        for (var i = 0, j = topics[m].length; i < j; i++) {
          if (topics[m][i].token === token) {
            topics[m].splice(i, 1);
            return token;
          }
        }
      }
    }

    return false;
  };

  // Export public API
  return {
    publish: publish,
    subscribe: subscribe,
    unsubscribe: unsubscribe
  };
});

/**
 * Applies a smooth-scroll animation on links with the `.js-jump-scroll` class.
 */

define('neue/jump-scroll',[],function() {
  

  var $ = window.jQuery;

  $(function() {
    $(".js-jump-scroll").on("click", function(event) {
      event.preventDefault();

      var href = $(this).attr("href");

      // Animate scroll position to the target of the link:
      $("html,body").animate({scrollTop: $(event.target.hash).offset().top}, "slow", function() {
        // Finally, set the correct hash in the address bar.
        window.location.hash = href;
      });
    });
  });
});

/**
 * Initializes site-wide menu chrome functionality.
 */

define('neue/menu',[],function() {
  

  var $ = window.jQuery;

  $(function() {
    // Toggle dropdown menu navigation on mobile:
    $(".js-toggle-mobile-menu").on("click", function() {
      $(".chrome--nav").toggleClass("is-visible");
    });

    // Hide footer on mobile until clicked
    $(".js-footer-col").addClass("is-collapsed");
    $(".js-footer-col h4").on("click", function() {
      if( window.matchMedia("screen and (max-width: 768px)").matches ) {
        $(this).closest(".js-footer-col").toggleClass("is-collapsed");
      }
    });
  });
});

/**
 * @module neue/messages
 * System Messages. Will create a close ("X") button
 * for users with JavaScript enabled that uses the following
 * syntax to hook into this function:
 *
 * @example
 * //  <div class="js-message">Alert! You win.</div>
 *
 * @returns
 * // <div class="js-message">Alert! You win.
 * //   <a href="#" class="js-close-message">x</a>
 * // </div>
 */

define('neue/messages',[],function() {
  

  var $ = window.jQuery;

  var messageClose = "<a href=\"#\" class=\"js-close-message message-close-button white\">×</a>";

  /**
  * Adds a close button to system message banner, with optional callback.
  *
  * @param {jQuery}   $messages  Object containing message divs to be modified.
  * @param {function} callback   Callback fired after message is closed.
  */
  var attachCloseButton = function($messages, callback) {
    // Create message close button
    $messages.append(messageClose);

    // Close message when "x" is clicked:
    $messages.on("click", ".js-close-message", function(event) {
      event.preventDefault();
      $(this).parent(".messages").slideUp();

      if(callback && typeof callback === "function") {
        callback();
      }
    });
  };

  // Prepare any messages in the DOM on load
  $(function() {
    attachCloseButton( $(".messages") );
  });

  return {
    attachCloseButton: attachCloseButton
  };
});

/**
 * @module neue/modal
 * Show/hide modals. Link should have `.js-modal-link` class, and
 * it's `href` should point to the hash of the modal. By convention, the
 * modal ID should be prefixed with `modal--` like so:
 *
 * @example
 * // <script type="text/cached-modal" id="modal--login">
 * //   <!-- content -->
 * // </script>
 *
 */

define('neue/modal',['require','./events'],function(require) {
  

  var $ = window.jQuery;
  var Modernizr = window.Modernizr;
  var Events = require("./events");

  // We can only have one modal open at a time; we track that here.
  var modalIsOpen = false;

  // The modal container (including background overlay).
  var $modal = null;

  // The content of the modal.
  var $modalContent = null;

  // Reference to current modal source
  var $reference = null;

  // Whether this modal can be closed by the user
  var closeable = false;

  // Return a boolean if modal is open or not
  var isOpen = function() {
    return modalIsOpen;
  };

  // Click handler for opening a new modal
  var _openHandler = function(event) {
    event.preventDefault();
    var href = "";

    if( $(this).data("cached-modal") ) {
      // Preferred method: We load the modal specified in the `data-cached-modal` attribute.
      // This allows `href` to act as a backup if JS is disabled. For example,
      // `<a class="js-modal-link" data-cached-modal="#modal--faq" href="faq.html">Click</a>`
      // would open a modal with the contents of `<div id="modal--faq"></div>`.
      href = $($(this).data("cached-modal"));
    } else if ( event.target.hash.charAt(0) === "#"  ) {
      // We find the modal based on the ID in the link"s `href`. For example,
      // `<a class="js-modal-link" href="#modal--faq">Click me</a>` would open
      // `<div id="modal--faq"></div>`.
      href = $(event.target.hash);
    } else {
      // @TODO: We should handle AJAX loading things in.
    }

    open(href);
  };

  /**
   * Open a new modal
   * @param {jQuery}  $el                 Element that will be placed inside the modal.
   * @param {boolean} [options.animated=true]     Use animation for opening the modal.
   * @param {boolean} [options.closeButton]       Override `data-modal-close` attribute.
   * @param {boolean} [options.skipForm]          Override `data-modal-skip-form` attribute.
   */
  var open = function($el, options) {
    // Default arguments
    options = options || {};
    options.animated = typeof options.animated !== "undefined" ? options.animated : true;
    options.closeButton = typeof options.closeButton !== "undefined" ? options.closeButton : $el.attr("data-modal-close");
    options.skipForm = typeof options.skipForm !== "undefined" ? options.skipForm : $el.attr("data-modal-skip-form");

    var id = $el.attr("id");
    if(id) {
      // Save ID of modal for future reference
      $reference = "#" + id;

      // Set URL hash in the browser
      window.location.hash = "#" + id;
    } else {
      $reference = "";
    }

    // If Google Analytics is set up, we fire an event to track that a
    // modal has been opened.
    if(typeof(_gaq) !== "undefined" && _gaq !== null) {
      _gaq.push(["_trackEvent", "Modal", "Open", $reference, null, true]);
    }

    if( !modalIsOpen ) {
      // create modal in DOM
      $modal = $("<div class=\"modal\"></div>");
      $modalContent = $("<div></div>");
      $modal.append($modalContent);
      $modalContent.html( $el.html() );

      // set up overlay and show modal
      $("body").addClass("modal-open");
      $("body").append($modal);

      if(options.animated && Modernizr.cssanimations) {
        $modal.addClass("fade-in");
        $modalContent.addClass("fade-in-up");
      }

      // copy classes from modal source
      $modalContent.removeClass();
      $modalContent.addClass("modal-content");
      $modalContent.addClass( $el.attr("class") );

      $modal.show();

      // Bind events to close Modal
      $modal.on("click", ".js-close-modal", _closeHandler);
      $modal.on("click", _closeHandler);

      modalIsOpen = true;

      //  **This fixes an issue with `position:fixed` and the virtual keyboard
      //  on Mobile Safari.** Since this is a browser bug, we're forced to use
      //  browser-detection here, and should look into removing this as soon
      //  as this is fixed in the future. Yes, it is gross.
      if(  /iPhone|iPad|iPod/i.test(window.navigator.userAgent) ) {
        setTimeout(function () {
          $modal.css({ "position": "absolute", "overflow": "visible", "height": $(document).height() + "px" });
          $modalContent.css({ "margin-top": $(document).scrollTop() + "px" });
        }, 0);
      }
    } else {
      // modal is already open, so just replace current content
      $modalContent.removeClass();
      $modalContent.addClass("modal-content");
      $modalContent.addClass( $el.attr("class") );
      $modalContent.html( $($el).html() );
    }

    // We add a "close" button programmatically
    // @param [data-modal-close=true]
    switch (options.closeButton) {
      case "skip":
        // Add a skip button, which delegates to the submitting the form with the given ID
        var $skipForm = $( options.skipForm );
        var $skipLink = $("<a href='#' class='js-close-modal modal-close-button -alt'>skip</a>");
        $modalContent.prepend( $skipLink );
        $skipLink.on("click", function(event) {
          event.preventDefault();
          $skipForm.submit();
        });
        closeable = false; // cannot close modal by clicking background
        break;

      case "yes":
      case "true":
      case "1":
        $modalContent.prepend("<a href='#' class='js-close-modal modal-close-button'>&#215;</a>");
        closeable = true;
        break;
      default:
        closeable = false;
    }

    var closeClass = $el.attr("data-modal-close-class");
    if(closeClass) {
      $modalContent.find(".js-close-modal").addClass(closeClass);
    }

    // We provide an event that other modules can hook into to perform custom functionality when
    // a modal opens (such as preparing things that are added to the DOM, etc.)
    Events.publish("Modal:opened", $modalContent);

    // If Drupal has some messages on the screen, move them inside the modal
    // @TODO: We need a better solution for this.
    var $messages = $(".messages");
    var $messagesClone = $modalContent.find(".js-messages-clone");
    if($messagesClone && $messages.length ) {
      $messagesClone.addClass("modal-messages");
      $messagesClone.html( $messages[0].outerHTML );
      $messagesClone.find(".js-close-message").remove();
    }
  };

  var _closeHandler = function(event) {
    // Don't let the event bubble.
    if(event.target !== this) {
      return;
    }

    // Only close on clicking overlay if this modal has a "x" close button
    if( $(this).hasClass("js-close-modal") || closeable ) {
      // Override default link behavior.
      event.preventDefault();
      close();
    }
  };

  /**
   * Close the active modal.
   * @param {boolean} [animated=true] Use animation for closing the modal.
   */
  var close = function(animated) {
    // Default arguments
    animated = typeof animated !== "undefined" ? animated : true;

    // Remove URL hash for modal from browser
    if(window.location.hash === $reference) {
      window.location.hash = "/";
    }

    // If Google Analytics is set up, we fire an event to track that a
    // modal has been closed.
    if(typeof(_gaq) !== "undefined" && _gaq !== null) {
      _gaq.push(["_trackEvent", "Modal", "Close", $reference, null, true]);
    }

    if(animated && Modernizr.cssanimations) {
      $modalContent.addClass("fade-out-down");
      $modal.addClass("fade-out");

      $("body").removeClass("modal-open");

      $modal.one("webkitAnimationEnd oanimationend msAnimationEnd animationend", function() {
        $modal.remove();
        modalIsOpen = false;
      });
    } else {
      $("body").removeClass("modal-open");
      $modal.remove();
      modalIsOpen = false;
    }
  };

  $(document).ready(function() {
    // Attach modal handler to `.js-modal-link` elements on click
    $("body").on("click", ".js-modal-link", _openHandler);

    //If there's a hash in the URL, let's check if its a modal and load it
    var hash = window.location.hash;
    if(hash && hash !== "#/" && $(hash) && $(hash).attr("type") === "text/cached-modal" ) {
      open($(hash), false);
    }

    // Close modal events are bound on modal initialization.
  });


  // Return public API for controlling modals
  return {
    isOpen: isOpen,
    open: open,
    close: close
  };

});

/**
 * Indicates current section in nav on scroll. Applies an `.is-active`
 * class when the specified `href` reaches the top of the viewport.
 *
 * Triggered by a `.js-scroll-indicator` on a link.
 */

define('neue/scroll-indicator',[],function() {
  

  var $ = window.jQuery;

  var links = [];

  // Prepare all `.js-scroll-indicator` links on the page.
  function preparePage() {
    links = [];

    $(".js-scroll-indicator").each(function(index, link) {
      prepareIndicator(link);
    });
  }

  // Registers links and their targets with scroll handler
  function prepareIndicator(link) {
    // Calculate the element's offset from the top of the page while anchored
    var linkTarget = $(link).attr("href");
    var linkTargetOffset = $(linkTarget).offset().top;

    // Create the data structure that we'll store this stuff in
    var linkObj = {
      $el: $(link),
      targetOffset: linkTargetOffset
    };

    // Add jQuery object and offset value to links array
    links.push(linkObj);

    // Now that we're ready, let's calculate how stickies should be displayed
    updateScrollIndicators();
  }

  // Scroll handler: highlights the furthest link the user has passed
  function updateScrollIndicators() {
    $.each(links, function(index, link) {
      // In reverse order (moving up the nav from the bottom), check whether
      // we've scrolled past the link's target. If so, set active and stop.
      var windowOffset = $(window).scrollTop() + link.$el.height();
      if (windowOffset > link.targetOffset) {
        $(".js-scroll-indicator").removeClass("is-active");
        link.$el.addClass("is-active");
        return;
      }
    });
  }

  // Attach our functions to their respective events.
  $(function() {
    preparePage();

    $(window).on("scroll", updateScrollIndicators);
    $(window).on("resize", preparePage);
  });

});

/**
 * Pins an element to the top of the screen on scroll.
 *
 * Requires pinned element to have `.js-sticky` class, and have
 * a `.is-stuck` modifier class in its CSS (which allows
 * customized sticky behavior based on media queries).
 *
 * @example
 * // .sidebar {
 * //   &.is-stuck {
 * //     position: fixed;
 * //     top: 0;
 * //   }
 * // }
 *
 */

define('neue/sticky',[],function() {
  

  var $ = window.jQuery;

  var divs = [];

  // Prepare all `.js-sticky` divs on the page.
  function preparePage() {
    divs = [];

    $(".js-sticky").each(function(index, div) {
      prepareSticky(div);
    });
  }

  // Prepare markup and register divs with scroll handler
  function prepareSticky(div) {
    // Calculate the element's offset from the top of the page while anchored
    var divOffset = $(div).offset().top;

    // Create the data structure that we'll store this stuff in
    var divObj = {
      $el: $(div),
      offset: divOffset
    };

    // Add jQuery object and offset value to divs array
    divs.push(divObj);

    // Now that we're ready, let's calculate how stickies should be displayed
    scrollSticky();
  }

  // Scroll handler: pins/unpins divs on scroll event
  function scrollSticky() {
    $.each(divs, function(index, div) {
      // Compare the distance to the top of the page with the distance scrolled.
      // For each div: if we've scrolled past it's offset, pin it to top.
      if ($(window).scrollTop() > div.offset) {
        div.$el.addClass("is-stuck");
      } else {
        div.$el.removeClass("is-stuck");
      }
    });
  }

  // Attach our functions to their respective events.
  $(function() {
    preparePage();

    $(window).on("scroll", scrollSticky);
    $(window).on("resize", preparePage);
  });
});

/**
 * Client-side form validation logic. Form element is validated based
 * on `data-validate` attribute, and validation output is placed in
 * corresponding `<label>`.
 *
 * Validations can be added later by extending `NEUE.Validation.Validations`.
 * Validators can be added later by extending `NEUE.Validation.Validators`.
 *
 * finished validating with a boolean `success` and a plain-text `message`
 * value. (Alternatively, a `suggestion` value can be passed which will
 * prompt the user "Did you mean {suggestion}?".
 *
 * ## Usage Notes:
 * - Input field must have `data-validate` attribute.
 * - If adding input fields to the DOM after load, run `prepareFields`
 */

define('neue/validation',['require','./events'],function(require) {
  

  var $ = window.jQuery;
  var Events = require("./events");

  var validations = [];

  /**
   * Prepares form label DOM to display validation messages & register event handler
   * @param {jQuery} $fields Fields to register validation handlers to.
   */
  var prepareFields = function($fields) {
    $fields.each(function() {
      var $field = $(this);

      prepareLabel( $("label[for='" + $field.attr("id") + "']") );

      $field.on("blur", function(event) {
        event.preventDefault();
        validateField( $field );
      });
    });
  };

  /**
   * Prepare field label DOM to display validation messages.
   * @param {jQuery} $label Label element to prepare.
   */
  var prepareLabel = function($label) {
    // Check to make sure we haven't already prepared this before
    if($label.find(".inner-label").length === 0) {
      var $innerLabel = $("<div class='inner-label'></div>");
      $innerLabel.append("<div class='label'>" + $label.html() + "</div>");
      $innerLabel.append("<div class='message'></div>");

      $label.html($innerLabel);
    }
  };

  /**
   * Trigger a validation on a form element.
   * @param {jQuery}   $field                            Form element to be validated.
   * @param {jQuery}   [force = false]                   Force validation (even on empty fields).
   * @param {function} [callback=showValidationMessage]  Callback function that receives validation result
   */
  var validateField = function($field, force, callback) {
    // Default arguments
    force = typeof force !== "undefined" ? force : false;
    callback = typeof callback !== "undefined" ? callback : function($field, result) {
      showValidationMessage($field, result);
    };

    var validation = $field.data("validate");

    // Don't validate if validation doesn't exist
    if(!validations[validation]) {
      console.error("A validation with the name "+ validation + " has not been registered.");
      return;
    }

    // For <input>, <select>, and <textarea> tags we provide
    // the field's value as a string
    if( isFormField($field) ) {
      // Get field info
      var fieldValue = $field.val();

      // Finally, let's not validate blank fields unless forced to
      if(force || $field.val() !== "") {
        validations[validation].fn(fieldValue, function(result) {
          callback($field, result);
        });
      }
    } else {
      // For all other tags, we pass the element directly
      validations[validation].fn($field, function(result) {
        callback($field, result);
      });
    }
  };

  /**
   * Register a new validation.
   *
   * @param {String}    name              The name function will be referenced by in `data-validate` attribute.
   * @param {Object}    validation        Collection of validation rules to apply
   * @param {Function}  [validation.fn]   Custom validation
   */
  var registerValidation = function(name, validation) {
    if(validations[name]) {
      throw "A validation function with that name has already been registered";
    }

    validations[name] = validation;
  };

  /**
   * @DEPRECATED: Will be removed in a future version in favor of `registerValidation`.
   */
  var registerValidationFunction = function(name, func) {
    var v = {
      fn: func
    };

    registerValidation(name, v);
  };

  /**
   * Show validation message in markup.
   *
   * @param {jQuery} $field              Field to display validation message for.
   * @param {Object} result              Object containing `success` and either `message` or `suggestion`
   */
  var showValidationMessage = function($field, result) {
    var $fieldLabel = $("label[for='" + $field.attr("id") + "']");
    var $fieldMessage = $fieldLabel.find(".message");

    $field.removeClass("success error warning shake");
    $fieldMessage.removeClass("success error warning");

    // Highlight/animate field
    if(result.success === true) {
      $field.addClass("success");
      $fieldMessage.addClass("success");
    } else {
      $field.addClass("error");
      $fieldMessage.addClass("error");

      if( isFormField($field) ) {
        $field.addClass("shake");
      }

      Events.publish("Validation:InlineError", $fieldLabel.attr("for"));
    }

    // Show validation message
    if(result.message) {
      $fieldMessage.text(result.message);
    }

    if(result.suggestion) {
      $fieldMessage.html("Did you mean " + result.suggestion.full + "? <a href='#' data-suggestion='" + result.suggestion.full + "'class='js-mailcheck-fix'>Fix it!</a>");
      Events.publish("Validation:Suggestion", result.suggestion.domain);
    }

    $fieldLabel.addClass("show-message");

    $(".js-mailcheck-fix").on("click", function(e) {
      e.preventDefault();

      var $field = $("#" + $(this).closest("label").attr("for"));
      $field.val($(this).data("suggestion"));
      $field.trigger("blur");

      // If Google Analytics is set up, we fire an event to
      // mark that a suggestion has been made
      Events.publish("Validation:SuggestionUsed", $(this).text() );
    });

    $field.on("focus", function() {
      $field.removeClass("warning error success shake");
      $fieldLabel.removeClass("show-message");
    });

    return result.success;
  };


  /**
   * Disable form submission.
   * @param {jQuery} $form Form to disable submission for.
   */
  var disableFormSubmit = function($form) {
    // Prevent double-submissions
    var $submitButton = $form.find(":submit");

    // Disable that guy
    $submitButton.attr("disabled", true);

    // If <button>, add a loading style
    if($submitButton.prop("tagName") === "BUTTON") {
      // Neue's `.loading` class only works on <a> or <button> :(
      $submitButton.addClass("loading");
    }
  };


  /**
   * Re-enable form submission.
   * @param {jQuery} $form Form to enable submission for.
   */
  var enableFormSubmit = function($form) {
    var $submitButton = $form.find(":submit");
    $submitButton.attr("disabled", false);
    $submitButton.removeClass("loading disabled");
  };

  /**
   * Returns whether element is <input>, <select>, or <textarea>.
   * @param {jQuery} $el  Element to check type of.
   * @return {boolean}
   */
  var isFormField = function($el) {
    var tag = $el.prop("tagName");
    return ( tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" );
  };

  /**
   * Validate form on submit.
   */
  $("body").on("submit", "form", function(event, isValidated) {
    var $form = $(this);
    disableFormSubmit($form);

    if(isValidated === true) {
      // completed a previous runthrough & validated;
      // we're ready to submit the form
      return true;
    } else {
      event.preventDefault();

      var $validationFields = $form.find("[data-validate]").filter("[data-validate-required]");
      var validatedFields = 0;
      var validatedResults = 0;

      $validationFields.each(function() {
        validateField($(this), true, function($field, result) {
          validatedFields++;
          showValidationMessage($field, result);

          if(result.success) {
            validatedResults++;
          }

          // Once we're done validating all fields, check status of form
          if(validatedFields === $validationFields.length) {
            if(validatedResults === $validationFields.length) {
              // we've validated all that can be validated
              Events.publish("Validation:Submitted", $(this).attr("id") );
              $form.trigger("submit", true);
            } else {
              Events.publish("Validation:SubmitError", $(this).attr("id") );
              enableFormSubmit($form);
            }
          }
        });
      });

      if($validationFields.length === 0) {
        // if there are no fields to be validated, submit!
        $form.trigger("submit", true);
      }

      return false; // don't submit form, wait for callback with `true` parameter
    }
  });

  // Register the "match" validation.
  registerValidationFunction("match", function(string, secondString, done) {
    if(string === secondString && string !== "") {
      return done({
        success: true,
        message: "Looks good!"
      });
    } else {
      return done({
        success: false,
        message: "That doesn't match."
      });
    }
  });

  $(function() {
    // Prepare the labels on any `[data-validate]` fields in the DOM at load
    prepareFields( $("body").find("[data-validate]") );

    Events.subscribe("Modal:opened", function(topic, args) {
      prepareFields(args.find("[data-validate]"));
    });
  });

  return {
    prepareFields: prepareFields,
    registerValidation: registerValidation,
    registerValidationFunction: registerValidationFunction,
    validateField: validateField,
    showValidationMessage: showValidationMessage,
    Validations: validations
  };
});

/**
 * Main build script. This will compile modules into `neue.js`
 * and `neue.min.js` in dist package, and attach each module to
 * a NEUE global variable attached to the window.
 */

define('neue/main',['require','./carousel','./events','./jump-scroll','./menu','./messages','./modal','./scroll-indicator','./sticky','./validation'],function(require) {
  

  // Attach modules to window
  window.NEUE = {
    Carousel: require("./carousel"),
    Events: require("./events"),
    JumpScroll: require("./jump-scroll"),
    Menu: require("./menu"),
    Messages: require("./messages"),
    Modal: require("./modal"),
    ScrollIndicator: require("./scroll-indicator"),
    Sticky: require("./sticky"),
    Validation: require("./validation")
  };

  return window.NEUE;
});


require(["neue/main"]);
}());