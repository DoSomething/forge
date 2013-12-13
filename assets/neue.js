(function($) {
    $.fn.visible = function(partial) {
        var $t = $(this), $w = $(window), viewTop = $w.scrollTop(), viewBottom = viewTop + $w.height(), _top = $t.offset().top, _bottom = _top + $t.height(), compareTop = partial === true ? _bottom : _top, compareBottom = partial === true ? _top : _bottom;
        return compareBottom <= viewBottom && compareTop >= viewTop;
    };
    $.fn.realVisible = function(partial) {
        var $t = $(this), $w = $(window), viewTop = $w.scrollTop(), viewBottom = viewTop + $w.height() * .85, _top = $t.offset().top, _bottom = _top + $t.height(), compareTop = partial === true ? _bottom : _top, compareBottom = partial === true ? _top : _bottom;
        return compareBottom <= viewBottom && compareTop >= viewTop;
    };
})(jQuery);

var Kicksend = {
    mailcheck: {
        threshold: 3,
        defaultDomains: [ "yahoo.com", "google.com", "hotmail.com", "gmail.com", "me.com", "aol.com", "mac.com", "live.com", "comcast.net", "googlemail.com", "msn.com", "hotmail.co.uk", "yahoo.co.uk", "facebook.com", "verizon.net", "sbcglobal.net", "att.net", "gmx.com", "mail.com", "outlook.com" ],
        defaultTopLevelDomains: [ "co.jp", "co.uk", "com", "net", "org", "info", "edu", "gov", "mil" ],
        run: function(opts) {
            opts.domains = opts.domains || Kicksend.mailcheck.defaultDomains;
            opts.topLevelDomains = opts.topLevelDomains || Kicksend.mailcheck.defaultTopLevelDomains;
            opts.distanceFunction = opts.distanceFunction || Kicksend.sift3Distance;
            var result = Kicksend.mailcheck.suggest(encodeURI(opts.email), opts.domains, opts.topLevelDomains, opts.distanceFunction);
            if (result) {
                if (opts.suggested) {
                    opts.suggested(result);
                }
            } else {
                if (opts.empty) {
                    opts.empty();
                }
            }
        },
        suggest: function(email, domains, topLevelDomains, distanceFunction) {
            email = email.toLowerCase();
            var emailParts = this.splitEmail(email);
            var closestDomain = this.findClosestDomain(emailParts.domain, domains, distanceFunction);
            if (closestDomain) {
                if (closestDomain != emailParts.domain) {
                    return {
                        address: emailParts.address,
                        domain: closestDomain,
                        full: emailParts.address + "@" + closestDomain
                    };
                }
            } else {
                var closestTopLevelDomain = this.findClosestDomain(emailParts.topLevelDomain, topLevelDomains);
                if (emailParts.domain && closestTopLevelDomain && closestTopLevelDomain != emailParts.topLevelDomain) {
                    var domain = emailParts.domain;
                    closestDomain = domain.substring(0, domain.lastIndexOf(emailParts.topLevelDomain)) + closestTopLevelDomain;
                    return {
                        address: emailParts.address,
                        domain: closestDomain,
                        full: emailParts.address + "@" + closestDomain
                    };
                }
            }
            return false;
        },
        findClosestDomain: function(domain, domains, distanceFunction) {
            var dist;
            var minDist = 99;
            var closestDomain = null;
            if (!domain || !domains) {
                return false;
            }
            if (!distanceFunction) {
                distanceFunction = this.sift3Distance;
            }
            for (var i = 0; i < domains.length; i++) {
                if (domain === domains[i]) {
                    return domain;
                }
                dist = distanceFunction(domain, domains[i]);
                if (dist < minDist) {
                    minDist = dist;
                    closestDomain = domains[i];
                }
            }
            if (minDist <= this.threshold && closestDomain !== null) {
                return closestDomain;
            } else {
                return false;
            }
        },
        sift3Distance: function(s1, s2) {
            if (s1 == null || s1.length === 0) {
                if (s2 == null || s2.length === 0) {
                    return 0;
                } else {
                    return s2.length;
                }
            }
            if (s2 == null || s2.length === 0) {
                return s1.length;
            }
            var c = 0;
            var offset1 = 0;
            var offset2 = 0;
            var lcs = 0;
            var maxOffset = 5;
            while (c + offset1 < s1.length && c + offset2 < s2.length) {
                if (s1.charAt(c + offset1) == s2.charAt(c + offset2)) {
                    lcs++;
                } else {
                    offset1 = 0;
                    offset2 = 0;
                    for (var i = 0; i < maxOffset; i++) {
                        if (c + i < s1.length && s1.charAt(c + i) == s2.charAt(c)) {
                            offset1 = i;
                            break;
                        }
                        if (c + i < s2.length && s1.charAt(c) == s2.charAt(c + i)) {
                            offset2 = i;
                            break;
                        }
                    }
                }
                c++;
            }
            return (s1.length + s2.length) / 2 - lcs;
        },
        splitEmail: function(email) {
            var parts = email.split("@");
            if (parts.length < 2) {
                return false;
            }
            for (var i = 0; i < parts.length; i++) {
                if (parts[i] === "") {
                    return false;
                }
            }
            var domain = parts.pop();
            var domainParts = domain.split(".");
            var tld = "";
            if (domainParts.length == 0) {
                return false;
            } else if (domainParts.length == 1) {
                tld = domainParts[0];
            } else {
                for (var i = 1; i < domainParts.length; i++) {
                    tld += domainParts[i] + ".";
                }
                if (domainParts.length >= 2) {
                    tld = tld.substring(0, tld.length - 1);
                }
            }
            return {
                topLevelDomain: tld,
                domain: domain,
                address: parts.join("@")
            };
        }
    }
};

if (typeof module !== "undefined" && module.exports) {
    module.exports = Kicksend.mailcheck;
}

if (typeof window !== "undefined" && window.jQuery) {
    (function($) {
        $.fn.mailcheck = function(opts) {
            var self = this;
            if (opts.suggested) {
                var oldSuggested = opts.suggested;
                opts.suggested = function(result) {
                    oldSuggested(self, result);
                };
            }
            if (opts.empty) {
                var oldEmpty = opts.empty;
                opts.empty = function() {
                    oldEmpty.call(null, self);
                };
            }
            opts.email = this.val();
            Kicksend.mailcheck.run(opts);
        };
    })(jQuery);
}

