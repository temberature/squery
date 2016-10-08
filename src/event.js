define(['./core'], function(sQuery) {
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

})