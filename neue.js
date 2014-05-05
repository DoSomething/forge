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

/* Modernizr 2.7.1 (Custom Build) | MIT & BSD
 * Build: http://modernizr.com/download/#-rgba-cssanimations-cssgradients-geolocation-touch-cssclasses-teststyles-testprop-testallprops-prefixes-domprefixes-load
 */
;window.Modernizr=function(a,b,c){function z(a){j.cssText=a}function A(a,b){return z(m.join(a+";")+(b||""))}function B(a,b){return typeof a===b}function C(a,b){return!!~(""+a).indexOf(b)}function D(a,b){for(var d in a){var e=a[d];if(!C(e,"-")&&j[e]!==c)return b=="pfx"?e:!0}return!1}function E(a,b,d){for(var e in a){var f=b[a[e]];if(f!==c)return d===!1?a[e]:B(f,"function")?f.bind(d||b):f}return!1}function F(a,b,c){var d=a.charAt(0).toUpperCase()+a.slice(1),e=(a+" "+o.join(d+" ")+d).split(" ");return B(b,"string")||B(b,"undefined")?D(e,b):(e=(a+" "+p.join(d+" ")+d).split(" "),E(e,b,c))}var d="2.7.1",e={},f=!0,g=b.documentElement,h="modernizr",i=b.createElement(h),j=i.style,k,l={}.toString,m=" -webkit- -moz- -o- -ms- ".split(" "),n="Webkit Moz O ms",o=n.split(" "),p=n.toLowerCase().split(" "),q={},r={},s={},t=[],u=t.slice,v,w=function(a,c,d,e){var f,i,j,k,l=b.createElement("div"),m=b.body,n=m||b.createElement("body");if(parseInt(d,10))while(d--)j=b.createElement("div"),j.id=e?e[d]:h+(d+1),l.appendChild(j);return f=["&#173;",'<style id="s',h,'">',a,"</style>"].join(""),l.id=h,(m?l:n).innerHTML+=f,n.appendChild(l),m||(n.style.background="",n.style.overflow="hidden",k=g.style.overflow,g.style.overflow="hidden",g.appendChild(n)),i=c(l,a),m?l.parentNode.removeChild(l):(n.parentNode.removeChild(n),g.style.overflow=k),!!i},x={}.hasOwnProperty,y;!B(x,"undefined")&&!B(x.call,"undefined")?y=function(a,b){return x.call(a,b)}:y=function(a,b){return b in a&&B(a.constructor.prototype[b],"undefined")},Function.prototype.bind||(Function.prototype.bind=function(b){var c=this;if(typeof c!="function")throw new TypeError;var d=u.call(arguments,1),e=function(){if(this instanceof e){var a=function(){};a.prototype=c.prototype;var f=new a,g=c.apply(f,d.concat(u.call(arguments)));return Object(g)===g?g:f}return c.apply(b,d.concat(u.call(arguments)))};return e}),q.touch=function(){var c;return"ontouchstart"in a||a.DocumentTouch&&b instanceof DocumentTouch?c=!0:w(["@media (",m.join("touch-enabled),("),h,")","{#modernizr{top:9px;position:absolute}}"].join(""),function(a){c=a.offsetTop===9}),c},q.geolocation=function(){return"geolocation"in navigator},q.rgba=function(){return z("background-color:rgba(150,255,150,.5)"),C(j.backgroundColor,"rgba")},q.cssanimations=function(){return F("animationName")},q.cssgradients=function(){var a="background-image:",b="gradient(linear,left top,right bottom,from(#9f9),to(white));",c="linear-gradient(left top,#9f9, white);";return z((a+"-webkit- ".split(" ").join(b+a)+m.join(c+a)).slice(0,-a.length)),C(j.backgroundImage,"gradient")};for(var G in q)y(q,G)&&(v=G.toLowerCase(),e[v]=q[G](),t.push((e[v]?"":"no-")+v));return e.addTest=function(a,b){if(typeof a=="object")for(var d in a)y(a,d)&&e.addTest(d,a[d]);else{a=a.toLowerCase();if(e[a]!==c)return e;b=typeof b=="function"?b():b,typeof f!="undefined"&&f&&(g.className+=" "+(b?"":"no-")+a),e[a]=b}return e},z(""),i=k=null,e._version=d,e._prefixes=m,e._domPrefixes=p,e._cssomPrefixes=o,e.testProp=function(a){return D([a])},e.testAllProps=F,e.testStyles=w,g.className=g.className.replace(/(^|\s)no-js(\s|$)/,"$1$2")+(f?" js "+t.join(" "):""),e}(this,this.document),function(a,b,c){function d(a){return"[object Function]"==o.call(a)}function e(a){return"string"==typeof a}function f(){}function g(a){return!a||"loaded"==a||"complete"==a||"uninitialized"==a}function h(){var a=p.shift();q=1,a?a.t?m(function(){("c"==a.t?B.injectCss:B.injectJs)(a.s,0,a.a,a.x,a.e,1)},0):(a(),h()):q=0}function i(a,c,d,e,f,i,j){function k(b){if(!o&&g(l.readyState)&&(u.r=o=1,!q&&h(),l.onload=l.onreadystatechange=null,b)){"img"!=a&&m(function(){t.removeChild(l)},50);for(var d in y[c])y[c].hasOwnProperty(d)&&y[c][d].onload()}}var j=j||B.errorTimeout,l=b.createElement(a),o=0,r=0,u={t:d,s:c,e:f,a:i,x:j};1===y[c]&&(r=1,y[c]=[]),"object"==a?l.data=c:(l.src=c,l.type=a),l.width=l.height="0",l.onerror=l.onload=l.onreadystatechange=function(){k.call(this,r)},p.splice(e,0,u),"img"!=a&&(r||2===y[c]?(t.insertBefore(l,s?null:n),m(k,j)):y[c].push(l))}function j(a,b,c,d,f){return q=0,b=b||"j",e(a)?i("c"==b?v:u,a,b,this.i++,c,d,f):(p.splice(this.i++,0,a),1==p.length&&h()),this}function k(){var a=B;return a.loader={load:j,i:0},a}var l=b.documentElement,m=a.setTimeout,n=b.getElementsByTagName("script")[0],o={}.toString,p=[],q=0,r="MozAppearance"in l.style,s=r&&!!b.createRange().compareNode,t=s?l:n.parentNode,l=a.opera&&"[object Opera]"==o.call(a.opera),l=!!b.attachEvent&&!l,u=r?"object":l?"script":"img",v=l?"script":u,w=Array.isArray||function(a){return"[object Array]"==o.call(a)},x=[],y={},z={timeout:function(a,b){return b.length&&(a.timeout=b[0]),a}},A,B;B=function(a){function b(a){var a=a.split("!"),b=x.length,c=a.pop(),d=a.length,c={url:c,origUrl:c,prefixes:a},e,f,g;for(f=0;f<d;f++)g=a[f].split("="),(e=z[g.shift()])&&(c=e(c,g));for(f=0;f<b;f++)c=x[f](c);return c}function g(a,e,f,g,h){var i=b(a),j=i.autoCallback;i.url.split(".").pop().split("?").shift(),i.bypass||(e&&(e=d(e)?e:e[a]||e[g]||e[a.split("/").pop().split("?")[0]]),i.instead?i.instead(a,e,f,g,h):(y[i.url]?i.noexec=!0:y[i.url]=1,f.load(i.url,i.forceCSS||!i.forceJS&&"css"==i.url.split(".").pop().split("?").shift()?"c":c,i.noexec,i.attrs,i.timeout),(d(e)||d(j))&&f.load(function(){k(),e&&e(i.origUrl,h,g),j&&j(i.origUrl,h,g),y[i.url]=2})))}function h(a,b){function c(a,c){if(a){if(e(a))c||(j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}),g(a,j,b,0,h);else if(Object(a)===a)for(n in m=function(){var b=0,c;for(c in a)a.hasOwnProperty(c)&&b++;return b}(),a)a.hasOwnProperty(n)&&(!c&&!--m&&(d(j)?j=function(){var a=[].slice.call(arguments);k.apply(this,a),l()}:j[n]=function(a){return function(){var b=[].slice.call(arguments);a&&a.apply(this,b),l()}}(k[n])),g(a[n],j,b,n,h))}else!c&&l()}var h=!!a.test,i=a.load||a.both,j=a.callback||f,k=j,l=a.complete||f,m,n;c(h?a.yep:a.nope,!!i),i&&c(i)}var i,j,l=this.yepnope.loader;if(e(a))g(a,0,l,0);else if(w(a))for(i=0;i<a.length;i++)j=a[i],e(j)?g(j,0,l,0):w(j)?B(j):Object(j)===j&&h(j,l);else Object(a)===a&&h(a,l)},B.addPrefix=function(a,b){z[a]=b},B.addFilter=function(a){x.push(a)},B.errorTimeout=1e4,null==b.readyState&&b.addEventListener&&(b.readyState="loading",b.addEventListener("DOMContentLoaded",A=function(){b.removeEventListener("DOMContentLoaded",A,0),b.readyState="complete"},0)),a.yepnope=k(),a.yepnope.executeStack=h,a.yepnope.injectJs=function(a,c,d,e,i,j){var k=b.createElement("script"),l,o,e=e||B.errorTimeout;k.src=a;for(o in d)k.setAttribute(o,d[o]);c=j?h:c||f,k.onreadystatechange=k.onload=function(){!l&&g(k.readyState)&&(l=1,c(),k.onload=k.onreadystatechange=null)},m(function(){l||(l=1,c(1))},e),i?k.onload():n.parentNode.insertBefore(k,n)},a.yepnope.injectCss=function(a,c,d,e,g,i){var e=b.createElement("link"),j,c=i?h:c||f;e.href=a,e.rel="stylesheet",e.type="text/css";for(j in d)e.setAttribute(j,d[j]);g||(n.parentNode.insertBefore(e,n),m(c,0))}}(this,document),Modernizr.load=function(){yepnope.apply(window,[].slice.call(arguments,0))};

