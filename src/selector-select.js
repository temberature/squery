define(['./core'], function(sQuery) {

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
})