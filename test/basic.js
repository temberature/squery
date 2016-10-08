function q() {
	var r = [],
		i = 0,
		node;

	for ( ; i < arguments.length; i++ ) {
		if (node = document.getElementById( arguments[ i ] )) {
			r.push( node );
		}
		
	}
	return r;
}
QUnit.assert.t = function( a, b, c ) {
	var f = sQuery( b ).get(),
		s = "",
		i = 0;

	for ( ; i < f.length; i++ ) {
		s += ( s && "," ) + '"' + f[ i ].id + '"';
	}

	this.deepEqual( f, q.apply( q, c ), a + " (" + b + ")" );
};
QUnit.module( "basic");
if ( sQuery.ajax ) {
QUnit.test( "ajax", function( assert ) {
	assert.expect( 4 );

	var done = sQuery.map( new Array( 3 ), function() { return assert.async(); } );

	sQuery.ajax( {
		type: "GET",
		url: url( "data/name.php?name=foo" ),
		success: function( msg ) {
			assert.strictEqual( msg, "bar", "Check for GET" );
			done.pop()();
		}
	} );

	sQuery.ajax( {
		type: "POST",
		url: url( "data/name.php" ),
		data: "name=peter",
		success: function( msg ) {
			assert.strictEqual( msg, "pan", "Check for POST" );
			done.pop()();
		}
	} );

	sQuery( "#first" ).load( url( "data/name.html" ), function() {
		assert.ok( /^ERROR/.test( sQuery( "#first" ).text() ),
			"Check if content was injected into the DOM" );
		done.pop()();
	} );
} );
}

