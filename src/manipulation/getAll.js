define(function() {
	function getAll(context, tag) {
		var ret = typeof context.getElementsByTagName !== 'undefined' ? context.getElementsByTagName(tag||'*') : [];
		return sQuery.nodeName(context, tag) ? sQuery.merge([context], ret) : ret;		
	}
	return getAll;
})