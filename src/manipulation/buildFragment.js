define(['./getAll'], function(getAll) {
    // var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi;
    var rhtml = /<|&#?\w+;/;
    var rtagName = /<([a-z][^\/\0>\x20\t\r\n\f]+)/i;
    var rscriptType = /^$|\/(?:java|ecma)script/i;
    var wrapMap = {

        // Support: IE9
        option: [ 1, "<select multiple='multiple'>", "</select>" ],

        // XHTML parsers do not magically insert elements in the
        // same way that tag soup parsers do. So we cannot shorten
        // this by omitting <tbody> or other required elements.
        thead: [ 1, "<table>", "</table>" ],
        col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
        tr: [ 2, "<table><tbody>", "</tbody></table>" ],
        td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

        _default: [ 0, "", "" ]
    };

    // Support: IE9
    wrapMap.optgroup = wrapMap.option;

    wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
    wrapMap.th = wrapMap.td;
    function buildFragment(elems, context, scripts) {
        
        var fragment, tmp, i = 0,
            l = elems.length,
            elem,
            nodes = [],
            tag,
            wrap;
        fragment = context.createDocumentFragment();
        tmp = fragment.appendChild(document.createElement("div"));
        for (; i < l; i++) {
            elem = elems[i];
            if (elem || elem === 0) {
                if (!rhtml.test(elem)) {
                    nodes.push(context.createTextNode(elem));
                } else {
                    tmp = tmp || fragment.appendChild(context.createElement('div'));
                    //support xhtml
                    tag = (rtagName.exec(elem)||['', ''])[1].toLowerCase();
                    wrap = wrapMap[tag]||wrapMap._default;
                    tmp.innerHTML = wrap[1] + sQuery.htmlPrefilter(elem) + wrap[2];

                    j = wrap[0];
                    while(j--) {
                        tmp = tmp.lastChild;
                    }
                    sQuery.merge(nodes, tmp.childNodes);
                    tmp = fragment.firstChild;
                    tmp.textContent = '';
                }
            }

        }
        fragment.textContent = "";
        i = 0;
        while ((elem = nodes[i++])) {
            tmp = getAll(fragment.appendChild(elem), 'script');
            if (scripts) {
                j = 0;
                while ((elem = tmp[j++])) {
                    if (rscriptType.test(elem.type||'')) {
                        scripts.push(elem);
                    }
                }
            }
        }
        return fragment;
    }

    return buildFragment;
})
