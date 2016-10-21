define(['../core'], function (sQuery) {
    "use strict";

    sQuery.extend({
        valHooks: {
            select: {
                get: function (elem) {
                    var i, option, value,
                        index = elem.selectedIndex,
                        one = elem.type === 'select-one',
                        options = elem.options,
                        max = one ? index + 1 : options.length,
                        values = one ? null : [];

                    if (index < 0) {
                        i = max;
                    } else {
                        i = one ? index : 0;
                    }
                    for( ; i < max; i++ ) {
                        option = options[i];
                        if (  option.selected &&
                            !option.disabled &&
                            ( !option.parentNode.disabled ||
                                !sQuery.nodeName( option.parentNode, 'optgroup' ) )  ) {
                            value = sQuery( option ).val();
                            if ( one ) {
                                return value;
                            }
                            values.push( value );
                        }
                    }
                    return values;
                },
                set: function (elem) {

                }
            }
        }
    });
    sQuery.fn.extend({
        val: function (value) {
            var ret, elem = this[0], hooks;
            if ( !arguments.length ) {
                if (elem) {
                    hooks = sQuery.valHooks[elem.type] ||
                        sQuery.valHooks[elem.nodeName.toLowerCase()];
                    if (hooks &&
                        'get' in hooks &&
                        ( ret = hooks.get(elem, 'value') ) !== undefined) {
                        return ret;
                    }
                    ret = elem.value;
                    return ret == null ? '' : ret;
                }
                return;
            }

            return this.each(function (i) {
                var val;
                if ( this.nodeType !== 1 ) {
                    return;
                }
                val = sQuery.isFunction( value ) ? value.call( this, i, sQuery( this ).val() ) : value;
                if (hooks &&
                    'set' in hooks &&
                    ( ret = hooks.set(elem, val, 'value') ) !== undefined) {
                    return ret;
                }
                this.value = val;
            });

        },
    });
})