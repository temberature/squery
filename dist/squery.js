/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(15),__webpack_require__(16), __webpack_require__(19), __webpack_require__(20),__webpack_require__(23)], __WEBPACK_AMD_DEFINE_RESULT__ = function(sQuery) {
		return window.sQuery = window._ = sQuery;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
	    __webpack_require__(3),
	    __webpack_require__(9),
	    __webpack_require__(4),
	    __webpack_require__(5),
	    __webpack_require__(6),
	    __webpack_require__(7),
	    __webpack_require__(8),
	    __webpack_require__(2),
	    __webpack_require__(10),
	    __webpack_require__(11),
	    __webpack_require__(12),
	    __webpack_require__(13),
	    __webpack_require__(14),
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(arr, document, getProto, slice, concat, push, indexOf,
	    class2type, toString, hasOwn, fnToString, ObjectFunctionString,
	    support, buildFragment) {

	    "use strict";

	    var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;

	    var sQuery = function(selector, context) {
	        var rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/,
	            match, attr;
	        if (this === undefined) {
	            return new sQuery(selector, context);
	        }

	        this.length = 0;
	        if (!selector) {
	            return this;
	        } else if (selector === document || selector.nodeType) {
	            this[0] = selector;
	            this.length = 1;
	            return this;
	        } else if (typeof selector === 'string') {
	            match = rquickExpr.exec(selector);
	            if (match && match[1]) {
	                sQuery.merge(this, sQuery.parseHTML(match[1], true));
	                if (rsingleTag.test(match[1]) && sQuery.isPlainObject(context)) {
	                    for (attr in context) {
	                        if (sQuery.isFunction(this[attr])) {
	                            this[attr](context[attr]);
	                        } else {
	                            this.attr(attr, context[attr]);
	                        }
	                    }
	                }
	                return this;
	            }
	            if (!context) {
	                return rootsQuery.find(selector, this);
	            } else {
	                var obj = sQuery(context);
	                return obj.find(selector);
	            }
	        }
	        //node, nodes, nodeList 
	        return sQuery.makeArray(selector, this);
	    }
	    sQuery.fn = sQuery.prototype = {
	        constructor: sQuery,
	        each: function(callback) {
	            return sQuery.each(this, callback);
	        },
	        map: function(callback) {
	            return this.pushStack(sQuery.map(this, function(elem, i) {
	                return callback.call(elem, i, elem);
	            }));
	        },
	        toArray: function() {
	            return [].slice.call(this);
	        },
	        get: function(num) {
	            if (num == null) {
	                return [].slice.call(this);
	            }
	            return num >= 0 ? this[num] : this[num + this.length];
	        },
	        pushStack: function(elems) {
	        	var ret = sQuery.merge(new sQuery(), elems);
	        	ret.prevObject = this;
	        	return ret;
	        },
	        slice: function() {
	        	return this.pushStack([].slice.apply(this, arguments));
	        },
	        eq: function(num) {
	            return this.pushStack(this.get(num) ? [this.get(num)] : []);
	        },
	        first: function() {
	            return this.eq(0);
	        },
	        last: function() {
	            return this.eq(this.length - 1);
	        },
	        end: function() {
	            return this.prevObject || new sQuery();
	        },

	        find: function(selector) {
	            var ret = [];
	            for (var i = 0; i < this.length; i++) {
	                sQuery.find(selector, this[i], ret);
	            }
	            return this.pushStack(ret);
	        },

	        removeAttr: function(name) {
	            return this.each(function() {
	                this.removeAttribute(name);
	                return this;
	            });
	        },
	        prop: function(name, value) {
	            if (value) {
	                return this.each(function() {
	                    this[name] = value;
	                    return this;
	                });
	            } else {
	                return this[0][name];
	            }
	        },
	        addClass: function(value) {
	            // this.attr('class', value);
	            return this.attr('class', function() {
	                var classes = this.getAttribute('class');
	                return classes ? classes + ' ' + value : value;
	            });
	        },
	        removeClass: function(value) {
	            return this.attr('class', function() {
	                var classes = this.getAttribute('class');
	                return classes.replace(value, '');
	            });
	        },
	        hasClass: function(value) {
	            var classes = this[0].getAttribute('class') || '';
	            return classes.indexOf(value) > -1 ? true : false;
	        },
	        val: function(val) {
	            if (val) {
	                return this.each(function() {
	                    this.value = val;
	                });
	            } else {
	                return this[0].value;
	            }
	        },
	        css: function(a, value) {
	            var props = {};
	            var obj = this;
	            if (value) {
	                return this.each(function() {

	                    if (/[+-]=.*/.test(value)) {
	                        var computed = getComputedStyle(obj[0]);
	                        this.style[a] = sQuery.compute(computed[a], value);

	                    } else {
	                        this.style[a] = value;
	                    }

	                });
	            } else {
	                if (typeof a === 'string') {
	                    return obj[0].style[a];
	                } else {
	                    sQuery.each(a, function(index, prop) {
	                        if (isNaN(index)) {
	                            return obj.each(function(i) {
	                                var value = getComputedStyle(this)[index].replace('px', '');
	                                this.style[index] = typeof prop === 'function' ? prop.call(this, i, value) + 'px' : prop;
	                            });
	                        } else {
	                            props[prop] = getComputedStyle(obj[0])[prop];
	                        }

	                    });
	                    return props;
	                }
	            }


	        },
	        show: function() {
	            return this.css('display', 'block');
	        },
	        hide: function() {
	            return this.css('display', 'none');
	        },
	        width: function(value) {
	            if (value) {
	                return this.css('width', value + 'px');
	            } else {
	                return +this.css('width').replace('px', '');
	            }
	        },
	        innerWidth: function() {
	            return parseInt(this.css('width').replace('px', '')) + parseInt(this.css('paddingLeft').replace('px', '')) + parseInt(this.css('paddingRight').replace('px', ''));
	        },
	        outerWidth: function() {
	            return this.innerWidth() + parseInt(this.css('borderLeftWidth').replace('px', '')) + parseInt(this.css('borderRightWidth').replace('px', ''));
	        },
	        text: function(value) {
	            if (value) {
	                return this.each(function() {
	                    this.innerText = value;
	                    return this;
	                });
	            } else {
	                return this[0].innerText;
	            }
	        },
	        html: function(htmlString) {
	            if (!htmlString) {
	                return this[0].innerHTML;
	            } else {
	                return this.each(function() {
	                    this.innerHTML = htmlString;
	                });
	            }

	        },

	        prepend: function() {
	            var args = arguments;
	            this.each(function() {
	                this.insertBefore(args[0][0], this.firstChild);
	            });
	            return this;
	        },
	        after: function() {
	            var args = arguments;
	            this.each(function() {
	                this.parentNode.insertBefore(sQuery(args[0])[0], this);
	            });
	            return this;
	        },
	        before: function() {
	            var args = arguments;
	            this.each(function() {
	                this.parentNode.insertBefore(sQuery(args[0])[0], this.nextSibling);
	            });
	            return this;
	        },
	        on: function(types, fn) {
	            return this.each(function() {
	                sQuery.event.add(this, types, fn);
	            });
	        },
	        off: function(types, fn) {
	            return this.each(function() {
	                sQuery.event.remove(this, types, fn);
	            })
	        },
	        trigger: function(types, data) {
	            return this.each(function() {
	                sQuery.event.trigger(types, data, this);
	            })
	        },
	        offset: function() {
	            var rect;
	            rect = this[0].getBoundingClientRect();
	            return {
	                top: rect.top + window.pageYOffset - document.documentElement.clientTop,
	                left: rect.left + window.pageXOffset - document.documentElement.clientLeft
	            };
	        },
	        position: function() {
	            var elem = this[0];
	            var offset = this.offset();
	            var offsetParent = sQuery(elem.offsetParent);
	            var parentOffset = offsetParent.offset();
	            return {
	                top: offset.top - parentOffset.top,
	                left: offset.left - parentOffset.left
	            };
	        },
	        offsetParent: function() {
	            return [this[0].offsetParent];
	        },

	        clone: function() {
	            return this.map(function(elem) {
	                return sQuery.clone(elem);
	            })
	        },
	        insertBefore: function(elems) {
	            return this.each(function() {
	                var node = this;
	                elems.each(function() {
	                    this.parentNode.insertBefore(node, this);
	                })

	            })
	        },
	        wrapAll: function(html) {
	            var wrap = sQuery(html).eq(0).clone();
	            if (this[0].parentNode) {
	                wrap.insertBefore(this);
	            }

	            wrap.append(this);
	        },
	        wrap: function(html) {
	            return this.each(function() {
	                sQuery(this).wrapAll(html);
	            })
	        },
	        wrapInner: function(html) {
	            return this.each(function() {
	                sQuery(this.childNodes).wrapAll(html);
	            })
	        },
	        // children: function(selector) {
	        // 	var childs = [];
	        // 	this.each(function() {
	        // 		sQuery.each(this.childNodes, function() {
	        // 			if (this.nodeType != 3) {
	        // 				childs.push(this);
	        // 			}
	        // 		});

	        // 	});
	        // 	if (!selector) {
	        // 		return _(childs);
	        // 	} else {
	        // 		return _(selector, childs);
	        // 	}
	        // },

	        appendTo: function() {
	            var args = arguments;
	            this.each(function() {
	                sQuery(args[0])[0].appendChild(this);
	            });
	            return this;
	        },

	        parent: function() {
	            function parent(elem) {
	                var parent = elem.parentNode;
	                return parent && parent.nodeType !== 11 ? parent : null;
	            }
	            var matched = sQuery.map(this, parent);
	            return this.pushStack(matched);
	        },
	        parents: function() {
	            function parents(elem) {
	                return sQuery.dir(elem, 'parentNode');
	            }
	            var matched = sQuery.map(this, parents);
	            return matched;
	        },
	        parentsUntil: function(arg) {
	            function parentsUntil(elem, i, until) {
	                return sQuery.dir(elem, 'parentNode', until);
	            }
	            var matched = sQuery.map(this, parentsUntil, arg);
	            return matched;
	        },
	        is: function(tagName) {
	            if (!tagName) {
	                return false;
	            }
	            return this[0].nodeName.toLowerCase() === tagName.toLowerCase();
	        },
	        next: function() {
	            function next(elem) {
	                var matched = [];
	                while ((elem = elem['nextSibling']) && elem.nodeType !== 9) {
	                    if (elem.nodeType === 1) {
	                        matched.push(elem);
	                        break;
	                    }
	                }
	                return matched;
	            }
	            var matched = sQuery.map(this, next);
	            return matched;
	        },
	        prev: function() {
	            function prev(elem) {
	                var matched = [];
	                while ((elem = elem['previousSibling']) && elem.nodeType !== 9) {
	                    if (elem.nodeType === 1) {
	                        matched.push(elem);
	                        break;
	                    }
	                }
	                return matched;
	            }
	            var matched = sQuery.map(this, prev);
	            return matched;
	        },
	        nextAll: function() {
	            function nextAll(elem) {
	                return sQuery.dir(elem, 'nextSibling');
	            }
	            var matched = sQuery.map(this, nextAll);
	            return matched;
	        },
	        prevAll: function() {
	            function prevAll(elem) {
	                return sQuery.dir(elem, 'previousSibling');
	            }
	            var matched = sQuery.map(this, prevAll);
	            return matched;
	        },
	        nextUntil: function(arg) {
	            function nextUntil(elem, i, until) {
	                return sQuery.dir(elem, 'nextSibling', until);
	            }
	            var matched = sQuery.map(this, nextUntil, arg);
	            return matched;
	        },
	        prevUntil: function(arg) {
	            function prevUntil(elem, i, until) {
	                return sQuery.dir(elem, 'previousSibling', until);
	            }
	            var matched = sQuery.map(this, prevUntil, arg);
	            return matched;
	        },
	        siblings: function() {
	            function siblings(elem) {
	                var node = (elem.parentNode || {}).firstChild,
	                    matched = [];
	                for (; node; node = node.nextSibling) {
	                    if (node.nodeType === 1 && node.nodeType !== 9 && node !== elem) {
	                        matched.push(node);
	                    }
	                }
	                return matched;
	            }
	            var matched = sQuery.map(this, siblings);
	            return matched;
	        },
	        children: function() {
	            function children(elem) {
	                return sQuery.merge([], elem.childNodes);
	            }
	            var matched = sQuery.map(this, children);
	            return matched;
	        },
	        contents: function() {
	            function contents(elem) {
	                return sQuery.merge([], elem.childNodes);
	            }
	            var matched = sQuery.map(this, contents);
	            return matched;
	        }
	    };

	    sQuery.fn.extend = sQuery.extend = function() {
	        var target = arguments[0] || {},
	            deep, length = arguments.length,
	            i = 1,
	            name, options, src, copy, copyIsArray, clone;
	        if (typeof target === 'boolean') {
	            deep = target;
	            target = arguments[i] || {};
	            i++;
	        }
	        if (typeof target !== 'object' && !sQuery.isFunction(target)) {
	            target = {};
	        }
	        if (i === length) {
	            target = this;
	            i--;
	        }
	        for (; i < length; i++) {
	            if ((options = arguments[i]) != null) {
	                for (name in options) {
	                    src = target[name];
	                    copy = options[name];
	                    if (copy === target) {
	                        continue;
	                    }
	                    if (deep && copy && (sQuery.isPlainObject(copy) || (copyIsArray = sQuery.isArray(copy)))) {
	                        if (copyIsArray) {
	                            copyIsArray = false;
	                            clone = src && sQuery.isArray(src) ? src : [];
	                        } else {
	                            clone = src && sQuery.isPlainObject(src) ? src : {};
	                        }
	                        target[name] = sQuery.extend(true, clone, copy);
	                    } else if (copy !== undefined) {
	                        target[name] = copy;
	                    }
	                }
	            }
	        }
	        return target;
	    };
	    sQuery.extend({
	        expando: "sQuery" + ('version' + Math.random()).replace(/\D/g, ""),
	        type: function(obj) {
	            if (obj == null) {
	                return obj + "";
	            }
	            var type = typeof obj;
	            return type === 'object' || type === 'function' ? class2type[{}.toString.call(obj)] || 'object' : type;
	        },
	        isFunction: function(obj) {
	            return sQuery.type(obj) === 'function';
	        },
	        isArray: Array.isArray && function(obj) {
	            return sQuery.type(obj) === 'array';
	        },
	        isNumeric: function(obj) {
	            var type = jQuery.type(obj);
	            return (type === "number" || type === "string") &&

	                //parseFloat解决空字符串，相减解决infinite
	                !isNaN(obj - parseFloat(obj));
	        },
	        isArrayLike: function(obj) {
	            if (typeof obj !== 'object') {
	                return false;
	            }
	            var length = obj && obj.length,
	                type = sQuery.type(obj);
	            if (type === 'function' || sQuery.isWindow(obj)) {
	                return false;
	            }
	            // 这里之所以要判断(length-1) in obj是引入了稀疏数组的概念，稀疏数组在用forEach或者map迭代的时候会跳过空隙(这两个方法第一个参数是元素，第二个参数是下标，第三个是调用数组)，也就是要确保数组的最后一个元素是存在的!如果要创建密集数组可以通过Array.apply(arr,Array(3))的方式，于是forEach和map就不会跳过其中的元素了!
	            return type === 'array' || length === 0 || length > 0 && (length - 1) in obj;
	        },
	        isWindow: function(obj) {
	            return obj != null && obj === obj.window;
	        },
	        isPlainObject: function(obj) {
	            if (jQuery.type(obj) !== "object" || obj.nodeType || jQuery.isWindow(obj)) {
	                return false;
	            }
	            if (obj.constructor &&
	                !{}.hasOwnProperty.call(obj.constructor.prototype, "isPrototypeOf")) {
	                return false;
	            }
	            return true;
	        },
	        inArray: function(elem, arr, i) {
	            return arr == null ? -1 : indexOf.call(arr, elem, i);
	        },
	        isEmptyObject: function(obj) {
	            var name;
	            for (name in obj) {
	                return false;
	            }
	            return true;
	        },
	        trim: function(text) {
	            var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
	            return text == null ? '' : (text + '').replace(rtrim, '');
	        },
	        camelCase: function(str) {
	            return str.replace(/^-ms-/, 'ms-').replace(/-([a-z])/g, function(all, letter) {
	                return letter.toUpperCase();
	            })
	        },
	        map: function(elems, callback, arg) {
	            var length, value, i = 0,
	                ret = [];
	            if (sQuery.isArrayLike(elems)) {
	                length = elems.length;
	                for (; i < length; i++) {
	                    value = callback(elems[i], i, arg);
	                    if (value != null) {
	                        ret.push(value);
	                    }
	                }

	            } else {
	                for (i in elems) {
	                    value = callback(elems[i], i, arg);
	                    if (value != null) {
	                        ret.push(value);
	                    }

	                }
	            }
	            return [].concat.apply([], ret);
	        },
	        grep: function(elems, callback, invert) {
	            var length, value, i = 0,
	                ret = [],
	                invert = invert || false;
	            if (sQuery.isArrayLike(elems)) {
	                length = elems.length;
	                for (; i < length; i++) {
	                    value = callback(elems[i], i);
	                    if (value === !invert) {
	                        ret.push(elems[i]);
	                    }
	                }
	            }
	            return [].concat.apply([], ret);
	        },
	        each: function(obj, callback) {
	            var i;
	            if (sQuery.isArrayLike(obj)) {
	                for (i = 0; i < obj.length; i++) {
	                    if (callback.apply(obj[i], [i, obj[i]]) === false) {
	                        break;
	                    }
	                }
	            } else {
	                for (i in obj) {
	                    if (callback.apply(obj[i], [i, obj[i]]) === false) {
	                        break;
	                    }
	                }
	            }
	            return obj;
	        },
	        merge: function(first, second) {
	            var j = 0,
	                i = first.length;
	            while (j < second.length) {
	                first[i++] = second[j++];
	            }
	            first.length = i;
	            return first;
	        },
	        nodeName: function(elem, name) {
	            return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	        },
	        globalEval: function(code, doc) {
	            doc = doc || document;
	            var script = doc.createElement('script');
	            script.text = code;
	            doc.head.appendChild(script).parentNode.removeChild(script);
	        },
	        makeArray: function(arr, base) {
	            var base = base || [];
	            if (arr != null) {
	                if (sQuery.isArrayLike(arr)) {
	                    return sQuery.merge(base, arr);
	                } else {
	                    return [arr];
	                }

	            }
	            return base;
	        },
	        // attr: function(elem, prop, val, i) {
	        //     var fixDict = {
	        //         'class': 'class'
	        //     };
	        //     var attr = fixDict[prop] || prop;
	        //     if (val) {
	        //         elem.setAttribute(attr, typeof val === 'function' ? val.call(elem, i, attr) : val);
	        //         return elem;
	        //     } else {
	        //         return elem[attr];
	        //     }
	        // },
	        compute: function(value, vary) {
	            var origin = parseInt(value.replace('px', ''));
	            var num = parseInt(vary.substr(2));
	            if (vary[0] === '+') {
	                return origin + num + 'px';
	            } else if (vary[0] === '-') {
	                return origin - num + 'px';
	            }
	        },



	        dir: function(elem, dir, until) {
	            var matched = [];
	            while ((elem = elem[dir]) && elem.nodeType !== 9) {
	                if (sQuery(elem).is(until)) {
	                    break;
	                }
	                if (elem.nodeType === 1) {
	                    matched.push(elem);
	                }
	            }
	            return matched;
	        },

	        noop: function() {},
	        clone: function(elem) {
	            return elem.cloneNode(true);
	        }
	    });
	    sQuery.each("Boolean Number String Function Array Date RegExp Object Error Symbol".split(" "), function(i, name) {
	        class2type["[object " + name + "]"] = name.toLowerCase();
	    });
	    // var class2type = {
	    // 	'[object Boolean]': 'boolean',
	    // 	'[object Number]': 'number',
	    // };
	    var rootsQuery = sQuery(document);

	    window._ = window.sQuery = sQuery;
	    return sQuery;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
		"use strict";

		// [[Class]] -> type pairs
		return {};
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
		"use strict";

		return [];
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
		"use strict";

		return Object.getPrototypeOf;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(3)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function( arr ) {
		"use strict";

		return arr.slice;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(3)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function( arr ) {
		"use strict";

		return arr.concat;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(3)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function( arr ) {
		"use strict";

		return arr.push;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(3)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function( arr ) {
		"use strict";

		return arr.indexOf;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
		"use strict";

		return window.document;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(2)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function( class2type ) {
		"use strict";

		return class2type.toString;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(11)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function( hasOwn ) {
		"use strict";

		return hasOwn.hasOwnProperty;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(2)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function( class2type ) {
		"use strict";

		return class2type.toString;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(12)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function( fnToString ) {
		"use strict";

		return fnToString.call( Object );
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
		"use strict";

		// All support tests are defined in their respective modules.
		return {};
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));


/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function(sQuery) {

	    function Select(selector, context, results) {
	        var old, nid;
	        context = context || document;
	        results = results || [];
	        var nodeType = context.nodeType;
	        var newSelector = nodeType === 9 && selector;
	        var newContext = context;
	        if (nodeType === 1) {
	            if (!(old = context.getAttribute('id'))) {
	                old = "sizzle" + -(new Date());
	                context.setAttribute('id', old);
	            }
	            nid = "[id='" + old + "'] ";
	            newSelector = nid + selector;
	        }

	        if (newSelector) {
	            [].push.apply(results, newContext.querySelectorAll(newSelector));
	            if (!old && context && context.removeAttribute) {
	                context.removeAttribute("id");
	            }
	            return results;
	        }
	        return Select.select(selector, context, results);
	    }
	    Select.extend = sQuery.extend;
	    Select.extend({
	    	attr: function(elem, name) {
	            return elem.getAttribute(name);
	    	},
	        select: function(selector, context, results) {

	        }
	    });
	    var Se = Select;
	    window.Select = Select;
		sQuery.find = Select;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(17)], __WEBPACK_AMD_DEFINE_RESULT__ = function(sQuery, buildFragment) {
		var rsingleTag = /^<([a-z][^\/\0>:\x20\t\r\n\f]*)[\x20\t\r\n\f]*\/?>(?:<\/\1>|)$/i;

		sQuery.parseHTML = function(data, context, keepScripts) {
			if (typeof data !== 'string') {
				return [];
			}
			if (typeof context === 'boolean') {
				keepScripts = context;
				context = false;
			}
			context = context || document;
			var scripts = !keepScripts&&[];

			parsed = rsingleTag.exec(data);
			if (parsed) {
				return [context.createElement(parsed[1])];
			}
			var parsed = buildFragment([data], context, scripts);
			if (scripts&&scripts.length) {
				sQuery(scripts).remove();
			}
			return sQuery.merge([], parsed.childNodes);
		}
		return sQuery.parseHTML;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(18)], __WEBPACK_AMD_DEFINE_RESULT__ = function(getAll) {
	    // var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi;
	    var rhtml = /<|&#?\w+;/;
	    var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i;
	    var rscriptType = /^$|\/(?:java|ecma)script/i;
	    var wrapMap = {

	        // Support: IE9
	        option: [ 1, "<select multiple='multiple'>", "</select>" ],

	        // XHTML parsers do not magically insert elements in the
	        // same way that tag soup parsers do. So we cannot shorten
	        // this by omitting <tbody> or other required elements.
	        thead: [ 1, "<table>", "</table>" ],
	        col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	        tr: [ 2, "<table><tbody>", "</tbody></table>" ],
	        td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	        _default: [ 0, "", "" ]
	    };

	    // Support: IE9
	    wrapMap.optgroup = wrapMap.option;

	    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
	    wrapMap.th = wrapMap.td;
	    function buildFragment(elems, context, scripts) {
	        
	        var fragment, tmp, i = 0,
	            l = elems.length,
	            elem,
	            nodes = [],
	            tag,
	            wrap;
	        fragment = context.createDocumentFragment();
	        tmp = fragment.appendChild(document.createElement("div"));
	        for (; i < l; i++) {
	            elem = elems[i];
	            if (elem || elem === 0) {
	                if (!rhtml.test(elem)) {
	                    nodes.push(context.createTextNode(elem));
	                } else {
	                    tmp = tmp || fragment.appendChild(context.createElement('div'));
	                    //support xhtml
	                    tag = (rtagName.exec(elem)||['', ''])[1].toLowerCase();
	                    wrap = wrapMap[tag]||wrapMap._default;
	                    tmp.innerHTML = wrap[1] + sQuery.htmlPrefilter(elem) + wrap[2];

	                    j = wrap[0];
	                    while(j--) {
	                        tmp = tmp.lastChild;
	                    }
	                    sQuery.merge(nodes, tmp.childNodes);
	                    tmp = fragment.firstChild;
	                    tmp.textContent = '';
	                }
	            }

	        }
	        fragment.textContent = "";
	        i = 0;
	        while ((elem = nodes[i++])) {
	            tmp = getAll(fragment.appendChild(elem), 'script');
	            if (scripts) {
	                j = 0;
	                while ((elem = tmp[j++])) {
	                    if (rscriptType.test(elem.type||'')) {
	                        scripts.push(elem);
	                    }
	                }
	            }
	        }
	        return fragment;
	    }

	    return buildFragment;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
		function getAll(context, tag) {
			var ret = typeof context.getElementsByTagName !== 'undefined' ? context.getElementsByTagName(tag||'*') : [];
			return sQuery.nodeName(context, tag) ? sQuery.merge([context], ret) : ret;		
		}
		return getAll;
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))

/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(17), __webpack_require__(18)], __WEBPACK_AMD_DEFINE_RESULT__ = function(sQuery, buildFragment, getAll) {
		var
			rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi;
		var rscriptType = /^$|\/(?:java|ecma)script/i;
		sQuery.extend({
			htmlPrefilter: function(html) {
				return html.replace(rxhtmlTag, '<$1></$2>');
			},

		})
		sQuery.fn.extend({
			remove: function() {
				return this.each(function() {
					this.parentNode.removeChild(this);
				})
			},
			append: function() {
				var l = this.length,
					args = arguments,
					collection = this,
					i = 0,
					node, elem, scripts, hasScripts, doc;
				if (l) {
					fragment = buildFragment(args, collection[0].ownerDocument, false);
					scripts = getAll(fragment.firstChild, 'script');
					hasScripts = scripts.length;
					for (; i < l; i++) {
						node = fragment;
						elem = collection[i];
						if (elem.nodeType === 1 || elem.nodeType === 11 || elem.nodeType === 9) {
							elem.appendChild(node);
						}
					}
					if (scripts.length) {
						doc = scripts[0].ownerDocument;
						for (i = 0; i < hasScripts; i++) {
							node = scripts[i];
							if (rscriptType.test(node.type||'')) {
								if (node.src) {

								} else {
									sQuery.globalEval(node.textContent, doc);
								}
							}
						}
					}
				}
				return collection;
			},
		})
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1), __webpack_require__(21), __webpack_require__(22)], __WEBPACK_AMD_DEFINE_RESULT__ = function(sQuery) {
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function(sQuery) {
		sQuery.extend({
			propFix: {
				"tabindex": "tabIndex",
				"readonly": "readOnly",
				"for": "htmlFor",
				"class": "className",
				"maxlength": "maxLength",
				"cellspacing": "cellSpacing",
				"cellpadding": "cellPadding",
				"rowspan": "rowSpan",
				"colspan": "colSpan",
				"usemap": "useMap",
				"frameborder": "frameBorder",
				"contenteditable": "contentEditable"			
			}
		})
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))

/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function(sQuery) {
		sQuery.extend({
			attr: function(elem, name, value) {
				var nType = elem.nodeType;
				if (nType === 3 || nType === 8 || nType === 2) {
					return;
				}
				if (value !== undefined) {
					if (value === null) {
						sQuery.removeAttr(elem, name);
						return;
					}
					elem.setAttribute(name, value+'');
					
				}
				return sQuery.find.attr(elem, name);
			}
		})
		sQuery.fn.extend({
			attr: function(name, val) {
				var chainable = arguments.length > 1,
					i = 0,
					elems = this,
					l = elems.length,
					j;
				if (sQuery.type(name) === 'object') {
					chainable = true;
					for (j in name) {
						for(; i < l; i++) {
							sQuery.attr(elems[i], j, name[j]);
						}
						
					}
				} else if (val !== undefined) {
					chainable = true;
					for (; i < l; i++) {
						sQuery.attr(elems[i], name, val);
					}
				}
				return chainable ? elems : l? sQuery.attr(elems[0], name) : null;


				// if (val || typeof a === 'object') {
				//     if (typeof a === 'object') {
				//         return this.each(function() {
				//             for (var prop in a) {
				//                 return sQuery.attr(this, prop, a[prop]);
				//             }
				//         });
				//     } else {
				//         return this.each(function(i) {
				//             return sQuery.attr(this, a, val, i);
				//         });
				//     }
				// } else {
				//     return this[0].getAttribute(a);
				// }
			},
		})
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [__webpack_require__(1)], __WEBPACK_AMD_DEFINE_RESULT__ = function(sQuery) {
		sQuery.event = {
			add: function(elem, types, handler) {
				var expando = sQuery.expando + 1, elemData;

				if (!elem[expando]) {
					elem[expando] = {};
				}
				elemData = elem[expando];

				if ( !( events = elemData.events ) ) {
					events = elemData.events = {};
				}			
				if (!(eventHandle = elemData.handler)) {
					eventHandle = elemData.handler = function(e) {
						return sQuery.event.dispatch.apply( elem, arguments );
					}
				}
				var handleObj = {
					handler: handler
				}
				if ( !( handlers = events[ types ] ) ) {
					handlers = events[ types ] = [];
				}
				elem.addEventListener( types, eventHandle );
				handlers.push( handleObj );
			},
			dispatch: function(event) {
				var handlers = this[sQuery.expando + 1].events[event.type],args = [].slice.call( arguments );
				var j = 0, handleObj, ret;
				while (handleObj = handlers[j++]) {
					ret = handleObj.handler.apply(this, args);
					if (ret !== undefined) {
						event.result = ret;
					}
				}
				return event.result;
			},
			remove: function(elem, types, fn) {
				var elemData = elem[sQuery.expando + 1];
				if ( !elemData || !( events = elemData.events ) ) {
					return;
				}
				elem.removeEventListener(types, elemData.handler);
				delete events[types];
				elemData = {};
			},
			trigger: function(event, data, elem) {
				var cur = elem, handlers, i=0;
				var elemData = elem[sQuery.expando + 1];
				if ( !elemData || !( events = elemData.events ) ) {
					return;
				}
				do {
					handlers = elemData.events[event];
					while (handler = handlers&&handlers[i]&&handlers[i].handler) {
						i++;
						handler.apply(cur, data);
					}
					
				} while (cur = cur.parentNode)
			}
		}

	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__))

/***/ }
/******/ ]);