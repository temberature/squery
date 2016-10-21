define(['../core'], function (sQuery) {
    "use strict"

    var access = function (elems, fn, key, value, chainable, emptyGet, raw) {
        var i = 0, len = elems.length, bulk = key == null;
        if (sQuery.type(key) === 'object') {
            chainable = true;
            for ( i in key) {
                access(elems, fn, i, key[i], true, emptyGet, raw);
            }
        } else if (value !== undefined ) {
            chainable = true;
            if (!sQuery.isFunction(value)) {
                raw = true;
            }
            if ( bulk ) {

            }
            if ( fn ) {
                for ( ; i < len; i++) {
                    fn( elems[i], key, raw ? value : value.call( elems[i], i, fn(elems[i], key) ) )
                }
            }
        }
        if ( chainable ) {
            return elems;
        }
        if ( bulk ) {
            return fn.call( elems );
        }
        return len ? fn( elems[0], key ) : emptyGet;
    }
    return access;
})