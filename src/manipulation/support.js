define( [
    '../var/document',
    '../var/support'
], function (document, support) {
    "use strict"

    ( function () {
        var fragment = document.createDocumentFragment(),
            div = fragment.appendChild( document.createElement( 'div' ) ),
            input = document.createElement( 'input' );

        input.setAttribute( 'type', 'radio' );
        input.setAttribute( 'checked', 'checked' );
        input.setAttribute( 'name', 't' );
        div.appendChild(input);
        support.checkClone = div.cloneNode(true).lastChild.checked;
        // div.in
    })
})