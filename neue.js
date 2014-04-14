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
    }, q.rgba = function() {
        return z("background-color:rgba(150,255,150,.5)"), C(j.backgroundColor, "rgba");
    }, q.cssanimations = function() {
        return F("animationName");
    }, q.cssgradients = function() {
        var a = "background-image:", b = "gradient(linear,left top,right bottom,from(#9f9),to(white));", c = "linear-gradient(left top,#9f9, white);";
        return z((a + "-webkit- ".split(" ").join(b + a) + m.join(c + a)).slice(0, -a.length)), 
        C(j.backgroundImage, "gradient");
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
    }, z(""), i = k = null, e._version = d, e._prefixes = m, e._domPrefixes = p, e._cssomPrefixes = o, 
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

(function(window, undefined) {
    "use strict";
    var cssremunit = function() {
        var div = document.createElement("div");
        div.style.cssText = "font-size: 1rem;";
        return /rem/.test(div.style.fontSize);
    }, isStyleSheet = function() {
        var styles = document.getElementsByTagName("link"), filteredStyles = [];
        for (var i = 0; i < styles.length; i++) {
            if (styles[i].rel.toLowerCase() === "stylesheet" && styles[i].getAttribute("data-norem") === null) {
                filteredStyles.push(styles[i]);
            }
        }
        return filteredStyles;
    }, processSheets = function() {
        var links = [];
        sheets = isStyleSheet();
        sheets.og = sheets.length;
        for (var i = 0; i < sheets.length; i++) {
            links[i] = sheets[i].href;
            xhr(links[i], matchCSS, i);
        }
    }, matchCSS = function(response, i) {
        var clean = removeComments(removeMediaQueries(response.responseText)), pattern = /[\w\d\s\-\/\\\[\]:,.'"*()<>+~%#^$_=|@]+\{[\w\d\s\-\/\\%#:;,.'"*()]+\d*\.?\d+rem[\w\d\s\-\/\\%#:;,.'"*()]*\}/g, current = clean.match(pattern), remPattern = /\d*\.?\d+rem/g, remCurrent = clean.match(remPattern);
        if (current !== null && current.length !== 0) {
            found = found.concat(current);
            foundProps = foundProps.concat(remCurrent);
        }
        if (i === sheets.og - 1) {
            buildCSS();
        }
    }, buildCSS = function() {
        var pattern = /[\w\d\s\-\/\\%#:,.'"*()]+\d*\.?\d+rem[\w\d\s\-\/\\%#:,.'"*()]*[;}]/g;
        for (var i = 0; i < found.length; i++) {
            rules = rules + found[i].substr(0, found[i].indexOf("{") + 1);
            var current = found[i].match(pattern);
            for (var j = 0; j < current.length; j++) {
                rules = rules + current[j];
                if (j === current.length - 1 && rules[rules.length - 1] !== "}") {
                    rules = rules + "\n}";
                }
            }
        }
        parseCSS();
    }, parseCSS = function() {
        var remSize;
        for (var i = 0; i < foundProps.length; i++) {
            remSize = parseFloat(foundProps[i].substr(0, foundProps[i].length - 3));
            css[i] = Math.round(remSize * fontSize) + "px";
        }
        loadCSS();
    }, loadCSS = function() {
        for (var i = 0; i < css.length; i++) {
            if (css[i]) {
                rules = rules.replace(foundProps[i], css[i]);
            }
        }
        var remcss = document.createElement("style");
        remcss.setAttribute("type", "text/css");
        remcss.id = "remReplace";
        document.getElementsByTagName("head")[0].appendChild(remcss);
        if (remcss.styleSheet) {
            remcss.styleSheet.cssText = rules;
        } else {
            remcss.appendChild(document.createTextNode(rules));
        }
    }, xhr = function(url, callback, i) {
        try {
            var xhr = getXMLHttpRequest();
            xhr.open("GET", url, true);
            xhr.send();
            var ie = function() {
                var undef, v = 3, div = document.createElement("div"), all = div.getElementsByTagName("i");
                while (div.innerHTML = "<!--[if gt IE " + ++v + "]><i></i><![endif]-->", all[0]) ;
                return v > 4 ? v : undef;
            }();
            if (ie >= 7) {
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        callback(xhr, i);
                    }
                };
            } else {
                xhr.onreadystatechange = new function() {
                    if (xhr.readyState === 4) {
                        callback(xhr, i);
                    }
                }();
            }
        } catch (e) {
            if (window.XDomainRequest) {
                var xdr = new XDomainRequest();
                xdr.open("get", url);
                xdr.onload = function() {
                    callback(xdr, i);
                };
                xdr.onerror = function() {
                    return false;
                };
                xdr.send();
            }
        }
    }, removeComments = function(css) {
        var start = css.search(/\/\*/), end = css.search(/\*\//);
        if (start > -1 && end > start) {
            css = css.substring(0, start) + css.substring(end + 2);
            return removeComments(css);
        } else {
            return css;
        }
    }, mediaQuery = function() {
        if (window.matchMedia || window.msMatchMedia) {
            return true;
        }
        return false;
    }, removeMediaQueries = function(css) {
        if (!mediaQuery()) {
            css = css.replace(/@media[\s\S]*?\}\s*\}/, "");
        }
        return css;
    }, getXMLHttpRequest = function() {
        if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        } else {
            try {
                return new ActiveXObject("MSXML2.XMLHTTP");
            } catch (e1) {
                try {
                    return new ActiveXObject("Microsoft.XMLHTTP");
                } catch (e2) {}
            }
        }
    };
    if (!cssremunit()) {
        var rules = "", sheets = [], found = [], foundProps = [], css = [], body = document.getElementsByTagName("body")[0], fontSize = "";
        if (body.currentStyle) {
            if (body.currentStyle.fontSize.indexOf("px") >= 0) {
                fontSize = body.currentStyle.fontSize.replace("px", "");
            } else if (body.currentStyle.fontSize.indexOf("em") >= 0) {
                fontSize = body.currentStyle.fontSize.replace("em", "");
            } else if (body.currentStyle.fontSize.indexOf("pt") >= 0) {
                fontSize = body.currentStyle.fontSize.replace("pt", "");
            } else {
                fontSize = body.currentStyle.fontSize.replace("%", "") / 100 * 16;
            }
        } else if (window.getComputedStyle) {
            fontSize = document.defaultView.getComputedStyle(body, null).getPropertyValue("font-size").replace("px", "");
        }
        processSheets();
    }
})(window);