window.Modernizr = function(a, b, c) {
    function z(a) {
        j.cssText = a;
    }
    function A(a, b) {
        return z(m.join(a + ";") + (b || ""));
    }
    function B(a, b) {
        return typeof a === b;
    }
    function C(a, b) {
        return !!~("" + a).indexOf(b);
    }
    function D(a, b) {
        for (var d in a) {
            var e = a[d];
            if (!C(e, "-") && j[e] !== c) return b == "pfx" ? e : !0;
        }
        return !1;
    }
    function E(a, b, d) {
        for (var e in a) {
            var f = b[a[e]];
            if (f !== c) return d === !1 ? a[e] : B(f, "function") ? f.bind(d || b) : f;
        }
        return !1;
    }
    function F(a, b, c) {
        var d = a.charAt(0).toUpperCase() + a.slice(1), e = (a + " " + o.join(d + " ") + d).split(" ");
        return B(b, "string") || B(b, "undefined") ? D(e, b) : (e = (a + " " + p.join(d + " ") + d).split(" "), 
        E(e, b, c));
    }
    var d = "2.7.1", e = {}, f = !0, g = b.documentElement, h = "modernizr", i = b.createElement(h), j = i.style, k, l = {}.toString, m = " -webkit- -moz- -o- -ms- ".split(" "), n = "Webkit Moz O ms", o = n.split(" "), p = n.toLowerCase().split(" "), q = {}, r = {}, s = {}, t = [], u = t.slice, v, w = function(a, c, d, e) {
        var f, i, j, k, l = b.createElement("div"), m = b.body, n = m || b.createElement("body");
        if (parseInt(d, 10)) while (d--) j = b.createElement("div"), j.id = e ? e[d] : h + (d + 1), 
        l.appendChild(j);
        return f = [ "&#173;", '<style id="s', h, '">', a, "</style>" ].join(""), l.id = h, 
        (m ? l : n).innerHTML += f, n.appendChild(l), m || (n.style.background = "", n.style.overflow = "hidden", 
        k = g.style.overflow, g.style.overflow = "hidden", g.appendChild(n)), i = c(l, a), 
        m ? l.parentNode.removeChild(l) : (n.parentNode.removeChild(n), g.style.overflow = k), 
        !!i;
    }, x = {}.hasOwnProperty, y;
    !B(x, "undefined") && !B(x.call, "undefined") ? y = function(a, b) {
        return x.call(a, b);
    } : y = function(a, b) {
        return b in a && B(a.constructor.prototype[b], "undefined");
    }, Function.prototype.bind || (Function.prototype.bind = function(b) {
        var c = this;
        if (typeof c != "function") throw new TypeError();
        var d = u.call(arguments, 1), e = function() {
            if (this instanceof e) {
                var a = function() {};
                a.prototype = c.prototype;
                var f = new a(), g = c.apply(f, d.concat(u.call(arguments)));
                return Object(g) === g ? g : f;
            }
            return c.apply(b, d.concat(u.call(arguments)));
        };
        return e;
    }), q.touch = function() {
        var c;
        return "ontouchstart" in a || a.DocumentTouch && b instanceof DocumentTouch ? c = !0 : w([ "@media (", m.join("touch-enabled),("), h, ")", "{#modernizr{top:9px;position:absolute}}" ].join(""), function(a) {
            c = a.offsetTop === 9;
        }), c;
    }, q.geolocation = function() {
        return "geolocation" in navigator;
    }, q.cssanimations = function() {
        return F("animationName");
    };
    for (var G in q) y(q, G) && (v = G.toLowerCase(), e[v] = q[G](), t.push((e[v] ? "" : "no-") + v));
    return e.addTest = function(a, b) {
        if (typeof a == "object") for (var d in a) y(a, d) && e.addTest(d, a[d]); else {
            a = a.toLowerCase();
            if (e[a] !== c) return e;
            b = typeof b == "function" ? b() : b, typeof f != "undefined" && f && (g.className += " " + (b ? "" : "no-") + a), 
            e[a] = b;
        }
        return e;
    }, z(""), i = k = null, function(a, b) {
        function l(a, b) {
            var c = a.createElement("p"), d = a.getElementsByTagName("head")[0] || a.documentElement;
            return c.innerHTML = "x<style>" + b + "</style>", d.insertBefore(c.lastChild, d.firstChild);
        }
        function m() {
            var a = s.elements;
            return typeof a == "string" ? a.split(" ") : a;
        }
        function n(a) {
            var b = j[a[h]];
            return b || (b = {}, i++, a[h] = i, j[i] = b), b;
        }
        function o(a, c, d) {
            c || (c = b);
            if (k) return c.createElement(a);
            d || (d = n(c));
            var g;
            return d.cache[a] ? g = d.cache[a].cloneNode() : f.test(a) ? g = (d.cache[a] = d.createElem(a)).cloneNode() : g = d.createElem(a), 
            g.canHaveChildren && !e.test(a) && !g.tagUrn ? d.frag.appendChild(g) : g;
        }
        function p(a, c) {
            a || (a = b);
            if (k) return a.createDocumentFragment();
            c = c || n(a);
            var d = c.frag.cloneNode(), e = 0, f = m(), g = f.length;
            for (;e < g; e++) d.createElement(f[e]);
            return d;
        }
        function q(a, b) {
            b.cache || (b.cache = {}, b.createElem = a.createElement, b.createFrag = a.createDocumentFragment, 
            b.frag = b.createFrag()), a.createElement = function(c) {
                return s.shivMethods ? o(c, a, b) : b.createElem(c);
            }, a.createDocumentFragment = Function("h,f", "return function(){var n=f.cloneNode(),c=n.createElement;h.shivMethods&&(" + m().join().replace(/[\w\-]+/g, function(a) {
                return b.createElem(a), b.frag.createElement(a), 'c("' + a + '")';
            }) + ");return n}")(s, b.frag);
        }
        function r(a) {
            a || (a = b);
            var c = n(a);
            return s.shivCSS && !g && !c.hasCSS && (c.hasCSS = !!l(a, "article,aside,dialog,figcaption,figure,footer,header,hgroup,main,nav,section{display:block}mark{background:#FF0;color:#000}template{display:none}")), 
            k || q(a, c), a;
        }
        var c = "3.7.0", d = a.html5 || {}, e = /^<|^(?:button|map|select|textarea|object|iframe|option|optgroup)$/i, f = /^(?:a|b|code|div|fieldset|h1|h2|h3|h4|h5|h6|i|label|li|ol|p|q|span|strong|style|table|tbody|td|th|tr|ul)$/i, g, h = "_html5shiv", i = 0, j = {}, k;
        (function() {
            try {
                var a = b.createElement("a");
                a.innerHTML = "<xyz></xyz>", g = "hidden" in a, k = a.childNodes.length == 1 || function() {
                    b.createElement("a");
                    var a = b.createDocumentFragment();
                    return typeof a.cloneNode == "undefined" || typeof a.createDocumentFragment == "undefined" || typeof a.createElement == "undefined";
                }();
            } catch (c) {
                g = !0, k = !0;
            }
        })();
        var s = {
            elements: d.elements || "abbr article aside audio bdi canvas data datalist details dialog figcaption figure footer header hgroup main mark meter nav output progress section summary template time video",
            version: c,
            shivCSS: d.shivCSS !== !1,
            supportsUnknownElements: k,
            shivMethods: d.shivMethods !== !1,
            type: "default",
            shivDocument: r,
            createElement: o,
            createDocumentFragment: p
        };
        a.html5 = s, r(b);
    }(this, b), e._version = d, e._prefixes = m, e._domPrefixes = p, e._cssomPrefixes = o, 
    e.testProp = function(a) {
        return D([ a ]);
    }, e.testAllProps = F, e.testStyles = w, g.className = g.className.replace(/(^|\s)no-js(\s|$)/, "$1$2") + (f ? " js " + t.join(" ") : ""), 
    e;
}(this, this.document), function(a, b, c) {
    function d(a) {
        return "[object Function]" == o.call(a);
    }
    function e(a) {
        return "string" == typeof a;
    }
    function f() {}
    function g(a) {
        return !a || "loaded" == a || "complete" == a || "uninitialized" == a;
    }
    function h() {
        var a = p.shift();
        q = 1, a ? a.t ? m(function() {
            ("c" == a.t ? B.injectCss : B.injectJs)(a.s, 0, a.a, a.x, a.e, 1);
        }, 0) : (a(), h()) : q = 0;
    }
    function i(a, c, d, e, f, i, j) {
        function k(b) {
            if (!o && g(l.readyState) && (u.r = o = 1, !q && h(), l.onload = l.onreadystatechange = null, 
            b)) {
                "img" != a && m(function() {
                    t.removeChild(l);
                }, 50);
                for (var d in y[c]) y[c].hasOwnProperty(d) && y[c][d].onload();
            }
        }
        var j = j || B.errorTimeout, l = b.createElement(a), o = 0, r = 0, u = {
            t: d,
            s: c,
            e: f,
            a: i,
            x: j
        };
        1 === y[c] && (r = 1, y[c] = []), "object" == a ? l.data = c : (l.src = c, l.type = a), 
        l.width = l.height = "0", l.onerror = l.onload = l.onreadystatechange = function() {
            k.call(this, r);
        }, p.splice(e, 0, u), "img" != a && (r || 2 === y[c] ? (t.insertBefore(l, s ? null : n), 
        m(k, j)) : y[c].push(l));
    }
    function j(a, b, c, d, f) {
        return q = 0, b = b || "j", e(a) ? i("c" == b ? v : u, a, b, this.i++, c, d, f) : (p.splice(this.i++, 0, a), 
        1 == p.length && h()), this;
    }
    function k() {
        var a = B;
        return a.loader = {
            load: j,
            i: 0
        }, a;
    }
    var l = b.documentElement, m = a.setTimeout, n = b.getElementsByTagName("script")[0], o = {}.toString, p = [], q = 0, r = "MozAppearance" in l.style, s = r && !!b.createRange().compareNode, t = s ? l : n.parentNode, l = a.opera && "[object Opera]" == o.call(a.opera), l = !!b.attachEvent && !l, u = r ? "object" : l ? "script" : "img", v = l ? "script" : u, w = Array.isArray || function(a) {
        return "[object Array]" == o.call(a);
    }, x = [], y = {}, z = {
        timeout: function(a, b) {
            return b.length && (a.timeout = b[0]), a;
        }
    }, A, B;
    B = function(a) {
        function b(a) {
            var a = a.split("!"), b = x.length, c = a.pop(), d = a.length, c = {
                url: c,
                origUrl: c,
                prefixes: a
            }, e, f, g;
            for (f = 0; f < d; f++) g = a[f].split("="), (e = z[g.shift()]) && (c = e(c, g));
            for (f = 0; f < b; f++) c = x[f](c);
            return c;
        }
        function g(a, e, f, g, h) {
            var i = b(a), j = i.autoCallback;
            i.url.split(".").pop().split("?").shift(), i.bypass || (e && (e = d(e) ? e : e[a] || e[g] || e[a.split("/").pop().split("?")[0]]), 
            i.instead ? i.instead(a, e, f, g, h) : (y[i.url] ? i.noexec = !0 : y[i.url] = 1, 
            f.load(i.url, i.forceCSS || !i.forceJS && "css" == i.url.split(".").pop().split("?").shift() ? "c" : c, i.noexec, i.attrs, i.timeout), 
            (d(e) || d(j)) && f.load(function() {
                k(), e && e(i.origUrl, h, g), j && j(i.origUrl, h, g), y[i.url] = 2;
            })));
        }
        function h(a, b) {
            function c(a, c) {
                if (a) {
                    if (e(a)) c || (j = function() {
                        var a = [].slice.call(arguments);
                        k.apply(this, a), l();
                    }), g(a, j, b, 0, h); else if (Object(a) === a) for (n in m = function() {
                        var b = 0, c;
                        for (c in a) a.hasOwnProperty(c) && b++;
                        return b;
                    }(), a) a.hasOwnProperty(n) && (!c && !--m && (d(j) ? j = function() {
                        var a = [].slice.call(arguments);
                        k.apply(this, a), l();
                    } : j[n] = function(a) {
                        return function() {
                            var b = [].slice.call(arguments);
                            a && a.apply(this, b), l();
                        };
                    }(k[n])), g(a[n], j, b, n, h));
                } else !c && l();
            }
            var h = !!a.test, i = a.load || a.both, j = a.callback || f, k = j, l = a.complete || f, m, n;
            c(h ? a.yep : a.nope, !!i), i && c(i);
        }
        var i, j, l = this.yepnope.loader;
        if (e(a)) g(a, 0, l, 0); else if (w(a)) for (i = 0; i < a.length; i++) j = a[i], 
        e(j) ? g(j, 0, l, 0) : w(j) ? B(j) : Object(j) === j && h(j, l); else Object(a) === a && h(a, l);
    }, B.addPrefix = function(a, b) {
        z[a] = b;
    }, B.addFilter = function(a) {
        x.push(a);
    }, B.errorTimeout = 1e4, null == b.readyState && b.addEventListener && (b.readyState = "loading", 
    b.addEventListener("DOMContentLoaded", A = function() {
        b.removeEventListener("DOMContentLoaded", A, 0), b.readyState = "complete";
    }, 0)), a.yepnope = k(), a.yepnope.executeStack = h, a.yepnope.injectJs = function(a, c, d, e, i, j) {
        var k = b.createElement("script"), l, o, e = e || B.errorTimeout;
        k.src = a;
        for (o in d) k.setAttribute(o, d[o]);
        c = j ? h : c || f, k.onreadystatechange = k.onload = function() {
            !l && g(k.readyState) && (l = 1, c(), k.onload = k.onreadystatechange = null);
        }, m(function() {
            l || (l = 1, c(1));
        }, e), i ? k.onload() : n.parentNode.insertBefore(k, n);
    }, a.yepnope.injectCss = function(a, c, d, e, g, i) {
        var e = b.createElement("link"), j, c = i ? h : c || f;
        e.href = a, e.rel = "stylesheet", e.type = "text/css";
        for (j in d) e.setAttribute(j, d[j]);
        g || (n.parentNode.insertBefore(e, n), m(c, 0));
    };
}(this, document), Modernizr.load = function() {
    yepnope.apply(window, [].slice.call(arguments, 0));
};

