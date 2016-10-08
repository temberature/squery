( function() {

if ( !sQuery.fn.offset ) {
	return;
}

var supportsScroll, supportsFixedPosition,
	forceScroll = sQuery( "<div/>" ).css( { width: 2000, height: 2000 } ),
	checkSupport = function() {

		// Only run once
		checkSupport = false;

		var checkFixed = sQuery( "<div/>" ).css( { position: "fixed", top: "20px" } ).appendTo( "#qunit-fixture" );

		// Must append to body because #qunit-fixture is hidden and elements inside it don't have a scrollTop
		forceScroll.appendTo( "body" );
		window.scrollTo( 200, 200 );
		supportsScroll = document.documentElement.scrollTop || document.body.scrollTop;
		forceScroll.detach();

		supportsFixedPosition = checkFixed[ 0 ].offsetTop === 20;
		checkFixed.remove();
	};

QUnit.module( "offset", { setup: function() {
	if ( typeof checkSupport === "function" ) {
		checkSupport();
	}

	// Force a scroll value on the main window to ensure incorrect results
	// if offset is using the scroll offset of the parent window
	forceScroll.appendTo( "body" );
	window.scrollTo( 1, 1 );
	forceScroll.detach();
}} );

/*
	Closure-compiler will roll static methods off of the sQuery object and so they will
	not be passed with the sQuery object across the windows. To differentiate this, the
	testIframe callbacks use the "$" symbol to refer to the sQuery object passed from
	the iframe window and the "sQuery" symbol is used to access any static methods.
*/

QUnit.test( "empty set", function( assert ) {
	assert.expect( 2 );
	assert.strictEqual( sQuery().offset(), undefined, "offset() returns undefined for empty set (#11962)" );
	assert.strictEqual( sQuery().position(), undefined, "position() returns undefined for empty set (#11962)" );
} );

QUnit.test( "disconnected element", function( assert ) {
	assert.expect( 2 );

	var result = sQuery( document.createElement( "div" ) ).offset();

	// These tests are solely for master/compat consistency
	// Retrieving offset on disconnected/hidden elements is not officially
	// valid input, but will return zeros for back-compat
	assert.equal( result.top, 0, "Retrieving offset on disconnected elements returns zeros (gh-2310)" );
	assert.equal( result.left, 0, "Retrieving offset on disconnected elements returns zeros (gh-2310)" );
} );

QUnit.test( "hidden (display: none) element", function( assert ) {
	assert.expect( 2 );

	var node = sQuery( "<div style='display: none' />" ).appendTo( "#qunit-fixture" ),
		result = node.offset();

	node.remove();

	// These tests are solely for master/compat consistency
	// Retrieving offset on disconnected/hidden elements is not officially
	// valid input, but will return zeros for back-compat
	assert.equal( result.top, 0, "Retrieving offset on hidden elements returns zeros (gh-2310)" );
	assert.equal( result.left, 0, "Retrieving offset on hidden elements returns zeros (gh-2310)" );
} );

// testIframe( "offset/absolute", "absolute", function( $, iframe, document, assert ) {s
// } );

// testIframe( "offset/absolute", "absolute", function( $, window, document, assert ) {s
// } );

// testIframe( "offset/relative", "relative", function( $, window, document, assert ) {s
// } );

// testIframe( "offset/static", "static", function( $, window, document, assert ) {s
// } );

// testIframe( "offset/fixed", "fixed", function( $, window, document, assert ) {s
// } );

// testIframe( "offset/table", "table", function( $, window, document, assert ) {s
// } );

// testIframe( "offset/scroll", "scroll", function( $, win, doc, assert ) {s
// } );

// testIframe( "offset/body", "body", function( $, window, document, assert ) {s
// } );

QUnit.test( "chaining", function( assert ) {
	assert.expect( 3 );

	var coords = { "top":  1, "left":  1 };
	assert.equal( sQuery( "#absolute-1" ).offset( coords ).jquery, sQuery.fn.jquery, "offset(coords) returns sQuery object" );
	assert.equal( sQuery( "#non-existent" ).offset( coords ).jquery, sQuery.fn.jquery, "offset(coords) with empty sQuery set returns sQuery object" );
	assert.equal( sQuery( "#absolute-1" ).offset( undefined ).jquery, sQuery.fn.jquery, "offset(undefined) returns sQuery object (#5571)" );
} );

QUnit.test( "offsetParent", function( assert ) {
	assert.expect( 13 );

	var body, header, div, area;

	body = sQuery( "body" ).offsetParent();
	assert.equal( body.length, 1, "Only one offsetParent found." );
	assert.equal( body[ 0 ], document.documentElement, "The html element is the offsetParent of the body." );

	header = sQuery( "#qunit" ).offsetParent();
	assert.equal( header.length, 1, "Only one offsetParent found." );
	assert.equal( header[ 0 ], document.documentElement, "The html element is the offsetParent of #qunit." );

	div = sQuery( "#nothiddendivchild" ).offsetParent();
	assert.equal( div.length, 1, "Only one offsetParent found." );
	assert.equal( div[ 0 ], document.getElementById( "qunit-fixture" ), "The #qunit-fixture is the offsetParent of #nothiddendivchild." );

	sQuery( "#nothiddendiv" ).css( "position", "relative" );

	div = sQuery( "#nothiddendivchild" ).offsetParent();
	assert.equal( div.length, 1, "Only one offsetParent found." );
	assert.equal( div[ 0 ], sQuery( "#nothiddendiv" )[ 0 ], "The div is the offsetParent." );

	div = sQuery( "body, #nothiddendivchild" ).offsetParent();
	assert.equal( div.length, 2, "Two offsetParent found." );
	assert.equal( div[ 0 ], document.documentElement, "The html element is the offsetParent of the body." );
	assert.equal( div[ 1 ], sQuery( "#nothiddendiv" )[ 0 ], "The div is the offsetParent." );

	area = sQuery( "#imgmap area" ).offsetParent();
	assert.equal( area[ 0 ], document.documentElement, "The html element is the offsetParent of the body." );

	div = sQuery( "<div>" ).css( { "position": "absolute" } ).appendTo( "body" );
	assert.equal( div.offsetParent()[ 0 ], document.documentElement, "Absolutely positioned div returns html as offset parent, see #12139" );

	div.remove();
} );

QUnit.test( "fractions (see #7730 and #7885)", function( assert ) {
	assert.expect( 2 );

	sQuery( "body" ).append( "<div id='fractions'/>" );

	var result,
		expected = { "top": 1000, "left": 1000 },
		div = sQuery( "#fractions" );

	div.css( {
		"position": "absolute",
		"left": "1000.7432222px",
		"top": "1000.532325px",
		"width": 100,
		"height": 100
	} );

	div.offset( expected );

	result = div.offset();

	// Support: Chrome 45-46+
	// In recent Chrome these values differ a little.
	assert.ok( Math.abs( result.top - expected.top ) < 0.25, "Check top within 0.25 of expected" );
	assert.equal( result.left, expected.left, "Check left" );

	div.remove();
} );

QUnit.test( "iframe scrollTop/Left (see gh-1945)", function( assert ) {
	assert.expect( 2 );

	var ifDoc = sQuery( "#iframe" )[ 0 ].contentDocument;

	// Mobile Safari and Android 2.3 resize the iframe by its content
	// meaning it's not possible to scroll the iframe only its parent element.
	// It seems (not confirmed) in android 4.0 it's not possible to scroll iframes from the code.
	if ( /iphone os/i.test( navigator.userAgent ) ||
	    /android 2\.3/i.test( navigator.userAgent ) ||
	    /android 4\.0/i.test( navigator.userAgent ) ) {
		assert.equal( true, true, "Can't scroll iframes in this environment" );
		assert.equal( true, true, "Can't scroll iframes in this environment" );

	} else {

		// Tests scrollTop/Left with iframes
		sQuery( "#iframe" ).css( "width", "50px" ).css( "height", "50px" );
		ifDoc.write( "<div style='width: 1000px; height: 1000px;'></div>" );

		sQuery( ifDoc ).scrollTop( 200 );
		sQuery( ifDoc ).scrollLeft( 500 );

		assert.equal( sQuery( ifDoc ).scrollTop(), 200, "$($('#iframe')[0].contentDocument).scrollTop()" );
		assert.equal( sQuery( ifDoc ).scrollLeft(), 500, "$($('#iframe')[0].contentDocument).scrollLeft()" );
	}
} );

} )();