(function(w) {
    "use strict";
    w.matchMedia = w.matchMedia || function(doc, undefined) {
        var bool, docElem = doc.documentElement, refNode = docElem.firstElementChild || docElem.firstChild, fakeBody = doc.createElement("body"), div = doc.createElement("div");
        div.id = "mq-test-1";
        div.style.cssText = "position:absolute;top:-100em";
        fakeBody.style.background = "none";
        fakeBody.appendChild(div);
        return function(q) {
            div.innerHTML = '&shy;<style media="' + q + '"> #mq-test-1 { width: 42px; }</style>';
            docElem.insertBefore(fakeBody, refNode);
            bool = div.offsetWidth === 42;
            docElem.removeChild(fakeBody);
            return {
                matches: bool,
                media: q
            };
        };
    }(w.document);
})(this);

(function(w) {
    "use strict";
    var respond = {};
    w.respond = respond;
    respond.update = function() {};
    var requestQueue = [], xmlHttp = function() {
        var xmlhttpmethod = false;
        try {
            xmlhttpmethod = new w.XMLHttpRequest();
        } catch (e) {
            xmlhttpmethod = new w.ActiveXObject("Microsoft.XMLHTTP");
        }
        return function() {
            return xmlhttpmethod;
        };
    }(), ajax = function(url, callback) {
        var req = xmlHttp();
        if (!req) {
            return;
        }
        req.open("GET", url, true);
        req.onreadystatechange = function() {
            if (req.readyState !== 4 || req.status !== 200 && req.status !== 304) {
                return;
            }
            callback(req.responseText);
        };
        if (req.readyState === 4) {
            return;
        }
        req.send(null);
    }, isUnsupportedMediaQuery = function(query) {
        return query.replace(respond.regex.minmaxwh, "").match(respond.regex.other);
    };
    respond.ajax = ajax;
    respond.queue = requestQueue;
    respond.unsupportedmq = isUnsupportedMediaQuery;
    respond.regex = {
        media: /@media[^\{]+\{([^\{\}]*\{[^\}\{]*\})+/gi,
        keyframes: /@(?:\-(?:o|moz|webkit)\-)?keyframes[^\{]+\{(?:[^\{\}]*\{[^\}\{]*\})+[^\}]*\}/gi,
        comments: /\/\*[^*]*\*+([^/][^*]*\*+)*\//gi,
        urls: /(url\()['"]?([^\/\)'"][^:\)'"]+)['"]?(\))/g,
        findStyles: /@media *([^\{]+)\{([\S\s]+?)$/,
        only: /(only\s+)?([a-zA-Z]+)\s?/,
        minw: /\(\s*min\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,
        maxw: /\(\s*max\-width\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/,
        minmaxwh: /\(\s*m(in|ax)\-(height|width)\s*:\s*(\s*[0-9\.]+)(px|em)\s*\)/gi,
        other: /\([^\)]*\)/g
    };
    respond.mediaQueriesSupported = w.matchMedia && w.matchMedia("only all") !== null && w.matchMedia("only all").matches;
    if (respond.mediaQueriesSupported) {
        return;
    }
    var doc = w.document, docElem = doc.documentElement, mediastyles = [], rules = [], appendedEls = [], parsedSheets = {}, resizeThrottle = 30, head = doc.getElementsByTagName("head")[0] || docElem, base = doc.getElementsByTagName("base")[0], links = head.getElementsByTagName("link"), lastCall, resizeDefer, eminpx, getEmValue = function() {
        var ret, div = doc.createElement("div"), body = doc.body, originalHTMLFontSize = docElem.style.fontSize, originalBodyFontSize = body && body.style.fontSize, fakeUsed = false;
        div.style.cssText = "position:absolute;font-size:1em;width:1em";
        if (!body) {
            body = fakeUsed = doc.createElement("body");
            body.style.background = "none";
        }
        docElem.style.fontSize = "100%";
        body.style.fontSize = "100%";
        body.appendChild(div);
        if (fakeUsed) {
            docElem.insertBefore(body, docElem.firstChild);
        }
        ret = div.offsetWidth;
        if (fakeUsed) {
            docElem.removeChild(body);
        } else {
            body.removeChild(div);
        }
        docElem.style.fontSize = originalHTMLFontSize;
        if (originalBodyFontSize) {
            body.style.fontSize = originalBodyFontSize;
        }
        ret = eminpx = parseFloat(ret);
        return ret;
    }, applyMedia = function(fromResize) {
        var name = "clientWidth", docElemProp = docElem[name], currWidth = doc.compatMode === "CSS1Compat" && docElemProp || doc.body[name] || docElemProp, styleBlocks = {}, lastLink = links[links.length - 1], now = new Date().getTime();
        if (fromResize && lastCall && now - lastCall < resizeThrottle) {
            w.clearTimeout(resizeDefer);
            resizeDefer = w.setTimeout(applyMedia, resizeThrottle);
            return;
        } else {
            lastCall = now;
        }
        for (var i in mediastyles) {
            if (mediastyles.hasOwnProperty(i)) {
                var thisstyle = mediastyles[i], min = thisstyle.minw, max = thisstyle.maxw, minnull = min === null, maxnull = max === null, em = "em";
                if (!!min) {
                    min = parseFloat(min) * (min.indexOf(em) > -1 ? eminpx || getEmValue() : 1);
                }
                if (!!max) {
                    max = parseFloat(max) * (max.indexOf(em) > -1 ? eminpx || getEmValue() : 1);
                }
                if (!thisstyle.hasquery || (!minnull || !maxnull) && (minnull || currWidth >= min) && (maxnull || currWidth <= max)) {
                    if (!styleBlocks[thisstyle.media]) {
                        styleBlocks[thisstyle.media] = [];
                    }
                    styleBlocks[thisstyle.media].push(rules[thisstyle.rules]);
                }
            }
        }
        for (var j in appendedEls) {
            if (appendedEls.hasOwnProperty(j)) {
                if (appendedEls[j] && appendedEls[j].parentNode === head) {
                    head.removeChild(appendedEls[j]);
                }
            }
        }
        appendedEls.length = 0;
        for (var k in styleBlocks) {
            if (styleBlocks.hasOwnProperty(k)) {
                var ss = doc.createElement("style"), css = styleBlocks[k].join("\n");
                ss.type = "text/css";
                ss.media = k;
                head.insertBefore(ss, lastLink.nextSibling);
                if (ss.styleSheet) {
                    ss.styleSheet.cssText = css;
                } else {
                    ss.appendChild(doc.createTextNode(css));
                }
                appendedEls.push(ss);
            }
        }
    }, translate = function(styles, href, media) {
        var qs = styles.replace(respond.regex.comments, "").replace(respond.regex.keyframes, "").match(respond.regex.media), ql = qs && qs.length || 0;
        href = href.substring(0, href.lastIndexOf("/"));
        var repUrls = function(css) {
            return css.replace(respond.regex.urls, "$1" + href + "$2$3");
        }, useMedia = !ql && media;
        if (href.length) {
            href += "/";
        }
        if (useMedia) {
            ql = 1;
        }
        for (var i = 0; i < ql; i++) {
            var fullq, thisq, eachq, eql;
            if (useMedia) {
                fullq = media;
                rules.push(repUrls(styles));
            } else {
                fullq = qs[i].match(respond.regex.findStyles) && RegExp.$1;
                rules.push(RegExp.$2 && repUrls(RegExp.$2));
            }
            eachq = fullq.split(",");
            eql = eachq.length;
            for (var j = 0; j < eql; j++) {
                thisq = eachq[j];
                if (isUnsupportedMediaQuery(thisq)) {
                    continue;
                }
                mediastyles.push({
                    media: thisq.split("(")[0].match(respond.regex.only) && RegExp.$2 || "all",
                    rules: rules.length - 1,
                    hasquery: thisq.indexOf("(") > -1,
                    minw: thisq.match(respond.regex.minw) && parseFloat(RegExp.$1) + (RegExp.$2 || ""),
                    maxw: thisq.match(respond.regex.maxw) && parseFloat(RegExp.$1) + (RegExp.$2 || "")
                });
            }
        }
        applyMedia();
    }, makeRequests = function() {
        if (requestQueue.length) {
            var thisRequest = requestQueue.shift();
            ajax(thisRequest.href, function(styles) {
                translate(styles, thisRequest.href, thisRequest.media);
                parsedSheets[thisRequest.href] = true;
                w.setTimeout(function() {
                    makeRequests();
                }, 0);
            });
        }
    }, ripCSS = function() {
        for (var i = 0; i < links.length; i++) {
            var sheet = links[i], href = sheet.href, media = sheet.media, isCSS = sheet.rel && sheet.rel.toLowerCase() === "stylesheet";
            if (!!href && isCSS && !parsedSheets[href]) {
                if (sheet.styleSheet && sheet.styleSheet.rawCssText) {
                    translate(sheet.styleSheet.rawCssText, href, media);
                    parsedSheets[href] = true;
                } else {
                    if (!/^([a-zA-Z:]*\/\/)/.test(href) && !base || href.replace(RegExp.$1, "").split("/")[0] === w.location.host) {
                        if (href.substring(0, 2) === "//") {
                            href = w.location.protocol + href;
                        }
                        requestQueue.push({
                            href: href,
                            media: media
                        });
                    }
                }
            }
        }
        makeRequests();
    };
    ripCSS();
    respond.update = ripCSS;
    respond.getEmValue = getEmValue;
    function callMedia() {
        applyMedia(true);
    }
    if (w.addEventListener) {
        w.addEventListener("resize", callMedia, false);
    } else if (w.attachEvent) {
        w.attachEvent("onresize", callMedia);
    }
})(this);

var NEUE = NEUE || {};

NEUE.Validation = NEUE.Validation || {};

NEUE.Validation.Functions = NEUE.Validation.Functions || {};

(function() {
    "use strict";
    NEUE.Validation.Functions.match = function(string, secondString, done) {
        if (string === secondString && string !== "") {
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
    };
})();

var NEUE = NEUE || {};

(function($) {
    "use strict";
    $("#slide0").addClass("visible");
    var counter = 0;
    var $buttons = $("#prev, #next");
    function decrementCounter() {
        counter === 0 ? counter = 2 : counter--;
    }
    function incrementCounter() {
        counter === 2 ? counter = 0 : counter++;
    }
    function showCurrentSlide(direction) {
        $("#slide" + counter).removeClass("visible");
        direction === "prev" ? decrementCounter() : incrementCounter();
        $("#slide" + counter).addClass("visible");
    }
    $buttons.click(function() {
        showCurrentSlide($(this).attr("id"));
    });
})(jQuery);

(function() {
    "use strict";
    Modernizr.addTest("flexbox-ie10", Modernizr.testAllProps("flexAlign", "end", true));
})();

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
        $(".js-toggle-mobile-menu").on("click", function() {
            $(".chrome--nav").toggleClass("is-visible");
        });
        $(".js-footer-col").addClass("is-collapsed");
        $(".js-footer-col h4").on("click", function() {
            if (window.matchMedia("screen and (max-width: 768px)").matches) {
                $(this).closest(".js-footer-col").toggleClass("is-collapsed");
            }
        });
    });
})(jQuery);

var NEUE = NEUE || {};

(function($) {
    "use strict";
    var modalIsOpen = false;
    var $modal, $modalContent;
    $(document).ready(function() {
        $("body").on("click", ".js-modal-link", function(e) {
            e.preventDefault();
            var href;
            if ($(this).data("cached-modal")) {
                href = $(this).data("cached-modal");
            } else if (e.target.hash.charAt(0) === "#") {
                href = $(e.target.hash);
            } else {}
            if (typeof _gaq !== "undefined" && _gaq !== null) {
                _gaq.push([ "_trackEvent", "Modal", "Open", href, null, true ]);
            }
            if (!modalIsOpen) {
                $modal = $('<div class="modal"></div>');
                $modalContent = $("<div class='modal-content'></div>");
                $modal.append($modalContent);
                $modalContent.html($(href).html());
                $("body").addClass("modal-open");
                $("body").append($modal);
                $modal.addClass("fade-in");
                $modalContent.addClass("fade-in-up");
                $modalContent.addClass($(href).attr("class"));
                $modal.show();
                modalIsOpen = true;
                if (/iPhone|iPad|iPod/i.test(window.navigator.userAgent)) {
                    setTimeout(function() {
                        $modal.css({
                            position: "absolute",
                            overflow: "visible",
                            height: $(document).height() + "px"
                        });
                        $modalContent.css({
                            "margin-top": $(document).scrollTop() + "px"
                        });
                    }, 0);
                }
            } else {
                $modalContent.html($(href).html());
            }
            NEUE.Validation.prepareFormLabels($modalContent);
            $modal.on("click", ".js-close-modal", function(e) {
                e.preventDefault();
                if (typeof _gaq !== "undefined" && _gaq !== null) {
                    _gaq.push([ "_trackEvent", "Modal", "Close", href, null, true ]);
                }
                if (Modernizr.cssanimations) {
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
                }
            });
        });
    });
})(jQuery);

(function($) {
    "use strict";
    var links = [];
    function preparePage() {
        links = [];
        $(".js-scroll-indicator").each(function(index, link) {
            prepareIndicator(link);
        });
    }
    function prepareIndicator(link) {
        var linkTarget = $(link).attr("href");
        var linkTargetOffset = $(linkTarget).offset().top;
        var linkObj = {
            $el: $(link),
            targetOffset: linkTargetOffset
        };
        links.push(linkObj);
        updateScrollIndicators();
    }
    function updateScrollIndicators() {
        $.each(links, function(index, link) {
            var windowOffset = $(window).scrollTop() + link.$el.height();
            if (windowOffset > link.targetOffset) {
                $(".js-scroll-indicator").removeClass("is-active");
                link.$el.addClass("is-active");
                return;
            }
        });
    }
    $(document).ready(function() {
        preparePage();
        $(window).on("scroll", updateScrollIndicators);
        $(window).on("resize", preparePage);
    });
})(jQuery);

(function($) {
    "use strict";
    var divs = [];
    function preparePage() {
        divs = [];
        $(".js-sticky").each(function(index, div) {
            prepareSticky(div);
        });
    }
    function prepareSticky(div) {
        var divOffset = $(div).offset().top;
        var divObj = {
            $el: $(div),
            offset: divOffset
        };
        divs.push(divObj);
        scrollSticky();
    }
    function scrollSticky() {
        $.each(divs, function(index, div) {
            if ($(window).scrollTop() > div.offset) {
                div.$el.addClass("is-stuck");
            } else {
                div.$el.removeClass("is-stuck");
            }
        });
    }
    $(document).ready(function() {
        preparePage();
        $(window).on("scroll", scrollSticky);
        $(window).on("resize", preparePage);
    });
})(jQuery);

var NEUE = NEUE || {};

(function($) {
    "use strict";
    $(document).ready(function() {
        var message = "div.messages";
        var messageClose = '<a href="#" class="js-close-message message-close-button white">×</a>';
        $(message).append(messageClose);
        $(".js-close-message").on("click", function(e) {
            e.preventDefault();
            $(this).parent(message).slideUp();
        });
    });
})(jQuery);

var NEUE = NEUE || {};

NEUE.Validation = NEUE.Validation || {};

NEUE.Validation.Functions = NEUE.Validation.Functions || {};

(function($) {
    "use strict";
    NEUE.Validation.prepareFormLabels = function($parent) {
        var $fields = $parent.find(".js-validate");
        $fields.each(function() {
            var field = $(this);
            var $fieldLabel = $("label[for='" + field.attr("id") + "']");
            if ($fieldLabel.find(".inner-label").length === 0) {
                var $innerLabel = $("<div class='inner-label'></div>");
                $innerLabel.append("<div class='label'>" + $fieldLabel.html() + "</div>");
                $innerLabel.append("<div class='message'></div>");
                $fieldLabel.html($innerLabel);
            }
        });
    };
    $(document).ready(function() {
        var $body = $("body");
        NEUE.Validation.prepareFormLabels($body);
        $body.on("blur", ".js-validate", function(e) {
            e.preventDefault();
            if ($(this).val() !== "") {
                validate($(this), $(this).data("validate"));
            }
            if ($(this).data("validate-trigger")) {
                var $otherField = $($(this).data("validate-trigger"));
                if ($otherField.val() !== "") {
                    validate($otherField, $otherField.data("validate"));
                }
            }
        });
        function validate($field, validationFunction, cb) {
            var callback = cb || function($fieldLabel, result) {
                showValidationMessage($fieldLabel, result);
            };
            var fieldValue = $field.val();
            var $fieldLabel = $("label[for='" + $field.attr("id") + "']");
            if ($fieldLabel && hasValidationFunction(validationFunction)) {
                if (validationFunction === "match") {
                    var secondFieldValue = $($field.data("validate-match")).val();
                    NEUE.Validation.Functions[validationFunction](fieldValue, secondFieldValue, function(result) {
                        callback($fieldLabel, result);
                    });
                } else {
                    NEUE.Validation.Functions[validationFunction](fieldValue, function(result) {
                        callback($fieldLabel, result);
                    });
                }
            }
        }
        $("body").on("submit", "form", function(e, isValidated) {
            if (isValidated === true) {
                if (typeof _gaq !== "undefined" && _gaq !== null) {
                    _gaq.push([ "_trackEvent", "Form", "Submitted", $(this).attr("id"), null, false ]);
                }
                return true;
            } else {
                var $form = $(this);
                var $validationFields = $form.find(".js-validate").filter("[data-validate-required]");
                var validatedResults = [];
                $validationFields.each(function() {
                    validate($(this), $(this).data("validate"), function($fieldLabel, result) {
                        if (showValidationMessage($fieldLabel, result)) {
                            validatedResults.push(true);
                        }
                        if (validatedResults.length === $validationFields.length) {
                            $form.trigger("submit", true);
                        } else {
                            if (typeof _gaq !== "undefined" && _gaq !== null) {
                                _gaq.push([ "_trackEvent", "Form", "Validation Error on submit", $(this).attr("id"), null, true ]);
                            }
                        }
                    });
                });
                if ($validationFields.length === 0) {
                    $form.trigger("submit", true);
                }
                return false;
            }
        });
        function showValidationMessage($fieldLabel, result) {
            var $field = $("#" + $fieldLabel.attr("for"));
            var $fieldMessage = $fieldLabel.find(".message");
            $field.removeClass("success error warning shake");
            $fieldMessage.removeClass("success error warning");
            if (result.message) {
                $fieldMessage.text(result.message);
                if (result.success === true) {
                    $field.addClass("success");
                    $fieldMessage.addClass("success");
                } else {
                    $field.addClass("shake");
                    $field.addClass("error");
                    $fieldMessage.addClass("error");
                }
                if (typeof _gaq !== "undefined" && _gaq !== null) {
                    _gaq.push([ "_trackEvent", "Form", "Inline Validation Error", $fieldLabel.attr("for"), null, true ]);
                }
            }
            if (result.suggestion) {
                $fieldMessage.html("Did you mean " + result.suggestion.full + "? <a href='#' class='js-mailcheck-fix'>Fix it!</a>");
                $field.addClass("warning");
                $fieldMessage.addClass("warning");
                if (typeof _gaq !== "undefined" && _gaq !== null) {
                    _gaq.push([ "_trackEvent", "Form", "Mailcheck Suggestion", result.suggestion.domain, null, true ]);
                }
            }
            $fieldLabel.addClass("show-message");
            $(".js-mailcheck-fix").on("click", function(e) {
                e.preventDefault();
                var $field = $("#" + $(this).closest("label").attr("for"));
                $field.val($(this).text());
                $field.trigger("blur");
                if (typeof _gaq !== "undefined" && _gaq !== null) {
                    _gaq.push([ "_trackEvent", "Form", "Mailcheck Suggestion Used", $(this).text(), null, true ]);
                }
            });
            $field.on("focus", function() {
                $field.removeClass("warning error success shake");
                $fieldLabel.removeClass("show-message");
            });
            return result.success;
        }
    });
    function hasValidationFunction(name) {
        if (name !== "" && NEUE.Validation.Functions[name] && typeof NEUE.Validation.Functions[name] === "function") {
            return true;
        } else {
            return false;
        }
    }
})(jQuery);