define(function() {
	function buildFragment(elems) {
		var elem;
		var rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([a-z][^\/\0>\x20\t\r\n\f]*)[^>]*)\/>/gi;
		var fragment = document.createDocumentFragment();
		var tmp = fragment.appendChild( document.createElement( "div" ) )
		tmp.innerHTML = elems[0];
		fragment.textContent = "";
		while (elem = tmp.childNodes[0]) {
			fragment.appendChild(elem);
		}
		return fragment;
	}

	return buildFragment;
})