(function() {
    var root = this;
    var previousUnderscore = root._;
    var breaker = {};
    var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;
    var push = ArrayProto.push, slice = ArrayProto.slice, concat = ArrayProto.concat, toString = ObjProto.toString, hasOwnProperty = ObjProto.hasOwnProperty;
    var nativeForEach = ArrayProto.forEach, nativeMap = ArrayProto.map, nativeReduce = ArrayProto.reduce, nativeReduceRight = ArrayProto.reduceRight, nativeFilter = ArrayProto.filter, nativeEvery = ArrayProto.every, nativeSome = ArrayProto.some, nativeIndexOf = ArrayProto.indexOf, nativeLastIndexOf = ArrayProto.lastIndexOf, nativeIsArray = Array.isArray, nativeKeys = Object.keys, nativeBind = FuncProto.bind;
    var _ = function(obj) {
        if (obj instanceof _) return obj;
        if (!(this instanceof _)) return new _(obj);
        this._wrapped = obj;
    };
    if (typeof exports !== "undefined") {
        if (typeof module !== "undefined" && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = _;
    }
    _.VERSION = "1.5.2";
    var each = _.each = _.forEach = function(obj, iterator, context) {
        if (obj == null) return;
        if (nativeForEach && obj.forEach === nativeForEach) {
            obj.forEach(iterator, context);
        } else if (obj.length === +obj.length) {
            for (var i = 0, length = obj.length; i < length; i++) {
                if (iterator.call(context, obj[i], i, obj) === breaker) return;
            }
        } else {
            var keys = _.keys(obj);
            for (var i = 0, length = keys.length; i < length; i++) {
                if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
            }
        }
    };
    _.map = _.collect = function(obj, iterator, context) {
        var results = [];
        if (obj == null) return results;
        if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
        each(obj, function(value, index, list) {
            results.push(iterator.call(context, value, index, list));
        });
        return results;
    };
    var reduceError = "Reduce of empty array with no initial value";
    _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
        var initial = arguments.length > 2;
        if (obj == null) obj = [];
        if (nativeReduce && obj.reduce === nativeReduce) {
            if (context) iterator = _.bind(iterator, context);
            return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
        }
        each(obj, function(value, index, list) {
            if (!initial) {
                memo = value;
                initial = true;
            } else {
                memo = iterator.call(context, memo, value, index, list);
            }
        });
        if (!initial) throw new TypeError(reduceError);
        return memo;
    };
    _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
        var initial = arguments.length > 2;
        if (obj == null) obj = [];
        if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
            if (context) iterator = _.bind(iterator, context);
            return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
        }
        var length = obj.length;
        if (length !== +length) {
            var keys = _.keys(obj);
            length = keys.length;
        }
        each(obj, function(value, index, list) {
            index = keys ? keys[--length] : --length;
            if (!initial) {
                memo = obj[index];
                initial = true;
            } else {
                memo = iterator.call(context, memo, obj[index], index, list);
            }
        });
        if (!initial) throw new TypeError(reduceError);
        return memo;
    };
    _.find = _.detect = function(obj, iterator, context) {
        var result;
        any(obj, function(value, index, list) {
            if (iterator.call(context, value, index, list)) {
                result = value;
                return true;
            }
        });
        return result;
    };
    _.filter = _.select = function(obj, iterator, context) {
        var results = [];
        if (obj == null) return results;
        if (nativeFilter && obj.filter === nativeFilter) return obj.filter(iterator, context);
        each(obj, function(value, index, list) {
            if (iterator.call(context, value, index, list)) results.push(value);
        });
        return results;
    };
    _.reject = function(obj, iterator, context) {
        return _.filter(obj, function(value, index, list) {
            return !iterator.call(context, value, index, list);
        }, context);
    };
    _.every = _.all = function(obj, iterator, context) {
        iterator || (iterator = _.identity);
        var result = true;
        if (obj == null) return result;
        if (nativeEvery && obj.every === nativeEvery) return obj.every(iterator, context);
        each(obj, function(value, index, list) {
            if (!(result = result && iterator.call(context, value, index, list))) return breaker;
        });
        return !!result;
    };
    var any = _.some = _.any = function(obj, iterator, context) {
        iterator || (iterator = _.identity);
        var result = false;
        if (obj == null) return result;
        if (nativeSome && obj.some === nativeSome) return obj.some(iterator, context);
        each(obj, function(value, index, list) {
            if (result || (result = iterator.call(context, value, index, list))) return breaker;
        });
        return !!result;
    };
    _.contains = _.include = function(obj, target) {
        if (obj == null) return false;
        if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
        return any(obj, function(value) {
            return value === target;
        });
    };
    _.invoke = function(obj, method) {
        var args = slice.call(arguments, 2);
        var isFunc = _.isFunction(method);
        return _.map(obj, function(value) {
            return (isFunc ? method : value[method]).apply(value, args);
        });
    };
    _.pluck = function(obj, key) {
        return _.map(obj, function(value) {
            return value[key];
        });
    };
    _.where = function(obj, attrs, first) {
        if (_.isEmpty(attrs)) return first ? void 0 : [];
        return _[first ? "find" : "filter"](obj, function(value) {
            for (var key in attrs) {
                if (attrs[key] !== value[key]) return false;
            }
            return true;
        });
    };
    _.findWhere = function(obj, attrs) {
        return _.where(obj, attrs, true);
    };
    _.max = function(obj, iterator, context) {
        if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
            return Math.max.apply(Math, obj);
        }
        if (!iterator && _.isEmpty(obj)) return -Infinity;
        var result = {
            computed: -Infinity,
            value: -Infinity
        };
        each(obj, function(value, index, list) {
            var computed = iterator ? iterator.call(context, value, index, list) : value;
            computed > result.computed && (result = {
                value: value,
                computed: computed
            });
        });
        return result.value;
    };
    _.min = function(obj, iterator, context) {
        if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
            return Math.min.apply(Math, obj);
        }
        if (!iterator && _.isEmpty(obj)) return Infinity;
        var result = {
            computed: Infinity,
            value: Infinity
        };
        each(obj, function(value, index, list) {
            var computed = iterator ? iterator.call(context, value, index, list) : value;
            computed < result.computed && (result = {
                value: value,
                computed: computed
            });
        });
        return result.value;
    };
    _.shuffle = function(obj) {
        var rand;
        var index = 0;
        var shuffled = [];
        each(obj, function(value) {
            rand = _.random(index++);
            shuffled[index - 1] = shuffled[rand];
            shuffled[rand] = value;
        });
        return shuffled;
    };
    _.sample = function(obj, n, guard) {
        if (arguments.length < 2 || guard) {
            return obj[_.random(obj.length - 1)];
        }
        return _.shuffle(obj).slice(0, Math.max(0, n));
    };
    var lookupIterator = function(value) {
        return _.isFunction(value) ? value : function(obj) {
            return obj[value];
        };
    };
    _.sortBy = function(obj, value, context) {
        var iterator = lookupIterator(value);
        return _.pluck(_.map(obj, function(value, index, list) {
            return {
                value: value,
                index: index,
                criteria: iterator.call(context, value, index, list)
            };
        }).sort(function(left, right) {
            var a = left.criteria;
            var b = right.criteria;
            if (a !== b) {
                if (a > b || a === void 0) return 1;
                if (a < b || b === void 0) return -1;
            }
            return left.index - right.index;
        }), "value");
    };
    var group = function(behavior) {
        return function(obj, value, context) {
            var result = {};
            var iterator = value == null ? _.identity : lookupIterator(value);
            each(obj, function(value, index) {
                var key = iterator.call(context, value, index, obj);
                behavior(result, key, value);
            });
            return result;
        };
    };
    _.groupBy = group(function(result, key, value) {
        (_.has(result, key) ? result[key] : result[key] = []).push(value);
    });
    _.indexBy = group(function(result, key, value) {
        result[key] = value;
    });
    _.countBy = group(function(result, key) {
        _.has(result, key) ? result[key]++ : result[key] = 1;
    });
    _.sortedIndex = function(array, obj, iterator, context) {
        iterator = iterator == null ? _.identity : lookupIterator(iterator);
        var value = iterator.call(context, obj);
        var low = 0, high = array.length;
        while (low < high) {
            var mid = low + high >>> 1;
            iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
        }
        return low;
    };
    _.toArray = function(obj) {
        if (!obj) return [];
        if (_.isArray(obj)) return slice.call(obj);
        if (obj.length === +obj.length) return _.map(obj, _.identity);
        return _.values(obj);
    };
    _.size = function(obj) {
        if (obj == null) return 0;
        return obj.length === +obj.length ? obj.length : _.keys(obj).length;
    };
    _.first = _.head = _.take = function(array, n, guard) {
        if (array == null) return void 0;
        return n == null || guard ? array[0] : slice.call(array, 0, n);
    };
    _.initial = function(array, n, guard) {
        return slice.call(array, 0, array.length - (n == null || guard ? 1 : n));
    };
    _.last = function(array, n, guard) {
        if (array == null) return void 0;
        if (n == null || guard) {
            return array[array.length - 1];
        } else {
            return slice.call(array, Math.max(array.length - n, 0));
        }
    };
    _.rest = _.tail = _.drop = function(array, n, guard) {
        return slice.call(array, n == null || guard ? 1 : n);
    };
    _.compact = function(array) {
        return _.filter(array, _.identity);
    };
    var flatten = function(input, shallow, output) {
        if (shallow && _.every(input, _.isArray)) {
            return concat.apply(output, input);
        }
        each(input, function(value) {
            if (_.isArray(value) || _.isArguments(value)) {
                shallow ? push.apply(output, value) : flatten(value, shallow, output);
            } else {
                output.push(value);
            }
        });
        return output;
    };
    _.flatten = function(array, shallow) {
        return flatten(array, shallow, []);
    };
    _.without = function(array) {
        return _.difference(array, slice.call(arguments, 1));
    };
    _.uniq = _.unique = function(array, isSorted, iterator, context) {
        if (_.isFunction(isSorted)) {
            context = iterator;
            iterator = isSorted;
            isSorted = false;
        }
        var initial = iterator ? _.map(array, iterator, context) : array;
        var results = [];
        var seen = [];
        each(initial, function(value, index) {
            if (isSorted ? !index || seen[seen.length - 1] !== value : !_.contains(seen, value)) {
                seen.push(value);
                results.push(array[index]);
            }
        });
        return results;
    };
    _.union = function() {
        return _.uniq(_.flatten(arguments, true));
    };
    _.intersection = function(array) {
        var rest = slice.call(arguments, 1);
        return _.filter(_.uniq(array), function(item) {
            return _.every(rest, function(other) {
                return _.indexOf(other, item) >= 0;
            });
        });
    };
    _.difference = function(array) {
        var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
        return _.filter(array, function(value) {
            return !_.contains(rest, value);
        });
    };
    _.zip = function() {
        var length = _.max(_.pluck(arguments, "length").concat(0));
        var results = new Array(length);
        for (var i = 0; i < length; i++) {
            results[i] = _.pluck(arguments, "" + i);
        }
        return results;
    };
    _.object = function(list, values) {
        if (list == null) return {};
        var result = {};
        for (var i = 0, length = list.length; i < length; i++) {
            if (values) {
                result[list[i]] = values[i];
            } else {
                result[list[i][0]] = list[i][1];
            }
        }
        return result;
    };
    _.indexOf = function(array, item, isSorted) {
        if (array == null) return -1;
        var i = 0, length = array.length;
        if (isSorted) {
            if (typeof isSorted == "number") {
                i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
            } else {
                i = _.sortedIndex(array, item);
                return array[i] === item ? i : -1;
            }
        }
        if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
        for (;i < length; i++) if (array[i] === item) return i;
        return -1;
    };
    _.lastIndexOf = function(array, item, from) {
        if (array == null) return -1;
        var hasIndex = from != null;
        if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
            return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
        }
        var i = hasIndex ? from : array.length;
        while (i--) if (array[i] === item) return i;
        return -1;
    };
    _.range = function(start, stop, step) {
        if (arguments.length <= 1) {
            stop = start || 0;
            start = 0;
        }
        step = arguments[2] || 1;
        var length = Math.max(Math.ceil((stop - start) / step), 0);
        var idx = 0;
        var range = new Array(length);
        while (idx < length) {
            range[idx++] = start;
            start += step;
        }
        return range;
    };
    var ctor = function() {};
    _.bind = function(func, context) {
        var args, bound;
        if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
        if (!_.isFunction(func)) throw new TypeError();
        args = slice.call(arguments, 2);
        return bound = function() {
            if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
            ctor.prototype = func.prototype;
            var self = new ctor();
            ctor.prototype = null;
            var result = func.apply(self, args.concat(slice.call(arguments)));
            if (Object(result) === result) return result;
            return self;
        };
    };
    _.partial = function(func) {
        var args = slice.call(arguments, 1);
        return function() {
            return func.apply(this, args.concat(slice.call(arguments)));
        };
    };
    _.bindAll = function(obj) {
        var funcs = slice.call(arguments, 1);
        if (funcs.length === 0) throw new Error("bindAll must be passed function names");
        each(funcs, function(f) {
            obj[f] = _.bind(obj[f], obj);
        });
        return obj;
    };
    _.memoize = function(func, hasher) {
        var memo = {};
        hasher || (hasher = _.identity);
        return function() {
            var key = hasher.apply(this, arguments);
            return _.has(memo, key) ? memo[key] : memo[key] = func.apply(this, arguments);
        };
    };
    _.delay = function(func, wait) {
        var args = slice.call(arguments, 2);
        return setTimeout(function() {
            return func.apply(null, args);
        }, wait);
    };
    _.defer = function(func) {
        return _.delay.apply(_, [ func, 1 ].concat(slice.call(arguments, 1)));
    };
    _.throttle = function(func, wait, options) {
        var context, args, result;
        var timeout = null;
        var previous = 0;
        options || (options = {});
        var later = function() {
            previous = options.leading === false ? 0 : new Date();
            timeout = null;
            result = func.apply(context, args);
        };
        return function() {
            var now = new Date();
            if (!previous && options.leading === false) previous = now;
            var remaining = wait - (now - previous);
            context = this;
            args = arguments;
            if (remaining <= 0) {
                clearTimeout(timeout);
                timeout = null;
                previous = now;
                result = func.apply(context, args);
            } else if (!timeout && options.trailing !== false) {
                timeout = setTimeout(later, remaining);
            }
            return result;
        };
    };
    _.debounce = function(func, wait, immediate) {
        var timeout, args, context, timestamp, result;
        return function() {
            context = this;
            args = arguments;
            timestamp = new Date();
            var later = function() {
                var last = new Date() - timestamp;
                if (last < wait) {
                    timeout = setTimeout(later, wait - last);
                } else {
                    timeout = null;
                    if (!immediate) result = func.apply(context, args);
                }
            };
            var callNow = immediate && !timeout;
            if (!timeout) {
                timeout = setTimeout(later, wait);
            }
            if (callNow) result = func.apply(context, args);
            return result;
        };
    };
    _.once = function(func) {
        var ran = false, memo;
        return function() {
            if (ran) return memo;
            ran = true;
            memo = func.apply(this, arguments);
            func = null;
            return memo;
        };
    };
    _.wrap = function(func, wrapper) {
        return function() {
            var args = [ func ];
            push.apply(args, arguments);
            return wrapper.apply(this, args);
        };
    };
    _.compose = function() {
        var funcs = arguments;
        return function() {
            var args = arguments;
            for (var i = funcs.length - 1; i >= 0; i--) {
                args = [ funcs[i].apply(this, args) ];
            }
            return args[0];
        };
    };
    _.after = function(times, func) {
        return function() {
            if (--times < 1) {
                return func.apply(this, arguments);
            }
        };
    };
    _.keys = nativeKeys || function(obj) {
        if (obj !== Object(obj)) throw new TypeError("Invalid object");
        var keys = [];
        for (var key in obj) if (_.has(obj, key)) keys.push(key);
        return keys;
    };
    _.values = function(obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var values = new Array(length);
        for (var i = 0; i < length; i++) {
            values[i] = obj[keys[i]];
        }
        return values;
    };
    _.pairs = function(obj) {
        var keys = _.keys(obj);
        var length = keys.length;
        var pairs = new Array(length);
        for (var i = 0; i < length; i++) {
            pairs[i] = [ keys[i], obj[keys[i]] ];
        }
        return pairs;
    };
    _.invert = function(obj) {
        var result = {};
        var keys = _.keys(obj);
        for (var i = 0, length = keys.length; i < length; i++) {
            result[obj[keys[i]]] = keys[i];
        }
        return result;
    };
    _.functions = _.methods = function(obj) {
        var names = [];
        for (var key in obj) {
            if (_.isFunction(obj[key])) names.push(key);
        }
        return names.sort();
    };
    _.extend = function(obj) {
        each(slice.call(arguments, 1), function(source) {
            if (source) {
                for (var prop in source) {
                    obj[prop] = source[prop];
                }
            }
        });
        return obj;
    };
    _.pick = function(obj) {
        var copy = {};
        var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
        each(keys, function(key) {
            if (key in obj) copy[key] = obj[key];
        });
        return copy;
    };
    _.omit = function(obj) {
        var copy = {};
        var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
        for (var key in obj) {
            if (!_.contains(keys, key)) copy[key] = obj[key];
        }
        return copy;
    };
    _.defaults = function(obj) {
        each(slice.call(arguments, 1), function(source) {
            if (source) {
                for (var prop in source) {
                    if (obj[prop] === void 0) obj[prop] = source[prop];
                }
            }
        });
        return obj;
    };
    _.clone = function(obj) {
        if (!_.isObject(obj)) return obj;
        return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
    };
    _.tap = function(obj, interceptor) {
        interceptor(obj);
        return obj;
    };
    var eq = function(a, b, aStack, bStack) {
        if (a === b) return a !== 0 || 1 / a == 1 / b;
        if (a == null || b == null) return a === b;
        if (a instanceof _) a = a._wrapped;
        if (b instanceof _) b = b._wrapped;
        var className = toString.call(a);
        if (className != toString.call(b)) return false;
        switch (className) {
          case "[object String]":
            return a == String(b);

          case "[object Number]":
            return a != +a ? b != +b : a == 0 ? 1 / a == 1 / b : a == +b;

          case "[object Date]":
          case "[object Boolean]":
            return +a == +b;

          case "[object RegExp]":
            return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase;
        }
        if (typeof a != "object" || typeof b != "object") return false;
        var length = aStack.length;
        while (length--) {
            if (aStack[length] == a) return bStack[length] == b;
        }
        var aCtor = a.constructor, bCtor = b.constructor;
        if (aCtor !== bCtor && !(_.isFunction(aCtor) && aCtor instanceof aCtor && _.isFunction(bCtor) && bCtor instanceof bCtor)) {
            return false;
        }
        aStack.push(a);
        bStack.push(b);
        var size = 0, result = true;
        if (className == "[object Array]") {
            size = a.length;
            result = size == b.length;
            if (result) {
                while (size--) {
                    if (!(result = eq(a[size], b[size], aStack, bStack))) break;
                }
            }
        } else {
            for (var key in a) {
                if (_.has(a, key)) {
                    size++;
                    if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
                }
            }
            if (result) {
                for (key in b) {
                    if (_.has(b, key) && !size--) break;
                }
                result = !size;
            }
        }
        aStack.pop();
        bStack.pop();
        return result;
    };
    _.isEqual = function(a, b) {
        return eq(a, b, [], []);
    };
    _.isEmpty = function(obj) {
        if (obj == null) return true;
        if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
        for (var key in obj) if (_.has(obj, key)) return false;
        return true;
    };
    _.isElement = function(obj) {
        return !!(obj && obj.nodeType === 1);
    };
    _.isArray = nativeIsArray || function(obj) {
        return toString.call(obj) == "[object Array]";
    };
    _.isObject = function(obj) {
        return obj === Object(obj);
    };
    each([ "Arguments", "Function", "String", "Number", "Date", "RegExp" ], function(name) {
        _["is" + name] = function(obj) {
            return toString.call(obj) == "[object " + name + "]";
        };
    });
    if (!_.isArguments(arguments)) {
        _.isArguments = function(obj) {
            return !!(obj && _.has(obj, "callee"));
        };
    }
    if (typeof /./ !== "function") {
        _.isFunction = function(obj) {
            return typeof obj === "function";
        };
    }
    _.isFinite = function(obj) {
        return isFinite(obj) && !isNaN(parseFloat(obj));
    };
    _.isNaN = function(obj) {
        return _.isNumber(obj) && obj != +obj;
    };
    _.isBoolean = function(obj) {
        return obj === true || obj === false || toString.call(obj) == "[object Boolean]";
    };
    _.isNull = function(obj) {
        return obj === null;
    };
    _.isUndefined = function(obj) {
        return obj === void 0;
    };
    _.has = function(obj, key) {
        return hasOwnProperty.call(obj, key);
    };
    _.noConflict = function() {
        root._ = previousUnderscore;
        return this;
    };
    _.identity = function(value) {
        return value;
    };
    _.times = function(n, iterator, context) {
        var accum = Array(Math.max(0, n));
        for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
        return accum;
    };
    _.random = function(min, max) {
        if (max == null) {
            max = min;
            min = 0;
        }
        return min + Math.floor(Math.random() * (max - min + 1));
    };
    var entityMap = {
        escape: {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#x27;"
        }
    };
    entityMap.unescape = _.invert(entityMap.escape);
    var entityRegexes = {
        escape: new RegExp("[" + _.keys(entityMap.escape).join("") + "]", "g"),
        unescape: new RegExp("(" + _.keys(entityMap.unescape).join("|") + ")", "g")
    };
    _.each([ "escape", "unescape" ], function(method) {
        _[method] = function(string) {
            if (string == null) return "";
            return ("" + string).replace(entityRegexes[method], function(match) {
                return entityMap[method][match];
            });
        };
    });
    _.result = function(object, property) {
        if (object == null) return void 0;
        var value = object[property];
        return _.isFunction(value) ? value.call(object) : value;
    };
    _.mixin = function(obj) {
        each(_.functions(obj), function(name) {
            var func = _[name] = obj[name];
            _.prototype[name] = function() {
                var args = [ this._wrapped ];
                push.apply(args, arguments);
                return result.call(this, func.apply(_, args));
            };
        });
    };
    var idCounter = 0;
    _.uniqueId = function(prefix) {
        var id = ++idCounter + "";
        return prefix ? prefix + id : id;
    };
    _.templateSettings = {
        evaluate: /<%([\s\S]+?)%>/g,
        interpolate: /<%=([\s\S]+?)%>/g,
        escape: /<%-([\s\S]+?)%>/g
    };
    var noMatch = /(.)^/;
    var escapes = {
        "'": "'",
        "\\": "\\",
        "\r": "r",
        "\n": "n",
        "	": "t",
        "\u2028": "u2028",
        "\u2029": "u2029"
    };
    var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;
    _.template = function(text, data, settings) {
        var render;
        settings = _.defaults({}, settings, _.templateSettings);
        var matcher = new RegExp([ (settings.escape || noMatch).source, (settings.interpolate || noMatch).source, (settings.evaluate || noMatch).source ].join("|") + "|$", "g");
        var index = 0;
        var source = "__p+='";
        text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
            source += text.slice(index, offset).replace(escaper, function(match) {
                return "\\" + escapes[match];
            });
            if (escape) {
                source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
            }
            if (interpolate) {
                source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
            }
            if (evaluate) {
                source += "';\n" + evaluate + "\n__p+='";
            }
            index = offset + match.length;
            return match;
        });
        source += "';\n";
        if (!settings.variable) source = "with(obj||{}){\n" + source + "}\n";
        source = "var __t,__p='',__j=Array.prototype.join," + "print=function(){__p+=__j.call(arguments,'');};\n" + source + "return __p;\n";
        try {
            render = new Function(settings.variable || "obj", "_", source);
        } catch (e) {
            e.source = source;
            throw e;
        }
        if (data) return render(data, _);
        var template = function(data) {
            return render.call(this, data, _);
        };
        template.source = "function(" + (settings.variable || "obj") + "){\n" + source + "}";
        return template;
    };
    _.chain = function(obj) {
        return _(obj).chain();
    };
    var result = function(obj) {
        return this._chain ? _(obj).chain() : obj;
    };
    _.mixin(_);
    each([ "pop", "push", "reverse", "shift", "sort", "splice", "unshift" ], function(name) {
        var method = ArrayProto[name];
        _.prototype[name] = function() {
            var obj = this._wrapped;
            method.apply(obj, arguments);
            if ((name == "shift" || name == "splice") && obj.length === 0) delete obj[0];
            return result.call(this, obj);
        };
    });
    each([ "concat", "join", "slice" ], function(name) {
        var method = ArrayProto[name];
        _.prototype[name] = function() {
            return result.call(this, method.apply(this._wrapped, arguments));
        };
    });
    _.extend(_.prototype, {
        chain: function() {
            this._chain = true;
            return this;
        },
        value: function() {
            return this._wrapped;
        }
    });
}).call(this);

