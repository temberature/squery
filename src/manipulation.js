define( ['./core',
    './var/concat',
    './manipulation/buildFragment',
    './manipulation/getAll',
    './core/access',
    './data/var/dataPriv',
    './data/var/dataUser'
], function (sQuery, concat, buildFragment, getAll, access, dataPriv, dataUser) {
    var
        rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi;
    var rscriptType = /^$|\/(?:java|ecma)script/i;

    function manipulationTarget(elem, content) {
        if (sQuery.nodeName(elem, 'table') &&
            sQuery.nodeName(content.nodeType !== 11 ? content : content.firstChild, 'tr')) {
            return elem.getElementsByName('tbody')[0] || elem;
        }
        return elem;
    }

    function domManip(collection, args, callback, ignored) {
        var fragment, first,
        	l = collection.length;
        args = concat.apply( [], args );

        if ( l ) {
        	fragment = buildFragment( args, collection[ 0 ].ownerDocument, false, collection, ignored );
        	first = fragment.firstChild;
        	if ( fragment.childNodes.length === 1 ) {
                fragment = first;
            }
            if ( first || ignored ) {}
        }
    }

    function cloneCopyEvent(src, dest) {
        if (dest.nodeType !== 1) {
            return;
        }
        if (dataPriv.hasData(src)) {
            pdataOld = dataPriv.access(src);
            pdataCur = dataPriv.set(dest, pdataOld);
            events = pdataOld.events;
            if (events) {
                delete pdataCur.handle;
                pdataCur.events = {};
                for (type in events) {
                    for (i = 0, l = events[type].length; i < l; i++) {
                        sQuery.event.add(dest, type, events[type][i]);
                    }
                }
            }
        }
        if (dataUser.hasData(src)) {
            udataOld = dataUser.access(src);
            udataCur = sQuery.extend({}, udataOld);
            dataUser.set(dest, udataCur);
        }
    }

    sQuery.extend({
        htmlPrefilter: function (html) {
            return html.replace(rxhtmlTag, '<$1></$2>');
        },
        clone: function (elem, dataAndEvents, deepDataAndEvents) {
            var srcElements, destElements, i, l,
                clone = elem.cloneNode(true);
            if (dataAndEvents) {
                if (deepDataAndEvents) {
                    srcElements = srcElements || getAll(elem);
                    destElements = destElements || getAll(clone);
                    for (i = 0, l = srcElements.length; i < l; i++) {
                        cloneCopyEvent(srcElements[i], destElements[i]);
                    }
                } else {
                    cloneCopyEvent(elem, clone);
                }
            }
            destElements = getAll(clone, 'script');
            if (destElements.length > 0) {
                setGlobalEval(destElements, !inpage && getAll(elem, 'script'));
            }
            return clone;
        }
    })
    sQuery.fn.extend({
        remove: function () {
            return this.each(function () {
                this.parentNode.removeChild(this);
            })
        },
        // append: function () {
        //     var l = this.length,
        //         args = arguments,
        //         collection = this,
        //         i = 0,
        //         node, elem, scripts, hasScripts, doc;
        //     if (l) {
        //         fragment = buildFragment(args, collection[0].ownerDocument, false);
        //         scripts = getAll(fragment.firstChild, 'script');
        //         hasScripts = scripts.length;
        //         for (; i < l; i++) {
        //             node = fragment;
        //             elem = collection[i];
        //             if (elem.nodeType === 1 || elem.nodeType === 11 || elem.nodeType === 9) {
        //                 elem.appendChild(node);
        //             }
        //         }
        //         if (scripts.length) {
        //             doc = scripts[0].ownerDocument;
        //             for (i = 0; i < hasScripts; i++) {
        //                 node = scripts[i];
        //                 if (rscriptType.test(node.type || '')) {
        //                     if (node.src) {
        //
        //                     } else {
        //                         sQuery.globalEval(node.textContent, doc);
        //                     }
        //                 }
        //             }
        //         }
        //     }
        //     return collection;
        // },
        text: function (value) {
            return access(this, function (value) {
                return value === undefined ?
                    jQuery.text(this) :
                    this.each(function () {
                        if (this.nodeType === 1 || this.nodeType === 11 || this.ndoeType === 9) {
                            this.textContent = value;
                        }
                    })
            }, null, value, arguments.length);
        },
        append: function () {
            return domManip(this, arguments, function (elem) {
                if (this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9) {
                    var target = manipulationTarget(this, elem);
                    target.appendChild(elem);
                }
            })
        },
        clone: function (dataAndEvents, deepDataAndEvents) {
            dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
            deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;
            return this.map( function () {
                return sQuery.clone( this, dataAndEvents, deepDataAndEvents );
            })
        }
    })
})
