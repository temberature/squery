define(['./core'], function ( sQuery ) {
    "use strict";

    sQuery.extend({
        text: function (elem) {
            var node,
                nodeType = elem.nodeType,
                i = 0,
                ret = '';

            if ( !nodeType ) {
                while ( ( node = elem[ i ++ ] ) ) {
                    ret += sQuery.text( node );
                }
            } else if ( nodeType === 1 || nodeType  === 9 || nodeType === 11 ) {
                return elem.textContent;
            } else if ( nodeType === 3 || nodeType === 4 ) {
                return elem.nodeValue;
            }

            return ret;
        }
    })
});