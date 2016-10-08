define(['../core', '../manipulation/buildFragment'], function(sQuery, buildFragment) {
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
})