QUnit.test( "attributes", function( assert ) {
	assert.expect( 6 );

	var a = sQuery( "<a/>" ).appendTo( "#qunit-fixture" ),
		input = sQuery( "<input/>" ).appendTo( "#qunit-fixture" );

	assert.strictEqual( a.attr( "foo", "bar" ).attr( "foo" ), "bar", ".attr getter/setter" );
	assert.strictEqual( a.removeAttr( "foo" ).attr( "foo" ), null, ".removeAttr" );//undefined
	assert.strictEqual( a.prop( "href", "#5" ).prop( "href" ),
		location.href.replace( /\#.*$/, "" ) + "#5",
		".prop getter/setter" );
	a.addClass( "abc def ghj" ).removeClass( "def ghj" );
	assert.strictEqual( a.hasClass( "abc" ), true, ".(add|remove|has)Class, class present" );
	assert.strictEqual( a.hasClass( "def" ), false, ".(add|remove|has)Class, class missing" );

	assert.strictEqual( input.val( "xyz" ).val(), "xyz", ".val getter/setter" );
} );

if ( sQuery.fn.css ) {
QUnit.test( "css", function( assert ) {
	assert.expect( 1 );

	var div = sQuery( "<div/>" ).appendTo( "#qunit-fixture" );

	assert.strictEqual( div.css( "width", "50px" ).css( "width" ), "50px", ".css getter/setter" );
} );
}

if ( sQuery.fn.show && sQuery.fn.hide ) {
QUnit.test( "show/hide", function( assert ) {
	assert.expect( 2 );

	var div = sQuery( "<div/>" ).appendTo( "#qunit-fixture" );

	div.hide();
	assert.strictEqual( div.css( "display" ), "none", "div hidden" );
	div.show();
	assert.strictEqual( div.css( "display" ), "block", "div shown" );
} );
}

QUnit.test( "core", function( assert ) {
	// assert.expect( 28 );

	var elem = sQuery( "<div></div><span></span>" );

	assert.strictEqual( elem.length, 2, "Correct number of elements" );
	assert.strictEqual( sQuery.trim( "  hello   " ), "hello", "sQuery.trim" );

	assert.strictEqual( sQuery.type( null ), "null", "sQuery.type(null)" );
	assert.strictEqual( sQuery.type( undefined ), "undefined", "sQuery.type(undefined)" );
	assert.strictEqual( sQuery.type( "a" ), "string", "sQuery.type(String)" );

	// assert.ok( sQuery.isPlainObject( { "a": 2 } ), "sQuery.isPlainObject(object)" );
	// assert.ok( !sQuery.isPlainObject( "foo" ), "sQuery.isPlainObject(String)" );

	assert.ok( sQuery.isFunction( sQuery.noop ), "sQuery.isFunction(sQuery.noop)" );
	assert.ok( !sQuery.isFunction( 2 ), "sQuery.isFunction(Number)" );

	// assert.ok( sQuery.isNumeric( "-2" ), "sQuery.isNumeric(String representing a number)" );
	// assert.ok( !sQuery.isNumeric( "" ), "sQuery.isNumeric(\"\")" );

	// assert.ok( sQuery.isXMLDoc( sQuery.parseXML(
	// 	"<?xml version='1.0' encoding='UTF-8'?><foo bar='baz'></foo>"
	// ) ), "sQuery.isXMLDoc" );

	assert.ok( sQuery.isWindow( window ), "sQuery.isWindow(window)" );
	assert.ok( !sQuery.isWindow( 2 ), "sQuery.isWindow(Number)" );

	// assert.strictEqual( sQuery.inArray( 3, [ "a", 6, false, 3, {} ] ), 3, "sQuery.inArray - true" );
	// assert.strictEqual(
	// 	sQuery.inArray( 3, [ "a", 6, false, "3", {} ] ),
	// 	-1,
	// 	"sQuery.inArray - false"
	// );

	assert.strictEqual( elem.get( 1 ), elem[ 1 ], ".get" );
	assert.strictEqual( elem.first()[ 0 ], elem[ 0 ], ".first" );
	assert.strictEqual( elem.last()[ 0 ], elem[ 1 ], ".last" );

	assert.deepEqual( sQuery.map( [ "a", "b", "c" ], function( v, k ) {
		return k + v;
	} ), [ "0a", "1b", "2c" ], "sQuery.map" );

	assert.deepEqual( sQuery.merge( [ 1, 2 ], [ "a", "b" ] ), [ 1, 2, "a", "b" ], "sQuery.merge" );

	// assert.deepEqual( sQuery.grep( [ 1, 2, 3 ], function( value ) {
	// 	return value % 2 !== 0;
	// } ), [ 1, 3 ], "sQuery.grep" );

	assert.deepEqual( sQuery.extend( { a: 2 }, { b: 3 } ), { a: 2, b: 3 }, "sQuery.extend" );

	sQuery.each( [ 0, 2 ], function( k, v ) {
		assert.strictEqual( k * 2, v, "sQuery.each" );
	} );

	assert.deepEqual( sQuery.makeArray( { 0: "a", 1: "b", 2: "c", length: 3 } ),
		[ "a", "b", "c" ], "sQuery.makeArray" );

	assert.strictEqual( sQuery.parseHTML( "<div></div><span></span>" ).length,
		2, "sQuery.parseHTML" );

	// assert.deepEqual( sQuery.parseJSON( "{\"a\": 2}" ), { a: 2 }, "sQuery.parseJON" );
} );

// QUnit.test( "data", function( assert ) {
// 	assert.expect( 4 );

// 	var elem = sQuery( "<div data-c='d'/>" ).appendTo( "#qunit-fixture" );

// 	assert.ok( !sQuery.hasData( elem[ 0 ] ), "sQuery.hasData - false" );
// 	assert.strictEqual( elem.data( "a", "b" ).data( "a" ), "b", ".data getter/setter" );
// 	assert.strictEqual( elem.data( "c" ), "d", ".data from data-* attributes" );
// 	assert.ok( sQuery.hasData( elem[ 0 ] ), "sQuery.hasData - true" );
// } );

QUnit.test( "dimensions", function( assert ) {
	assert.expect( 3 );

	var elem = sQuery(
		"<div style='margin: 10px; padding: 7px; border: 2px solid black;' /> "
	).appendTo( "#qunit-fixture" );

	assert.strictEqual( elem.width( 50 ).width(), 50, ".width getter/setter" );
	assert.strictEqual( elem.innerWidth(), 64, ".innerWidth getter" );
	assert.strictEqual( elem.outerWidth(), 68, ".outerWidth getter" );
} );

QUnit.test( "event", function( assert ) {
	assert.expect( 1 );

	var elem = jQuery( "<div/>" ).appendTo( "#qunit-fixture" );

	elem
		.on( "click", function() {
			assert.ok( false, "click should not fire" );
		} )
		.off( "click" )
		.trigger( "click" )
		.on( "click", function() {
			assert.ok( true, "click should fire" );
		} )
		.trigger( "click" );
} );

QUnit.test( "manipulation", function( assert ) {
	// assert.expect( 5 );

	var child,
		elem1 = jQuery( "<div><span></span></div>" ).appendTo( "#qunit-fixture" ),
		elem2 = jQuery( "<div/>" ).appendTo( "#qunit-fixture" );

	assert.strictEqual( elem1.text( "foo" ).text(), "foo", ".html getter/setter" );

	assert.strictEqual(

		// Support: IE 8 only
		// IE 8 prints tag names in upper case.
		elem1.html( "<span/>" ).html().toLowerCase(),
		"<span></span>",
		".html getter/setter"
	);

	assert.strictEqual( elem1.append( elem2 )[ 0 ].childNodes[ 1 ], elem2[ 0 ], ".append" );
	assert.strictEqual( elem1.prepend( elem2 )[ 0 ].childNodes[ 0 ], elem2[ 0 ], ".prepend" );

	// child = elem1.find( "span" );
	// child.after( "<a/>" );
	// child.before( "<b/>" );

	// assert.strictEqual(

	// 	// Support: IE 8 only
	// 	// IE 8 prints tag names in upper case.
	// 	elem1.html().toLowerCase(),
	// 	"<div></div><b></b><span></span><a></a>",
	// 	".after/.before"
	// );
} );

QUnit.test( "offset", function( assert ) {
	assert.expect( 3 );

	var parent = sQuery( "<div style='position:fixed;top:20px;'/>" ).appendTo( "#qunit-fixture" ),
		elem = sQuery( "<div style='position:absolute;top:5px;'/>" ).appendTo( parent );

	assert.strictEqual( elem.offset().top, 25, ".offset getter" );
	assert.strictEqual( elem.position().top, 5, ".position getter" );
	assert.strictEqual( elem.offsetParent()[ 0 ], parent[ 0 ], ".offsetParent" );
} );

QUnit.test( "selector", function( assert ) {
	assert.expect( 2 );

	var elem = sQuery( "<div><span class='a'></span><span class='b'><a></a></span></div>" )
		.appendTo( "#qunit-fixture" );

	assert.strictEqual( elem.find( ".a a" ).length, 0, ".find - no result" );
	assert.strictEqual( elem.find( "span.b a" )[ 0 ].nodeName, "A", ".find - one result" );
} );

// QUnit.test( "serialize", function( assert ) {
// 	assert.expect( 2 );

// 	var params = { "someName": [ 1, 2, 3 ], "regularThing": "blah" };
// 	assert.strictEqual( sQuery.param( params ),
// 		"someName%5B%5D=1&someName%5B%5D=2&someName%5B%5D=3&regularThing=blah",
// 		"sQuery.param" );

// 	assert.strictEqual( sQuery( "#form" ).serialize(),
// 		"action=Test&radio2=on&check=on&hidden=&foo%5Bbar%5D=&name=name&search=search" +
// 		"&select1=&select2=3&select3=1&select3=2&select5=3",
// 		"form serialization as query string" );
// } );

QUnit.test( "traversing", function( assert ) {
	assert.expect( 12 );

	var elem = sQuery( "<div><a><b><em></em></b></a><i></i><span></span>foo</div>" )
		.appendTo( "#qunit-fixture" );

	assert.strictEqual( elem.find( "em" ).parent()[ 0 ].nodeName, "B", ".parent" );
	assert.strictEqual( elem.find( "em" ).parents()[ 1 ].nodeName, "A", ".parents" );
	assert.strictEqual( elem.find( "em" ).parentsUntil( "div" ).length, 2, ".parentsUntil" );
	assert.strictEqual( elem.find( "i" ).next()[ 0 ].nodeName, "SPAN", ".next" );
	assert.strictEqual( elem.find( "i" ).prev()[ 0 ].nodeName, "A", ".prev" );
	assert.strictEqual( elem.find( "a" ).nextAll()[ 1 ].nodeName, "SPAN", ".nextAll" );
	assert.strictEqual( elem.find( "span" ).prevAll()[ 1 ].nodeName, "A", ".prevAll" );
	assert.strictEqual( elem.find( "a" ).nextUntil( "span" ).length, 1, ".nextUntil" );
	assert.strictEqual( elem.find( "span" ).prevUntil( "a" ).length, 1, ".prevUntil" );
	assert.strictEqual( elem.find( "i" ).siblings().length, 2, ".siblings" );
	assert.strictEqual( elem.children()[ 2 ].nodeName, "SPAN", ".children" );
	assert.strictEqual( elem.contents()[ 3 ].nodeType, 3, ".contents" );
} );

QUnit.test( "wrap", function( assert ) {
	assert.expect( 3 );

	var elem = sQuery( "<div><a><b></b></a><a></a></div>" );

	elem.find( "b" ).wrap( "<span>" );

	assert.strictEqual(

		// Support: IE 8 only
		// IE 8 prints tag names in upper case.
		elem.html().toLowerCase(),
		"<a><span><b></b></span></a><a></a>",
		".wrap"
	);

	elem.find( "span" ).wrapInner( "<em>" );

	assert.strictEqual(

		// Support: IE 8 only
		// IE 8 prints tag names in upper case.
		elem.html().toLowerCase(),
		"<a><span><em><b></b></em></span></a><a></a>",
		".wrapInner"
	);

	elem.find( "a" ).wrapAll( "<i>" );

	assert.strictEqual(

		// Support: IE 8 only
		// IE 8 prints tag names in upper case.
		elem.html().toLowerCase(),
		"<i><a><span><em><b></b></em></span></a><a></a></i>",
		".wrapAll"
	);

} );

