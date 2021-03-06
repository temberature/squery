define( [
    '../data/var/dataPriv'
], function (dataPriv) {
    "use strict";

    function setGlobalEval(elems, refElements) {
        var i = 0,
            l = elems.length;

        for ( ; i < l; i++) {
            dataPriv.set(
                elems[ i ],
                'globalEval',
                !refElements || dataPriv.get( refElements[ i ], 'globalEval' )
            );
        }
    }

    return setGlobalEval;
});