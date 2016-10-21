define(['../core', '../core/access'], function(sQuery, access) {
	sQuery.extend({
		attr: function(elem, name, value) {
			var ret;
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
			ret =  sQuery.find.attr(elem, name);
			return ret == null ? undefined : ret;
		}
	})
	sQuery.fn.extend({
		attr: function(name, val) {
			return access(this, sQuery.attr, name, val, arguments.length > 1);
		},
	})
})
