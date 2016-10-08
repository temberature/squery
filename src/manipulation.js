define(['./core', './manipulation/buildFragment', './manipulation/getAll'], function(sQuery, buildFragment, getAll) {
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
})
