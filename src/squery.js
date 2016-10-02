define( [
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
	'./buildFragment'
], function( arr, document, getProto, slice, concat, push, indexOf,
	class2type, toString, hasOwn, fnToString, ObjectFunctionString,
	support, buildFragment ) {

"use strict";

	var sQuery = function(selector, context) {
		var rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/, match;
		if (this === undefined) {
			return new sQuery(selector, context);
		}

		this.length = 0;
		if (!selector) {
			return this;
		} else if (selector === document||selector.nodeType) {
			this[0] = selector;
			this.length = 1;
			return this;
		} else if (typeof selector === 'string') {
			match = rquickExpr.exec(selector);
			if (match&&match[1]) {
				sQuery.merge(this, sQuery.parseHTML(match[1]));
				return this;
			}
			if (!context) {
				return rootsQuery.find(selector, this);
			} else {
				var obj = sQuery( context );
				return obj.find( selector );
			}
		}
		//node, nodes, nodeList 
		return sQuery.makeArray(selector, this);
	}
	sQuery.fn = sQuery.prototype = {
		constructor: sQuery,
		get: function(num) {
			if (num == null) {
				return [].slice.call(this);
			}
			return this[num];
		},
		first: function() {
			return [this.get(0)];
		},
		last: function() {
			return [this.get(this.length-1)];
		},
		find: function(selector) {
			var ret = [];
			for (var i = 0; i < this.length; i++) {
				sQuery.find(selector, this[i], ret);
			}
			return sQuery.pushStack(ret);
		},
		each: function(fn) {
			return sQuery.each( this, fn);
		},
		attr: function(a, val) {
			if (val||typeof a === 'object') {
				if (typeof a === 'object') {
					return this.each(function() {
						for (var prop in a) {
							return sQuery.attr(this, prop, a[prop]);
						}
					});
				} else {
					return this.each(function(i) {
						return sQuery.attr(this, a, val, i);					
					});
				}
			} else {
				return this[0].getAttribute(a);			
			}
		},
		removeAttr: function(name) {
			return this.each(function() {
				this.removeAttribute( name );
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
				return classes ? classes + ' ' +value : value;
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
				return this.css('width', value+'px');
			} else {
				return +this.css('width').replace('px', '');
			}			
		},
		innerWidth: function() {
			return parseInt(this.css('width').replace('px', ''))+parseInt(this.css('paddingLeft').replace('px', ''))+parseInt(this.css('paddingRight').replace('px', ''));
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
		append: function() {
			var args = arguments;
			this.each(function() {
				this.appendChild(args[0][0]);
			}); 
			return this;
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
				this.parentNode.insertBefore( sQuery(args[0])[0], this );
			}); 
			return this;
		},
		before: function() {
			var args = arguments;
			this.each(function() {
				this.parentNode.insertBefore( sQuery(args[0])[0], this.nextSibling );
			}); 
			return this;
		},
		on: function(type, fn) {
			return this.each(function() {
				return this.addEventListener(type, fn);
			});
		},
		off: function(type, fn) {

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
		each: function(callback) {
			return sQuery.each( this, callback );
		},
		parent: function() {
			function parent(elem) {
				var parent = elem.parentNode;
				return parent && parent.nodeType !== 11 ? parent : null;
			}
			var matched = sQuery.map( this, parent);
			return matched;
		},
		parents: function() {
			function parents(elem) {
				return sQuery.dir(elem, 'parentNode');
			}
			var matched = sQuery.map( this, parents);
			return matched;
		},
		parentsUntil: function(arg) {
			function parentsUntil(elem, i, until) {
				return sQuery.dir(elem, 'parentNode', until);
			}
			var matched = sQuery.map( this, parentsUntil, arg);
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
				while ((elem = elem['nextSibling'])&& elem.nodeType !== 9) {
					if (elem.nodeType === 1) {
						matched.push( elem );
						break;
					}
				}
				return matched;
			}
			var matched = sQuery.map( this, next);
			return matched;
		},
		prev: function() {
			function prev(elem) {
				var matched = [];
				while ((elem = elem['previousSibling'])&& elem.nodeType !== 9) {
					if (elem.nodeType === 1) {
						matched.push( elem );
						break;
					}
				}
				return matched;
			}
			var matched = sQuery.map( this, prev);
			return matched;
		},
		nextAll: function() {
			function nextAll(elem) {
				return sQuery.dir(elem, 'nextSibling');
			}
			var matched = sQuery.map( this, nextAll);
			return matched;
		},
		prevAll: function() {
			function prevAll(elem) {
				return sQuery.dir(elem, 'previousSibling');
			}
			var matched = sQuery.map( this, prevAll);
			return matched;
		},
		nextUntil: function(arg) {
			function nextUntil(elem, i, until) {
				return sQuery.dir(elem, 'nextSibling', until);
			}
			var matched = sQuery.map( this, nextUntil, arg);
			return matched;
		},
		prevUntil: function(arg) {
			function prevUntil(elem, i, until) {
				return sQuery.dir(elem, 'previousSibling', until);
			}
			var matched = sQuery.map( this, prevUntil, arg);
			return matched;
		},
		siblings: function() {
			function siblings(elem) {
				var node = (elem.parentNode||{}).firstChild, matched = [];
				for (;node;node = node.nextSibling) {
					if (node.nodeType === 1&&node.nodeType !== 9&&node !== elem) {
						matched.push(node);
					}
				}
				return matched;
			}
			var matched = sQuery.map( this, siblings);
			return matched;
		},
		children: function() {
			function children(elem) {
				return sQuery.merge([], elem.childNodes);
			}
			var matched = sQuery.map( this, children);
			return matched;	
		},
		contents: function() {
			function contents(elem) {
				return sQuery.merge([], elem.childNodes);
			}
			var matched = sQuery.map( this, contents);
			return matched;
		}
	};

	sQuery.extend = function(obj, prop) {
		if (!prop) {
			prop = obj;
			obj = this;
			
		}
		for ( var i in prop ) obj[i] = prop[i];
		return obj;
	};
	sQuery.extend({
		makeArray: function(arr, base) {
			var base = base || [];
			if (arr != null) {
				if (sQuery.isArraylike(arr)) {
					return sQuery.merge(base, arr);
				} else {
					return [arr];
				}
				
			}
			return base;
		},
		isArraylike: function(arr) {
			if (typeof arr !== 'object'||sQuery.isWindow(arr)) {
				return false;
			}
			var length = arr.length;
			if (arr.nodeType === 1&&length) {
				return true;
			} else if (sQuery.type(arr) === 'array') {
				return true;
			} else if (typeof length === "number" && length > 0) {
				return true;
			}
			return false;
		},
		type: function(obj) {
			if ( obj == null ) {
				return obj + "";
			}
			return class2type[ {}.toString.call(obj) ]||typeof obj;
		},
		each: function(obj, fn) {
			var i;
			if (obj.length === undefined) {
				for (i in obj ) {
					fn.apply(obj[i], [i, obj[i]]);
				}
			} else {
				for (i = 0; i < obj.length; i++ ) {
					fn.apply(obj[i], [i, obj[i]]);
				}
			}
			return obj;
		},
		merge: function(first, second) {
			var j = 0, i = first.length;
			while (j < second.length) {
				first[i++] = second[j++];
			}
			first.length = i;
			return first;
		},
		pushStack: function(elems) {
			var ret = sQuery.merge(new sQuery(), elems);
			return ret;
		},
		each: function(obj, fn) {
			if (obj.length === undefined) {
				for (var i in obj ) {
					fn.apply(obj[i], [i, obj[i]]);
				}
			} else {
				for ( var i = 0; i < obj.length; i++ ) {
					fn.apply(obj[i], [i, obj[i]]);
				}
			}
			return obj;
		},
		attr: function(elem, prop, val, i) {
			var fixDict = {
				'class': 'class'
			};
			var attr = fixDict[prop]||prop;
			if (val) {
				elem.setAttribute(attr, typeof val === 'function' ? val.call(elem, i, attr) : val);
				return elem;
			} else {
				return elem[attr];
			}
		},
		compute: function(value, vary) {
			var origin = parseInt(value.replace('px', ''));
			var num = parseInt(vary.substr(2));
			if (vary[0] === '+') {
				return origin + num + 'px';
			} else if (vary[0] === '-') {
				return origin - num + 'px';
			}
		},
		parseHTML: function(data) {
			var rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]+))$/;
			if (!rquickExpr.test(data)) {
				if (data&&typeof data === 'string') {
					return [document.createTextNode( data )];
				} else {
					return [];
				}
			}
			var parsed = buildFragment( [ data ] );

			return sQuery.merge( [], parsed.childNodes );
		},
		trim: function(text) {
			var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
			return text == null ? '' : (text + '').replace(rtrim, '');
		},
		isWindow: function(obj) {
			return obj != null && obj === obj.window;
		},
		map: function(elems, callback, arg) {
			var length, value, i = 0, ret = [];
			if (sQuery.isArraylike(elems)) {
				length = elems.length;
				for (;i < length; i++) {
					value = callback(elems[i], i, arg);
					ret.push(value);
				}
				return [].concat.apply([], ret);
			}

		},
		dir: function(elem, dir, until) {
			var matched = [];
			while ((elem = elem[dir])&& elem.nodeType !== 9) {
				if (sQuery(elem).is(until)) {
					break;
				}
				if (elem.nodeType === 1) {
					matched.push( elem );
				}
			}
			return matched;
		},
		isFunction: function(obj) {
			return sQuery.type(obj) === 'function';
		},
		noop: function() {}
	});
	sQuery.find = Select;
	sQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
		class2type[ "[object " + name + "]" ] = name.toLowerCase();
	});
	// var class2type = {
	// 	'[object Boolean]': 'boolean',
	// 	'[object Number]': 'number',
	// };
	var _ = sQuery;
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
			if ( !old&&context&&context.removeAttribute ) {
				context.removeAttribute("id");
			}
			return results;
		}
		return Select.select(selector, context, results);
	}
	Select.extend = sQuery.extend;
	Select.extend({
		select: function(selector, context, results) {

		}
	});
	var Se = Select;
	var rootsQuery = sQuery(document);

	window._ = window.sQuery = sQuery;
	return sQuery;
});