var NEUE = NEUE || {};

(function($) {
    "use strict";
    NEUE.BaseModule = {
        initialized: false,
        Options: {},
        defaultOptions: {},
        Views: {},
        Templates: {},
        Events: {},
        initialize: function(element, opts) {
            this._baseInitialize(element, opts);
            if (typeof this._initialize === "function") {
                this._initialize();
            }
            this.initialized = true;
        },
        extend: function(extensions) {
            var parent = this;
            var child = {};
            _.extend(child, parent, extensions);
            return child;
        },
        _baseInitialize: function(element, opts) {
            var _this = this;
            this.Views.$el = element;
            this.$el = this.Views.$el;
            if (typeof opts !== "undefined" && opts !== null) {
                this.Options = $.extend({}, this.defaultOptions, opts);
            } else {
                this.Options = this.defaultOptions;
            }
            this.State = new NEUE.State({}, this);
            $(document).ready(function() {
                _this.$el.html("");
                _this._prepareTemplates();
                _this._bindEvents();
            });
        },
        _bindEvents: function() {
            var rootElement = this.$el;
            var _this = this;
            _.each(this.Events, function(target, trigger) {
                var elementSelector = trigger.split(" ")[0];
                var eventType = trigger.split(" ")[1];
                rootElement.on(eventType, elementSelector, function(event) {
                    event.preventDefault();
                    _this[target]();
                });
            });
        },
        _prepareTemplates: function() {
            var _this = this;
            _.each(this.Templates, function(templateDOM, templateID) {
                _this.Templates[templateID] = _.template($(templateDOM).html());
            });
        }
    };
})(jQuery);

