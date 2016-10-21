define([
    "./var/arr",
    "./var/document",
    "./var/getProto",
    "./var/slice",
    "./var/concat",
    "./var/push",
    "./var/indexOf",
    "./var/class2type",
    "./var/toString",
    "./var/hasOwn",
    "./var/fnToString",
    "./var/ObjectFunctionString",
    "./var/support",
], function(arr, document, getProto, slice, concat, push, indexOf,
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
        // text: function(value) {
        //     if (value) {
        //         return this.each(function() {
        //             this.innerText = value;
        //             return this;
        //         });
        //     } else {
        //         return this[0].innerText;
        //     }
        // },
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

        // clone: function() {
        //     return this.map(function() {
        //         return sQuery.clone(this);
        //     })
        // },
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
});
