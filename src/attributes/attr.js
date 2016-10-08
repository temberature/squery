define(['../core'], function(sQuery) {
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
})