var NEUE = NEUE || {};

(function() {
    "use strict";
    NEUE.State = function State(initialState, context) {
        var state = {};
        var bindings = {};
        var _this = context;
        if (initialState) {
            state = initialState;
        }
        var reset = function reset(array) {
            state = array;
        };
        var set = function set(key, value) {
            state[key] = value;
            if (bindings[key]) {
                for (var i = 0; i < bindings[key].length; i++) {
                    var func = _this[bindings[key][i]];
                    if (func && _.isFunction(func)) {
                        func();
                    }
                }
            }
        };
        var get = function get(key) {
            return state[key];
        };
        var bindEvent = function bindEvent(key, callback) {
            if (bindings[key]) {
                bindings[key].push(callback);
            } else {
                bindings[key] = [ callback ];
            }
        };
        var unbindEvent = function unbindEvent(key, callback) {};
        return {
            reset: reset,
            set: set,
            get: get,
            bindEvent: bindEvent,
            unbindEvent: unbindEvent
        };
    };
})();

var NEUE = NEUE || {};

(function($) {
    "use strict";
    var Validate = {
        Email: function(e, force) {
            var el = e.target;
            $(this).mailcheck({
                domains: [ "yahoo.com", "google.com", "hotmail.com", "gmail.com", "me.com", "aol.com", "mac.com", "live.com", "comcast.net", "googlemail.com", "msn.com", "hotmail.co.uk", "yahoo.co.uk", "facebook.com", "verizon.net", "sbcglobal.net", "att.net", "gmx.com", "mail.com", "outlook.com", "aim.com", "ymail.com", "rocketmail.com", "bellsouth.net", "cox.net", "charter.net", "me.com", "earthlink.net", "optonline.net", "dosomething.org" ],
                suggested: function(element, suggestion) {
                    showValidationMessage(force, el, "warning", "Did you mean <a class='js-mailcheck-fix' href='#'>" + suggestion.full + "</a>?", true);
                    return true;
                },
                empty: function(element) {
                    if (element.val().toUpperCase().match(/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]+$/)) {
                        showValidationMessage(force, el, "success", "Great, thanks!");
                        return true;
                    } else {
                        showValidationMessage(force, el, "error", "Something doesn't look right. Are you sure?");
                        return false;
                    }
                }
            });
        },
        Name: function(e, force) {
            var el = e.target;
            var inputName = $(el).val();
            if (inputName !== "") {
                var capitalizedName = inputName.charAt(0).toUpperCase() + inputName.slice(1);
                showValidationMessage(force, el, "success", "Hey " + capitalizedName + "!");
                return true;
            } else {
                showValidationMessage(force, el, "error", "We need your first name.");
                return false;
            }
        },
        Birthday: function(e, force) {
            var el = e.target;
            var birthday = $(el).val().split("/");
            var birthMonth = parseInt(birthday[0]);
            var birthDay = parseInt(birthday[1]);
            var birthYear = parseInt(birthday[2]);
            var now = new Date();
            var todaysYear = now.getFullYear();
            var todaysMonth = now.getMonth() + 1;
            var todaysDay = now.getDate();
            var age;
            if (birthMonth === todaysMonth && birthDay === todaysDay) {
                showValidationMessage(force, el, "success", "Wow, happy birthday!");
                $("#parent_email_field").slideUp();
                return true;
            } else if (birthYear >= 2e3 && birthYear < todaysYear) {
                age = todaysYear - birthYear;
                showValidationMessage(force, el, "success", "Ok, we'll need a parent's email.");
                $("#parent_email_field").slideDown();
                return true;
            } else if (birthYear >= 1989 && birthYear < 2e3) {
                age = todaysYear - birthYear;
                showValidationMessage(force, el, "success", age + ", cool!");
                $("#parent_email_field").slideUp();
                return true;
            } else if (birthYear > 1890 && birthYear < 1989) {
                showValidationMessage(force, el, "success", "Yikes, you're old!");
                $("#parent_email_field").slideUp();
                return true;
            } else if ($(el).val() === "") {
                showValidationMessage(force, el, "error", "We need your birthday.");
                $("#parent_email_field").slideUp();
                return false;
            } else {
                showValidationMessage(force, el, "error", "That doesn't seem right!");
                $("#parent_email_field").slideUp();
                return false;
            }
        },
        PhoneNumber: function(e, force) {
            var el = e.target;
            var inputCell = $(el).val();
            if (inputCell !== "") {
                inputCell = inputCell.replace(/[^0-9\.]+/g, "");
                if (inputCell.match(/^\d{10}$/)) {
                    showValidationMessage(force, el, "success", "Thanks!");
                    return true;
                } else {
                    showValidationMessage(force, el, "error", "Make sure to enter your full 10-digit number.");
                    return false;
                }
            }
        },
        Password: function(e, force) {
            var el = e.target;
            var password = $(el).val();
            if ($("#confirm_password").val() !== "") {
                Validate.PasswordConfirmation({
                    target: $("#confirm_password")
                });
            }
            if (password.length < 6) {
                showValidationMessage(force, el, "error", "Passwords need to be 6+ characters.");
                return false;
            } else {
                showValidationMessage(force, el, "success", "Tough stuff.");
                return true;
            }
        },
        PasswordConfirmation: function(e, force) {
            var el = e.target;
            var password = $("#password").val();
            var passwordConfirmation = $(el).val();
            if (password !== passwordConfirmation) {
                showValidationMessage(force, el, "error", "That doesn't match. Try again!");
                return false;
            } else {
                if ($("#password").val() !== "") {
                    showValidationMessage(force, el, "success", "Great, everything looks in order.");
                    return true;
                } else {
                    return false;
                }
            }
        }
    };
    var showValidationMessage = function showValidationMessage(force, el, type, message, useHTML) {
        var fieldLabel = $("label[for='" + $(el).attr("id") + "']");
        if (message !== "" && (force || $(el).val().length > 0)) {
            fieldLabel.find(".message").removeClass("error success");
            fieldLabel.find(".message").addClass(type);
            if (useHTML) {
                fieldLabel.find(".message").html(message);
            } else {
                fieldLabel.find(".message").text(message);
            }
            fieldLabel.addClass("showMessage");
        }
        $(el).on("focus", hideValidationMessage);
    };
    var hideValidationMessage = function hideValidationMessage() {
        var fieldLabel = $("label[for='" + $(this).attr("id") + "']");
        fieldLabel.removeClass("showMessage");
    };
    $(document).ready(function() {
        $("#username").on("blur", Validate.Email);
        $("#first_name").on("blur", Validate.Name);
        $("#birthday").on("blur", Validate.Birthday);
        $("#parent_email").on("blur", Validate.Email);
        $("#cell").on("blur", Validate.PhoneNumber);
        $("#password").on("blur", Validate.Password);
        $("#confirm_password").on("blur", Validate.PasswordConfirmation);
        $("#auth-form").on("click", ".js-mailcheck-fix", function() {
            var field = document.getElementById($(this).closest("label").attr("for"));
            $(field).val($(this).text());
            $(field).trigger("blur");
        });
        $(".js-toggle-register").on("click", function() {
            var parentModal = $(this).closest(".modal-content");
            var action = parentModal.find("form").attr("action");
            $(window).scrollTop();
            if (action.match(/login/)) {
                parentModal.find(".js-auth-heading").text("Get started by registering for DoSomething.org!");
                parentModal.find(".forgot-password").fadeOut();
                parentModal.find(".is-registration-field").slideDown();
                parentModal.find(".js-submit-link").val("Register");
                $(this).text("I already have an account.");
                parentModal.find("form").attr("action", "/register");
            } else {
                parentModal.find(".js-auth-heading").text("Sign in to get started!");
                parentModal.find(".is-registration-field").slideUp();
                parentModal.find(".forgot-password").fadeIn();
                parentModal.find(".js-submit-link").val("Sign In");
                $(this).text("Create a DoSomething.org Account");
                parentModal.find("form").attr("action", "/login");
            }
        });
        $("#auth-form").on("submit", function() {
            var modalContent = $("#modal--auth-login").find(".modal-content");
            $("input:visible").trigger("blur", {
                force: true
            });
            if ($(".innerLabel .message.error").length > 0) {
                modalContent.removeClass("wobble fadeIn fadeInUp");
                modalContent.addClass("wobble");
                setTimeout(function() {
                    modalContent.removeClass("wobble");
                }, 1e3);
                return false;
            } else {
                return true;
            }
        });
    });
    NEUE.Validate = Validate;
})(jQuery);