define("neue/vendor/modernizr", function(){});

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

define('neue/modal',['require','neue/events'],function(require) {
  

  var $ = window.jQuery;
  var Modernizr = window.Modernizr;
  var Events = require("neue/events");

  // We can only have one modal open at a time; we track that here.
  var modalIsOpen = false;

  // The modal container (including background overlay).
  var $modal = null;

  // The content of the modal.
  var $modalContent = null;

  // Reference to current modal source
  var $reference = null;

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
   * @param {jQuery}  el                Element that will be placed inside the modal.
   * @param {boolean} [animated=true]   Use animation for opening the modal.
   */
  var open = function($el, animated) {
    // Default arguments
    animated = typeof animated !== "undefined" ? animated : true;

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

      if(animated && Modernizr.cssanimations) {
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
    }
  };

  var _closeHandler = function(event) {
    // Don't let the event bubble.
    if(event.target !== this) {
      return;
    }

    // Only close if this modal has a close button
    if($modalContent.find(".js-close-modal").length === 0) {
      return;
    }

    // Override default link behavior.
    event.preventDefault();

    close();
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
      window.location.hash = "_";
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
    if(hash && $(hash) && $(hash).attr("type") === "text/cached-modal" ) {
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
 * Validations can be added later by using the registerValidationFunction
 * method and referencing the function by name in the `data-validate` attribute.
 *
 * Validations give a JSON response to the `done()` callback when they've
 * finished validating with a boolean `success` and a plain-text `message`
 * value. (Alternatively, a `suggestion` value can be passed which will
 * prompt the user "Did you mean {suggestion}?".
 *
 * ## Usage Notes:
 * - Input field must have `.js-validate` class.
 * - Adding a `data-validate-trigger` attribute to *any* field will trigger
 *   another field's validation on blur (by specifying the ID of the other field).
 * - Use `data-validate-match` attribute to ID of field to check equality with
 *   "match" validator.
 * - Use `js-validate-required` attribute to validate field before submission.
 * - If adding input fields to the DOM after load, run `prepareFormLabels`
 */

define('neue/validation',['neue/events'],function() {
  

  var $ = window.jQuery;
  var Events = require("neue/events");

  var validationFunctions = [];

  /**
   * Prepares form label DOM to display validation messages
   * @param {jQuery} $parent Parent element to find & initialize labels within.
   */
  var prepareFormLabels = function($parent) {
    var $fields = $parent.find(".js-validate");

    $fields.each(function() {
      var field = $(this);
      var $fieldLabel = $("label[for='" + field.attr("id") + "']");

      if($fieldLabel.find(".inner-label").length === 0) {
        var $innerLabel = $("<div class='inner-label'></div>");
        $innerLabel.append("<div class='label'>" + $fieldLabel.html() + "</div>");
        $innerLabel.append("<div class='message'></div>");

        $fieldLabel.html($innerLabel);
      }
    });
  };


  /**
   * Register a new validation function.
   *
   * @param {String}    name  The name function will be referenced by in `data-validate` attribute.
   * @param {function}  fn    The validation function. Must accept a string and return `done()` callback.
   *
   */
  var registerValidationFunction = function (name, fn) {
    if(validationFunctions[name]) {
      throw "A validation function with that name has already been registered";
    }

    if(typeof(fn) !== "function") {
      throw "Must attach a function as second parameter";
    }

    validationFunctions[name] = fn;
  };


  /**
   * Validate field with given function.
   *
   * @param {jQuery}    $field                       Field to validate contents of.
   * @param {function}  validationFunction           Function to validate field contents with
   * @param {function}  [cb=showValidationMessage]   Callback function that receives validation result.
   */
  function validate($field, validationFunction, cb) {
    var callback = cb || function($fieldLabel, result) {
      showValidationMessage($fieldLabel, result);
    };

    var fieldValue = $field.val();
    var $fieldLabel = $("label[for='" + $field.attr("id") + "']");

    // Don't validate if we don't have a label to show results in / validation function doesn't exist
    if( $fieldLabel && hasValidationFunction(validationFunction) ) {
      if(validationFunction === "match") {
        // the "match" validation function requires an extra argument
        var secondFieldValue = $($field.data("validate-match")).val();
        validationFunctions[validationFunction](fieldValue, secondFieldValue, function(result) {
          callback($fieldLabel, result);
        });
      } else {
        // once we know this is a valid validation (heh), let's do it.
        validationFunctions[validationFunction](fieldValue, function(result) {
          callback($fieldLabel, result);
        });
      }
    }
  }

  /**
   * Show validation message in markup.
   *
   * @param {jQuery} $fieldLabel Label to display validation message within.
   * @param {Object} result      Object containing `success` and either `message` or `suggestion`
   */
  function showValidationMessage($fieldLabel, result) {
    var $field = $("#" + $fieldLabel.attr("for"));
    var $fieldMessage = $fieldLabel.find(".message");

    $field.removeClass("success error warning shake");
    $fieldMessage.removeClass("success error warning");

    if(result.message) {
      $fieldMessage.text(result.message);

      if(result.success === true) {
        $field.addClass("success");
        $fieldMessage.addClass("success");
      } else {
        $field.addClass("shake");
        $field.addClass("error");
        $fieldMessage.addClass("error");
      }

      // If Google Analytics is set up, we fire an event to
      // mark that a suggestion has been made
      if(typeof(_gaq) !== "undefined" && _gaq !== null) {
        _gaq.push(["_trackEvent", "Form", "Inline Validation Error", $fieldLabel.attr("for"), null, true]);
      }
    }

    if(result.suggestion) {
      $fieldMessage.html("Did you mean " + result.suggestion.full + "? <a href='#' data-suggestion='" + result.suggestion.full + "'class='js-mailcheck-fix'>Fix it!</a>");
      $field.addClass("warning");
      $fieldMessage.addClass("warning");


      // If Google Analytics is set up, we fire an event to
      // mark that a suggestion has been made
      if(typeof(_gaq) !== "undefined" && _gaq !== null) {
        _gaq.push(["_trackEvent", "Form", "Mailcheck Suggestion", result.suggestion.domain, null, true]);
      }
    }

    $fieldLabel.addClass("show-message");

    $(".js-mailcheck-fix").on("click", function(e) {
      e.preventDefault();

      var $field = $("#" + $(this).closest("label").attr("for"));
      $field.val($(this).data("suggestion"));
      $field.trigger("blur");

      // If Google Analytics is set up, we fire an event to
      // mark that a suggestion has been made
      if(typeof(_gaq) !== "undefined" && _gaq !== null) {
        _gaq.push(["_trackEvent", "Form", "Mailcheck Suggestion Used", $(this).text(), null, true]);
      }

    });

    $field.on("focus", function() {
      $field.removeClass("warning error success shake");
      $fieldLabel.removeClass("show-message");
    });

    return result.success;
  }


  /**
   * Checks if function exists in the validationFunctions object.
   *
   * @param {string} name  Name of validation function
   */
  function hasValidationFunction(name) {
    if( name !== "" && validationFunctions[name] && typeof( validationFunctions[name] ) === "function" ) {
      return true;
    } else {
      return false;
    }
  }


  /**
   * Validate form on submit.
   */
  $("body").on("submit", "form", function(e, isValidated) {
    if(isValidated === true) {
      // we're ready to submit the form

      // If Google Analytics is set up, we fire an event to
      // mark that the form has been successfully submitted
      if(typeof(_gaq) !== "undefined" && _gaq !== null) {
        _gaq.push(["_trackEvent", "Form", "Submitted", $(this).attr("id"), null, false]);
      }

      return true;
    } else {
      var $form = $(this);
      var $validationFields = $form.find(".js-validate").filter("[data-validate-required]");
      var validatedResults = [];

      $validationFields.each(function() {
        validate($(this), $(this).data("validate"), function($fieldLabel, result) {
          if( showValidationMessage($fieldLabel, result) ) {
            validatedResults.push(true);
          }

          if(validatedResults.length === $validationFields.length) {
            // we've validated all that can be validated
            $form.trigger("submit", true);
          } else {
            // some validation errors exist on the form

            // If Google Analytics is set up, we fire an event to
            // mark that the form had some errors
            if(typeof(_gaq) !== "undefined" && _gaq !== null) {
              _gaq.push(["_trackEvent", "Form", "Validation Error on submit", $(this).attr("id"), null, true]);
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

  $(function() {
    // Prepare the labels on any `.js-validate` fields in the DOM at load
    var $body = $("body");
    prepareFormLabels($body);

    Events.subscribe("Modal:opened", function(topic, args) {
      prepareFormLabels(args);
    });

    // Validate on blur
    $body.on("blur", ".js-validate", function(e) {
      e.preventDefault();

      // Don't validate empty form fields, that's just rude.
      if($(this).val() !== "") {
        validate($(this), $(this).data("validate"));
      }

      if( $(this).data("validate-trigger") ) {
        var $otherField = $($(this).data("validate-trigger"));

        if($otherField.val() !== "") {
          validate($otherField, $otherField.data("validate"));
        }
      }
    });
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

  return {
    prepareFormLabels: prepareFormLabels,
    registerValidationFunction: registerValidationFunction,
    Functions: validationFunctions
  };
});

/**
 * Main build script. This will compile modules into `neue.js`
 * and `neue.min.js` in dist package, and attach each module to
 * a NEUE global variable attached to the window.
 */

define('neue/main',['require','neue/vendor/modernizr','neue/carousel','neue/events','neue/jump-scroll','neue/menu','neue/messages','neue/modal','neue/scroll-indicator','neue/sticky','neue/validation'],function(require) {
  

  require("neue/vendor/modernizr");

  // Attach modules to window
  window.NEUE = {
    Carousel: require("neue/carousel"),
    Events: require("neue/events"),
    JumpScroll: require("neue/jump-scroll"),
    Menu: require("neue/menu"),
    Messages: require("neue/messages"),
    Modal: require("neue/modal"),
    ScrollIndicator: require("neue/scroll-indicator"),
    Sticky: require("neue/sticky"),
    Validation: require("neue/validation")
  };

  return window.NEUE;
});


require(["neue/main"]);
}());