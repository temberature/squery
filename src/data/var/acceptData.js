define( function () {

"use strict";

return function (owner) {
    return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};

} );