(function($) {
    "use strict";
    $(document).ready(function() {
        var allFades = $(".js-fade-up-on-scroll");
        function applyFade() {
            allFades.each(function(i, el) {
                el = $(el);
                if (el.realVisible(true)) {
                    el.addClass("come-in");
                }
            });
        }
        applyFade();
        $(window).scroll(applyFade);
    });
})(jQuery);

(function($) {
    "use strict";
    $(document).ready(function() {
        $(".js-jump-scroll").on("click", function(e) {
            e.preventDefault();
            var href = $(this).attr("href");
            $("html,body").animate({
                scrollTop: $(e.target.hash).offset().top
            }, "slow", function() {
                window.location.hash = href;
            });
        });
    });
})(jQuery);

(function($) {
    "use strict";
    $(document).ready(function() {
        $(".js-menu-toggle").on("click", function() {
            $(".main-menu").toggleClass("is-visible-mobile");
        });
        $(".search form input[type='search']").on("focus", function() {
            $(".utility-link").addClass("is-hidden-on-phones");
        });
        $(".search form input[type='search']").on("blur", function() {
            $(".utility-link").removeClass("is-hidden-on-phones");
        });
    });
})(jQuery);

(function($) {
    "use strict";
    $(document).ready(function() {
        $(".js-trigger-modal").on("click", function(e) {
            e.preventDefault();
            var href = $(e.target.hash);
            $("body").addClass("modal-open");
            $(href).show();
            if (Modernizr.cssanimations) {
                $(href).addClass("animated fadeIn");
                $(href).find(".modal-content").addClass("animated fadeInUp");
            }
            $(".js-close-modal").on("click", function(e) {
                e.preventDefault();
                var modal = $(this).closest(".modal");
                if (Modernizr.cssanimations) {
                    modal.find(".modal-content").addClass("fadeOutDown");
                    modal.addClass("fadeOut");
                    $("body").removeClass("modal-open");
                    modal.one("webkitAnimationEnd mozAnimationEnd oAnimationEnd animationEnd", function() {
                        modal.hide();
                        modal.removeClass("animated fadeIn fadeOut");
                        modal.find(".modal-content").removeClass("animated fadeInUp fadeOutDown");
                    });
                } else {
                    modal.hide();
                }
            });
        });
    });
})(jQuery);

(function($) {
    "use strict";
    window.NEUE = window.NEUE || {};
    window.NEUE.pinToTop = function() {
        var divTop = $("#js-pin-to-top-anchor").offset().top;
        var stickyRelocate = function() {
            if ($(window).scrollTop() > divTop) {
                $(".js-pin-to-top").addClass("is-stuck");
            } else {
                $(".js-pin-to-top").removeClass("is-stuck");
            }
        };
        $(window).on("scroll", stickyRelocate);
        stickyRelocate();
    };
})(jQuery);