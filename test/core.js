function q() {
	var r = [],
		i = 0;

	for ( ; i < arguments.length; i++ ) {
		r.push( document.getElementById( arguments[ i ] ) );
	}
	return r;
}
QUnit.module( "core");

QUnit.test( "Basic requirements", function( assert ) {
	assert.expect( 7 );
	assert.ok( Array.prototype.push, "Array.push()" );
	assert.ok( Function.prototype.apply, "Function.apply()" );
	assert.ok( document.getElementById, "getElementById" );
	assert.ok( document.getElementsByTagName, "getElementsByTagName" );
	assert.ok( RegExp, "RegExp" );
	assert.ok( sQuery, "sQuery" );
	assert.ok( $, "$" );
} );


QUnit.test( "type", function( assert ) {
	assert.expect( 29 );

	assert.equal( sQuery.type( null ), "null", "null" );
	assert.equal( sQuery.type( undefined ), "undefined", "undefined" );
	assert.equal( sQuery.type( true ), "boolean", "Boolean" );
	assert.equal( sQuery.type( false ), "boolean", "Boolean" );
	assert.equal( sQuery.type( Boolean( true ) ), "boolean", "Boolean" );
	assert.equal( sQuery.type( 0 ), "number", "Number" );
	assert.equal( sQuery.type( 1 ), "number", "Number" );
	assert.equal( sQuery.type( Number( 1 ) ), "number", "Number" );
	assert.equal( sQuery.type( "" ), "string", "String" );
	assert.equal( sQuery.type( "a" ), "string", "String" );
	assert.equal( sQuery.type( String( "a" ) ), "string", "String" );
	assert.equal( sQuery.type( {} ), "object", "Object" );
	assert.equal( sQuery.type( /foo/ ), "regexp", "RegExp" );
	assert.equal( sQuery.type( new RegExp( "asdf" ) ), "regexp", "RegExp" );
	assert.equal( sQuery.type( [ 1 ] ), "array", "Array" );
	assert.equal( sQuery.type( new Date() ), "date", "Date" );
	assert.equal( sQuery.type( new Function( "return;" ) ), "function", "Function" );
	assert.equal( sQuery.type( function() {} ), "function", "Function" );
	assert.equal( sQuery.type( new Error() ), "error", "Error" );
	assert.equal( sQuery.type( window ), "object", "Window" );
	assert.equal( sQuery.type( document ), "object", "Document" );
	assert.equal( sQuery.type( document.body ), "object", "Element" );
	assert.equal( sQuery.type( document.createTextNode( "foo" ) ), "object", "TextNode" );
	assert.equal( sQuery.type( document.getElementsByTagName( "*" ) ), "object", "NodeList" );

	// Avoid Lint complaints
	var MyString = String,
		MyNumber = Number,
		MyBoolean = Boolean,
		MyObject = Object;
	assert.equal( sQuery.type( new MyBoolean( true ) ), "boolean", "Boolean" );
	assert.equal( sQuery.type( new MyNumber( 1 ) ), "number", "Number" );
	assert.equal( sQuery.type( new MyString( "a" ) ), "string", "String" );
	assert.equal( sQuery.type( new MyObject() ), "object", "Object" );
	var obj = document.createElement( "object" );

	// Firefox says this is a function
	assert.ok( !sQuery.isFunction( obj ), "Object Element" );
} );

QUnit.test( "type for `Symbol`", function( assert ) {
	// Prevent reference errors
	if( typeof Symbol !== "function" ) {
		assert.expect( 0 );
		return;
	}

	assert.expect( 2 );

	assert.equal( sQuery.type( Symbol() ), "symbol", "Symbol" );
	assert.equal( sQuery.type( Object( Symbol() ) ), "symbol", "Symbol" );
});
QUnit.test( "isFunction", function( assert ) {
	assert.expect( 19 );

	var mystr, myarr, myfunction, fn, obj, nodes, first, input, a;

	// Make sure that false values return false
	assert.ok( !sQuery.isFunction(), "No Value" );
	assert.ok( !sQuery.isFunction( null ), "null Value" );
	assert.ok( !sQuery.isFunction( undefined ), "undefined Value" );
	assert.ok( !sQuery.isFunction( "" ), "Empty String Value" );
	assert.ok( !sQuery.isFunction( 0 ), "0 Value" );

	// Check built-ins
	assert.ok( sQuery.isFunction( String ), "String Function(" + String + ")" );
	assert.ok( sQuery.isFunction( Array ), "Array Function(" + Array + ")" );
	assert.ok( sQuery.isFunction( Object ), "Object Function(" + Object + ")" );
	assert.ok( sQuery.isFunction( Function ), "Function Function(" + Function + ")" );

	// When stringified, this could be misinterpreted
	mystr = "function";
	assert.ok( !sQuery.isFunction( mystr ), "Function String" );

	// When stringified, this could be misinterpreted
	myarr = [ "function" ];
	assert.ok( !sQuery.isFunction( myarr ), "Function Array" );

	// When stringified, this could be misinterpreted
	myfunction = { "function": "test" };
	assert.ok( !sQuery.isFunction( myfunction ), "Function Object" );

	// Make sure normal functions still work
	fn = function() {};
	assert.ok( sQuery.isFunction( fn ), "Normal Function" );

	obj = document.createElement( "object" );

	// Firefox says this is a function
	assert.ok( !sQuery.isFunction( obj ), "Object Element" );

	// Since 1.3, this isn't supported (#2968)
	//ok( sQuery.isFunction(obj.getAttribute), "getAttribute Function" );

	nodes = document.body.childNodes;

	// Safari says this is a function
	assert.ok( !sQuery.isFunction( nodes ), "childNodes Property" );

	first = document.body.firstChild;

	// Normal elements are reported ok everywhere
	assert.ok( !sQuery.isFunction( first ), "A normal DOM Element" );

	input = document.createElement( "input" );
	input.type = "text";
	document.body.appendChild( input );

	// Since 1.3, this isn't supported (#2968)
	//ok( sQuery.isFunction(input.focus), "A default function property" );

	document.body.removeChild( input );

	a = document.createElement( "a" );
	a.href = "some-function";
	document.body.appendChild( a );

	// This serializes with the word 'function' in it
	assert.ok( !sQuery.isFunction( a ), "Anchor Element" );

	document.body.removeChild( a );

	// Recursive function calls have lengths and array-like properties
	function callme( callback ) {
		function fn( response ) {
			callback( response );
		}

		assert.ok( sQuery.isFunction( fn ), "Recursive Function Call" );

		fn( { some: "data" } );
	}

	callme( function() {
		callme( function() {} );
	} );
} );
QUnit.test( "isNumeric", function( assert ) {
	assert.expect( 43 );

	var t = sQuery.isNumeric,
		ToString = function( value ) {
			this.toString = function() {
				return String( value );
			};
		};

	assert.ok( t( "-10" ), "Negative integer string" );
	assert.ok( t( "0" ), "Zero string" );
	assert.ok( t( "5" ), "Positive integer string" );
	assert.ok( t( -16 ), "Negative integer number" );
	assert.ok( t( 0 ), "Zero integer number" );
	assert.ok( t( 32 ), "Positive integer number" );
	assert.ok( t( "-1.6" ), "Negative floating point string" );
	assert.ok( t( "4.536" ), "Positive floating point string" );
	assert.ok( t( -2.6 ), "Negative floating point number" );
	assert.ok( t( 3.1415 ), "Positive floating point number" );
	assert.ok( t( 1.5999999999999999 ), "Very precise floating point number" );
	assert.ok( t( 8e5 ), "Exponential notation" );
	assert.ok( t( "123e-2" ), "Exponential notation string" );
	assert.ok( t( "040" ), "Legacy octal integer literal string" );
	assert.ok( t( "0xFF" ), "Hexadecimal integer literal string (0x...)" );
	assert.ok( t( "0Xba" ), "Hexadecimal integer literal string (0X...)" );
	assert.ok( t( 0xFFF ), "Hexadecimal integer literal" );

	if ( +"0b1" === 1 ) {
		assert.ok( t( "0b111110" ), "Binary integer literal string (0b...)" );
		assert.ok( t( "0B111110" ), "Binary integer literal string (0B...)" );
	} else {
		assert.ok( true, "Browser does not support binary integer literal (0b...)" );
		assert.ok( true, "Browser does not support binary integer literal (0B...)" );
	}

	if ( +"0o1" === 1 ) {
		assert.ok( t( "0o76" ), "Octal integer literal string (0o...)" );
		assert.ok( t( "0O76" ), "Octal integer literal string (0O...)" );
	} else {
		assert.ok( true, "Browser does not support octal integer literal (0o...)" );
		assert.ok( true, "Browser does not support octal integer literal (0O...)" );
	}

	assert.equal( t( new ToString( "42" ) ), false, "Only limited to strings and numbers" );
	assert.equal( t( "" ), false, "Empty string" );
	assert.equal( t( "        " ), false, "Whitespace characters string" );
	assert.equal( t( "\t\t" ), false, "Tab characters string" );
	assert.equal( t( "abcdefghijklm1234567890" ), false, "Alphanumeric character string" );
	assert.equal( t( "xabcdefx" ), false, "Non-numeric character string" );
	assert.equal( t( true ), false, "Boolean true literal" );
	assert.equal( t( false ), false, "Boolean false literal" );
	assert.equal( t( "bcfed5.2" ), false, "Number with preceding non-numeric characters" );
	assert.equal( t( "7.2acdgs" ), false, "Number with trailing non-numeric characters" );
	assert.equal( t( undefined ), false, "Undefined value" );
	assert.equal( t( null ), false, "Null value" );
	assert.equal( t( NaN ), false, "NaN value" );
	assert.equal( t( Infinity ), false, "Infinity primitive" );
	assert.equal( t( Number.POSITIVE_INFINITY ), false, "Positive Infinity" );
	assert.equal( t( Number.NEGATIVE_INFINITY ), false, "Negative Infinity" );
	assert.equal( t( new ToString( "Devo" ) ), false, "Custom .toString returning non-number" );
	assert.equal( t( {} ), false, "Empty object" );
	assert.equal( t( [] ), false, "Empty array" );
	assert.equal( t( [ 42 ] ), false, "Array with one number" );
	assert.equal( t( function() {} ), false, "Instance of a function" );
	assert.equal( t( new Date() ), false, "Instance of a Date" );
} );
QUnit.test('isArrayLike', function(assert) {
	assert.expect(29);

	var arr = [1, 2, 3], arrayLikeObj = {0: 'a', 1: 'b', length: 2};

	assert.equal(sQuery.isArrayLike(arr), true, 'real array');
	assert.equal(sQuery.isArrayLike(arrayLikeObj), true, 'arrayLikeObj');
	assert.equal( sQuery.isArrayLike( null ), false, "null" );
	assert.equal( sQuery.isArrayLike( undefined ), false, "undefined" );
	assert.equal( sQuery.isArrayLike( true ), false, "Boolean" );
	assert.equal( sQuery.isArrayLike( false ), false, "Boolean" );
	assert.equal( sQuery.isArrayLike( Boolean( true ) ), false, "Boolean" );
	assert.equal( sQuery.isArrayLike( 0 ), false, "Number" );
	assert.equal( sQuery.isArrayLike( 1 ), false, "Number" );
	assert.equal( sQuery.isArrayLike( Number( 1 ) ), false, "Number" );
	assert.equal( sQuery.isArrayLike( "" ), false, "String" );
	assert.equal( sQuery.isArrayLike( "a" ), false, "String" );
	assert.equal( sQuery.isArrayLike( String( "a" ) ), false, "String" );
	assert.equal( sQuery.isArrayLike( {} ), false, "Object" );
	assert.equal( sQuery.isArrayLike( /foo/ ), false, "RegExp" );
	assert.equal( sQuery.isArrayLike( new RegExp( "asdf" ) ), false, "RegExp" );
	assert.equal( sQuery.isArrayLike( new Date() ), false, "Date" );
	assert.equal( sQuery.isArrayLike( new Function( "return;" ) ), false, "Function" );
	assert.equal( sQuery.isArrayLike( function() {} ), false, "Function" );
	assert.equal( sQuery.isArrayLike( new Error() ), false, "Error" );
	assert.equal( sQuery.isArrayLike( window ), false, "Window" );
	assert.equal( sQuery.isArrayLike( document ), false, "Document" );
	assert.equal( sQuery.isArrayLike( document.body ), false, "Element" );
	assert.equal( sQuery.isArrayLike( document.createTextNode( "foo" ) ), false, "TextNode" );
	assert.equal( sQuery.isArrayLike( document.getElementsByTagName( "*" ) ), true, "NodeList" );

	// Avoid Lint complaints
	var MyString = String,
		MyNumber = Number,
		MyBoolean = Boolean,
		MyObject = Object;
	assert.equal( sQuery.isArrayLike( new MyBoolean( true ) ), false, "Boolean" );
	assert.equal( sQuery.isArrayLike( new MyNumber( 1 ) ), false, "Number" );
	assert.equal( sQuery.isArrayLike( new MyString( "a" ) ), true, "String" );
	assert.equal( sQuery.isArrayLike( new MyObject() ), false, "Object" );
})
QUnit.test( "isWindow", function( assert ) {
	assert.expect( 14 );

	assert.ok( sQuery.isWindow( window ), "window" );
	assert.ok( sQuery.isWindow( document.getElementsByTagName( "iframe" )[ 0 ].contentWindow ), "iframe.contentWindow" );
	assert.ok( !sQuery.isWindow(), "empty" );
	assert.ok( !sQuery.isWindow( null ), "null" );
	assert.ok( !sQuery.isWindow( undefined ), "undefined" );
	assert.ok( !sQuery.isWindow( document ), "document" );
	assert.ok( !sQuery.isWindow( document.documentElement ), "documentElement" );
	assert.ok( !sQuery.isWindow( "" ), "string" );
	assert.ok( !sQuery.isWindow( 1 ), "number" );
	assert.ok( !sQuery.isWindow( true ), "boolean" );
	assert.ok( !sQuery.isWindow( {} ), "object" );
	assert.ok( !sQuery.isWindow( { setInterval: function() {} } ), "fake window" );
	assert.ok( !sQuery.isWindow( /window/ ), "regexp" );
	assert.ok( !sQuery.isWindow( function() {} ), "function" );
} );
//
QUnit[ typeof Symbol === "function" ? "test" : "skip" ]( "isPlainObject(Symbol)", function( assert ) {
	assert.expect( 2 );

	assert.equal( sQuery.isPlainObject( Symbol() ), false, "Symbol" );
	assert.equal( sQuery.isPlainObject( Object( Symbol() ) ), false, "Symbol inside an object" );
} );

QUnit[ typeof Symbol === "function" ? "test" : "skip" ]( "isNumeric(Symbol)", function( assert ) {
	assert.expect( 2 );

	assert.equal( sQuery.isNumeric( Symbol() ), false, "Symbol" );
	assert.equal( sQuery.isNumeric( Object( Symbol() ) ), false, "Symbol inside an object" );
} );

// QUnit.asyncTest( "isPlainObject", function( assert ) {
// 	assert.expect( 14 );

// 	var pass, iframe, doc,
// 		fn = function() {};

// 	// The use case that we want to match
// 	assert.ok( jQuery.isPlainObject( {} ), "{}" );

// 	// Not objects shouldn't be matched
// 	assert.ok( !jQuery.isPlainObject( "" ), "string" );
// 	assert.ok( !jQuery.isPlainObject( 0 ) && !jQuery.isPlainObject( 1 ), "number" );
// 	assert.ok( !jQuery.isPlainObject( true ) && !jQuery.isPlainObject( false ), "boolean" );
// 	assert.ok( !jQuery.isPlainObject( null ), "null" );
// 	assert.ok( !jQuery.isPlainObject( undefined ), "undefined" );

// 	// Arrays shouldn't be matched
// 	assert.ok( !jQuery.isPlainObject( [] ), "array" );

// 	// Instantiated objects shouldn't be matched
// 	assert.ok( !jQuery.isPlainObject( new Date() ), "new Date" );

// 	// Functions shouldn't be matched
// 	assert.ok( !jQuery.isPlainObject( fn ), "fn" );

// 	// Again, instantiated objects shouldn't be matched
// 	assert.ok( !jQuery.isPlainObject( new fn() ), "new fn (no methods)" );

// 	// Makes the function a little more realistic
// 	// (and harder to detect, incidentally)
// 	fn.prototype[ "someMethod" ] = function() {};

// 	// Again, instantiated objects shouldn't be matched
// 	assert.ok( !jQuery.isPlainObject( new fn() ), "new fn" );

// 	// DOM Element
// 	assert.ok( !jQuery.isPlainObject( document.createElement( "div" ) ), "DOM Element" );

// 	// Window
// 	assert.ok( !jQuery.isPlainObject( window ), "window" );

// 	pass = false;
// 	try {
// 		jQuery.isPlainObject( window.location );
// 		pass = true;
// 	} catch ( e ) {}
// 	assert.ok( pass, "Does not throw exceptions on host objects" );

// 	// Objects from other windows should be matched
// 	// Globals.register( "iframeDone" );
// 	// window.iframeDone = function( otherObject, detail ) {
// 	// 	window.iframeDone = undefined;
// 	// 	iframe.parentNode.removeChild( iframe );
// 	// 	assert.ok( jQuery.isPlainObject( new otherObject() ), "new otherObject" + ( detail ? " - " + detail : "" ) );
// 	// 	QUnit.start();
// 	// };

// 	// try {
// 	// 	iframe = jQuery( "#qunit-fixture" )[ 0 ].appendChild( document.createElement( "iframe" ) );
// 	// 	doc = iframe.contentDocument || iframe.contentWindow.document;
// 	// 	doc.open();
// 	// 	doc.write( "<body onload='window.parent.iframeDone(Object);'>" );
// 	// 	doc.close();
// 	// } catch ( e ) {
// 	// 	window.iframeDone( Object, "iframes not supported" );
// 	// }
// } );

QUnit.test( "sQuery.inArray", function( assert ) {
	assert.expect( 3 );

	assert.equal( sQuery.inArray( 0, false ), -1, "Search in 'false' as array returns -1 and doesn't throw exception" );

	assert.equal( sQuery.inArray( 0, null ), -1, "Search in 'null' as array returns -1 and doesn't throw exception" );

	assert.equal( sQuery.inArray( 0, undefined ), -1, "Search in 'undefined' as array returns -1 and doesn't throw exception" );
} );

QUnit.test( "sQuery.isEmptyObject", function( assert ) {
	assert.expect( 2 );

	assert.equal( true, sQuery.isEmptyObject( {} ), "isEmptyObject on empty object literal" );
	assert.equal( false, sQuery.isEmptyObject( { a:1 } ), "isEmptyObject on non-empty object literal" );

	// What about this ?
	// equal(true, sQuery.isEmptyObject(null), "isEmptyObject on null" );
} );
QUnit.test( "trim", function( assert ) {
	assert.expect( 13 );

	var nbsp = String.fromCharCode( 160 );

	assert.equal( sQuery.trim( "hello  " ), "hello", "trailing space" );
	assert.equal( sQuery.trim( "  hello" ), "hello", "leading space" );
	assert.equal( sQuery.trim( "  hello   " ), "hello", "space on both sides" );
	assert.equal( sQuery.trim( "  " + nbsp + "hello  " + nbsp + " " ), "hello", "&nbsp;" );

	assert.equal( sQuery.trim(), "", "Nothing in." );
	assert.equal( sQuery.trim( undefined ), "", "Undefined" );
	assert.equal( sQuery.trim( null ), "", "Null" );
	assert.equal( sQuery.trim( 5 ), "5", "Number" );
	assert.equal( sQuery.trim( false ), "false", "Boolean" );

	assert.equal( sQuery.trim( " " ), "", "space should be trimmed" );
	assert.equal( sQuery.trim( "ipad\xA0" ), "ipad", "nbsp should be trimmed" );
	assert.equal( sQuery.trim( "\uFEFF" ), "", "zwsp should be trimmed" );
	assert.equal( sQuery.trim( "\uFEFF \xA0! | \uFEFF" ), "! |", "leading/trailing should be trimmed" );
} );
QUnit.test( "sQuery.camelCase()", function( assert ) {

	var tests = {
		"foo-bar": "fooBar",
		"foo-bar-baz": "fooBarBaz",
		"girl-u-want": "girlUWant",
		"the-4th-dimension": "the-4thDimension",
		"-o-tannenbaum": "OTannenbaum",
		"-moz-illa": "MozIlla",
		"-ms-take": "msTake"
	};

	assert.expect( 7 );

	sQuery.each( tests, function( key, val ) {
		assert.equal( sQuery.camelCase( key ), val, "Converts: " + key + " => " + val );
	} );
} );
QUnit.test( "sQuery.map", function( assert ) {
	assert.expect( 25 );

	var i, label, result, callback;

	result = sQuery.map( [ 3, 4, 5 ], function( v, k ) {
		return k;
	} );
	assert.equal( result.join( "" ), "012", "Map the keys from an array" );

	result = sQuery.map( [ 3, 4, 5 ], function( v ) {
		return v;
	} );
	assert.equal( result.join( "" ), "345", "Map the values from an array" );

	result = sQuery.map( { a: 1, b: 2 }, function( v, k ) {
		return k;
	} );
	assert.equal( result.join( "" ), "ab", "Map the keys from an object" );

	result = sQuery.map( { a: 1, b: 2 }, function( v ) {
		return v;
	} );
	assert.equal( result.join( "" ), "12", "Map the values from an object" );

	result = sQuery.map( [ "a", undefined, null, "b" ], function( v ) {
		return v;
	} );
	assert.equal( result.join( "" ), "ab", "Array iteration does not include undefined/null results" );

	result = sQuery.map( { a: "a", b: undefined, c: null, d: "b" }, function( v ) {
		return v;
	} );
	assert.equal( result.join( "" ), "ab", "Object iteration does not include undefined/null results" );

	result = {
		Zero: function() {},
		One: function( a ) { a = a; },
		Two: function( a, b ) { a = a; b = b; }
	};
	callback = function( v, k ) {
		assert.equal( k, "foo", label + "-argument function treated like object" );
	};
	for ( i in result ) {
		label = i;
		result[ i ].foo = "bar";
		sQuery.map( result[ i ], callback );
	}

	result = {
		"undefined": undefined,
		"null": null,
		"false": false,
		"true": true,
		"empty string": "",
		"nonempty string": "string",
		"string \"0\"": "0",
		"negative": -1,
		"excess": 1
	};
	callback = function( v, k ) {
		assert.equal( k, "length", "Object with " + label + " length treated like object" );
	};
	for ( i in result ) {
		label = i;
		sQuery.map( { length: result[ i ] }, callback );
	}

	result = {
		"sparse Array": Array( 4 ),
		"length: 1 plain object": { length: 1, "0": true },
		"length: 2 plain object": { length: 2, "0": true, "1": true },
		NodeList: document.getElementsByTagName( "html" )
	};
	callback = function( v, k ) {
		if ( result[ label ] ) {
			delete result[ label ];
			assert.equal( k, "0", label + " treated like array" );
		}
	};
	for ( i in result ) {
		label = i;
		sQuery.map( result[ i ], callback );
	}

	result = false;
	sQuery.map( { length: 0 }, function() {
		result = true;
	} );
	assert.ok( !result, "length: 0 plain object treated like array" );

	result = false;
	sQuery.map( document.getElementsByTagName( "asdf" ), function() {
		result = true;
	} );
	assert.ok( !result, "empty NodeList treated like array" );

	result = sQuery.map( Array( 4 ), function( v, k ) {
		return k % 2 ? k : [ k,k,k ];
	} );
	assert.equal( result.join( "" ), "00012223", "Array results flattened (#2616)" );
} );



QUnit.test( "sQuery.grep()", function( assert ) {
	assert.expect( 8 );

	var searchCriterion = function( value ) {
		return value % 2 === 0;
	};

	assert.deepEqual( sQuery.grep( [], searchCriterion ), [], "Empty array" );
	assert.deepEqual( sQuery.grep( new Array( 4 ), searchCriterion ), [], "Sparse array" );

	assert.deepEqual(
		sQuery.grep( [ 1, 2, 3, 4, 5, 6 ], searchCriterion ),
		[ 2, 4, 6 ],
		"Satisfying elements present"
	);
	assert.deepEqual(
		sQuery.grep( [ 1, 3, 5, 7 ], searchCriterion ),
		[],
		"Satisfying elements absent"
	);

	assert.deepEqual(
		sQuery.grep( [ 1, 2, 3, 4, 5, 6 ], searchCriterion, true ),
		[ 1, 3, 5 ],
		"Satisfying elements present and grep inverted"
	);
	assert.deepEqual(
		sQuery.grep( [ 1, 3, 5, 7 ], searchCriterion, true ),
		[ 1, 3, 5, 7 ],
		"Satisfying elements absent and grep inverted"
	);

	assert.deepEqual(
		sQuery.grep( [ 1, 2, 3, 4, 5, 6 ], searchCriterion, false ),
		[ 2, 4, 6 ],
		"Satisfying elements present but grep explicitly uninverted"
	);
	assert.deepEqual(
		sQuery.grep( [ 1, 3, 5, 7 ], searchCriterion, false ),
		[],
		"Satisfying elements absent and grep explicitly uninverted"
	);
} );

QUnit.test( "sQuery.grep(Array-like)", function( assert ) {
	assert.expect( 7 );

	var searchCriterion = function( value ) {
		return value % 2 === 0;
	};

	assert.deepEqual( sQuery.grep( { length: 0 }, searchCriterion ), [], "Empty array-like" );

	assert.deepEqual(
		sQuery.grep( { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, length: 6 }, searchCriterion ),
		[ 2, 4, 6 ],
		"Satisfying elements present and array-like object used"
	);
	assert.deepEqual(
		sQuery.grep( { 0: 1, 1: 3, 2: 5, 3: 7, length: 4 }, searchCriterion ),
		[],
		"Satisfying elements absent and Array-like object used"
	);

	assert.deepEqual(
		sQuery.grep( { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, length: 6 }, searchCriterion, true ),
		[ 1, 3, 5 ],
		"Satisfying elements present, array-like object used, and grep inverted"
	);
	assert.deepEqual(
		sQuery.grep( { 0: 1, 1: 3, 2: 5, 3: 7, length: 4 }, searchCriterion, true ),
		[ 1, 3, 5, 7 ],
		"Satisfying elements absent, array-like object used, and grep inverted"
	);

	assert.deepEqual(
		sQuery.grep( { 0: 1, 1: 2, 2: 3, 3: 4, 4: 5, 5: 6, length: 6 }, searchCriterion, false ),
		[ 2, 4, 6 ],
		"Satisfying elements present, Array-like object used, but grep explicitly uninverted"
	);
	assert.deepEqual(
		sQuery.grep( { 0: 1, 1: 3, 2: 5, 3: 7, length: 4 }, searchCriterion, false ),
		[],
		"Satisfying elements absent, Array-like object used, and grep explicitly uninverted"
	);
});
QUnit.test( "sQuery.each(Object,Function)", function( assert ) {
	assert.expect( 23 );

	var i, label, seen, callback;

	seen = {};
	sQuery.each( [ 3, 4, 5 ], function( k, v ) {
		seen[ k ] = v;
	} );
	assert.deepEqual( seen, { "0": 3, "1": 4, "2": 5 }, "Array iteration" );

	seen = {};
	sQuery.each( { name: "name", lang: "lang" }, function( k, v ) {
		seen[ k ] = v;
	} );
	assert.deepEqual( seen, { name: "name", lang: "lang" }, "Object iteration" );

	seen = [];
	sQuery.each( [ 1, 2, 3 ], function( k, v ) {
		seen.push( v );
		if ( k === 1 ) {
			return false;
		}
	} );
	assert.deepEqual( seen, [ 1, 2 ], "Broken array iteration" );

	seen = [];
	sQuery.each( { "a": 1, "b": 2,"c": 3 }, function( k, v ) {
		seen.push( v );
		return false;
	} );
	assert.deepEqual( seen, [ 1 ], "Broken object iteration" );

	seen = {
		Zero: function() {},
		One: function( a ) { a = a; },
		Two: function( a, b ) { a = a; b = b; }
	};
	callback = function( k ) {
		assert.equal( k, "foo", label + "-argument function treated like object" );
	};
	for ( i in seen ) {
		label = i;
		seen[ i ].foo = "bar";
		sQuery.each( seen[ i ], callback );
	}

	seen = {
		"undefined": undefined,
		"null": null,
		"false": false,
		"true": true,
		"empty string": "",
		"nonempty string": "string",
		"string \"0\"": "0",
		"negative": -1,
		"excess": 1
	};
	callback = function( k ) {
		assert.equal( k, "length", "Object with " + label + " length treated like object" );
	};
	for ( i in seen ) {
		label = i;
		sQuery.each( { length: seen[ i ] }, callback );
	}

	seen = {
		"sparse Array": Array( 4 ),
		"length: 1 plain object": { length: 1, "0": true },
		"length: 2 plain object": { length: 2, "0": true, "1": true },
		NodeList: document.getElementsByTagName( "html" )
	};
	callback = function( k ) {
		if ( seen[ label ] ) {
			delete seen[ label ];
			assert.equal( k, "0", label + " treated like array" );
			return false;
		}
	};
	for ( i in seen ) {
		label = i;
		sQuery.each( seen[ i ], callback );
	}

	seen = false;
	sQuery.each( { length: 0 }, function() {
		seen = true;
	} );
	assert.ok( !seen, "length: 0 plain object treated like array" );

	seen = false;
	sQuery.each( document.getElementsByTagName( "asdf" ), function() {
		seen = true;
	} );
	assert.ok( !seen, "empty NodeList treated like array" );

	i = 0;
	sQuery.each( document.styleSheets, function() {
		i++;
	} );
	assert.equal( i, document.styleSheets.length, "Iteration over document.styleSheets" );
} );

QUnit.test( "sQuery.each/map(undefined/null,Function)", function( assert ) {
	assert.expect( 1 );

	try {
		sQuery.each( undefined, sQuery.noop );
		sQuery.each( null, sQuery.noop );
		sQuery.map( undefined, sQuery.noop );
		sQuery.map( null, sQuery.noop );
		assert.ok( true, "sQuery.each/map( undefined/null, function() {} );" );
	} catch ( e ) {
		assert.ok( false, "each/map must accept null and undefined values" );
	}
} );
QUnit.test( "sQuery.merge()", function( assert ) {
	assert.expect( 10 );

	assert.deepEqual(
		sQuery.merge( [], [] ),
		[],
		"Empty arrays"
	);

	assert.deepEqual(
		sQuery.merge( [ 1 ], [ 2 ] ),
		[ 1, 2 ],
		"Basic (single-element)"
	);
	assert.deepEqual(
		sQuery.merge( [ 1, 2 ], [ 3, 4 ] ),
		[ 1, 2, 3, 4 ],
		"Basic (multiple-element)"
	);

	assert.deepEqual(
		sQuery.merge( [ 1, 2 ], [] ),
		[ 1, 2 ],
		"Second empty"
	);
	assert.deepEqual(
		sQuery.merge( [], [ 1, 2 ] ),
		[ 1, 2 ],
		"First empty"
	);

	// Fixed at [5998], #3641
	assert.deepEqual(
		sQuery.merge( [ -2, -1 ], [ 0, 1, 2 ] ),
		[ -2, -1, 0, 1, 2 ],
		"Second array including a zero (falsy)"
	);

	// After fixing #5527
	assert.deepEqual(
		sQuery.merge( [], [ null, undefined ] ),
		[ null, undefined ],
		"Second array including null and undefined values"
	);
	assert.deepEqual(
		sQuery.merge( { length: 0 }, [ 1, 2 ] ),
		{ length: 2, 0: 1, 1: 2 },
		"First array like"
	);
	assert.deepEqual(
		sQuery.merge( [ 1, 2 ], { length: 1, 0: 3 } ),
		[ 1, 2, 3 ],
		"Second array like"
	);

	assert.deepEqual(
		sQuery.merge( [], document.getElementById( "lengthtest" ).getElementsByTagName( "input" ) ),
		[ document.getElementById( "length" ), document.getElementById( "idTest" ) ],
		"Second NodeList"
	);
} );
QUnit.test( "sQuery.extend(Object, Object)", function( assert ) {
	assert.expect( 28 );

	var empty, optionsWithLength, optionsWithDate, myKlass,
		customObject, optionsWithCustomObject, MyNumber, ret,
		nullUndef, target, recursive, obj,
		defaults, defaultsCopy, options1, options1Copy, options2, options2Copy, merged2,
		settings = { "xnumber1": 5, "xnumber2": 7, "xstring1": "peter", "xstring2": "pan" },
		options = { "xnumber2": 1, "xstring2": "x", "xxx": "newstring" },
		optionsCopy = { "xnumber2": 1, "xstring2": "x", "xxx": "newstring" },
		merged = { "xnumber1": 5, "xnumber2": 1, "xstring1": "peter", "xstring2": "x", "xxx": "newstring" },
		deep1 = { "foo": { "bar": true } },
		deep2 = { "foo": { "baz": true }, "foo2": document },
		deep2copy = { "foo": { "baz": true }, "foo2": document },
		deepmerged = { "foo": { "bar": true, "baz": true }, "foo2": document },
		arr = [ 1, 2, 3 ],
		nestedarray = { "arr": arr };

	sQuery.extend( settings, options );
	assert.deepEqual( settings, merged, "Check if extended: settings must be extended" );
	assert.deepEqual( options, optionsCopy, "Check if not modified: options must not be modified" );

	sQuery.extend( settings, null, options );
	assert.deepEqual( settings, merged, "Check if extended: settings must be extended" );
	assert.deepEqual( options, optionsCopy, "Check if not modified: options must not be modified" );

	sQuery.extend( true, deep1, deep2 );
	assert.deepEqual( deep1[ "foo" ], deepmerged[ "foo" ], "Check if foo: settings must be extended" );
	assert.deepEqual( deep2[ "foo" ], deep2copy[ "foo" ], "Check if not deep2: options must not be modified" );
	assert.equal( deep1[ "foo2" ], document, "Make sure that a deep clone was not attempted on the document" );

	assert.ok( sQuery.extend( true, {}, nestedarray )[ "arr" ] !== arr, "Deep extend of object must clone child array" );

	// #5991
	assert.ok( sQuery.isArray( sQuery.extend( true, { "arr": {} }, nestedarray )[ "arr" ] ), "Cloned array have to be an Array" );
	assert.ok( sQuery.isPlainObject( sQuery.extend( true, { "arr": arr }, { "arr": {} } )[ "arr" ] ), "Cloned object have to be an plain object" );

	empty = {};
	optionsWithLength = { "foo": { "length": -1 } };
	sQuery.extend( true, empty, optionsWithLength );
	assert.deepEqual( empty[ "foo" ], optionsWithLength[ "foo" ], "The length property must copy correctly" );

	empty = {};
	optionsWithDate = { "foo": { "date": new Date() } };
	sQuery.extend( true, empty, optionsWithDate );
	assert.deepEqual( empty[ "foo" ], optionsWithDate[ "foo" ], "Dates copy correctly" );

	/** @constructor */
	myKlass = function() {};
	customObject = new myKlass();
	optionsWithCustomObject = { "foo": { "date": customObject } };
	empty = {};
	sQuery.extend( true, empty, optionsWithCustomObject );
	assert.ok( empty[ "foo" ] && empty[ "foo" ][ "date" ] === customObject, "Custom objects copy correctly (no methods)" );

	// Makes the class a little more realistic
	myKlass.prototype = { "someMethod": function() {} };
	empty = {};
	sQuery.extend( true, empty, optionsWithCustomObject );
	assert.ok( empty[ "foo" ] && empty[ "foo" ][ "date" ] === customObject, "Custom objects copy correctly" );

	MyNumber = Number;

	ret = sQuery.extend( true, { "foo": 4 }, { "foo": new MyNumber( 5 ) } );
	assert.ok( parseInt( ret.foo, 10 ) === 5, "Wrapped numbers copy correctly" );

	nullUndef;
	nullUndef = sQuery.extend( {}, options, { "xnumber2": null } );
	assert.ok( nullUndef[ "xnumber2" ] === null, "Check to make sure null values are copied" );

	nullUndef = sQuery.extend( {}, options, { "xnumber2": undefined } );
	assert.ok( nullUndef[ "xnumber2" ] === options[ "xnumber2" ], "Check to make sure undefined values are not copied" );

	nullUndef = sQuery.extend( {}, options, { "xnumber0": null } );
	assert.ok( nullUndef[ "xnumber0" ] === null, "Check to make sure null values are inserted" );

	target = {};
	recursive = { foo:target, bar:5 };
	sQuery.extend( true, target, recursive );
	assert.deepEqual( target, { bar:5 }, "Check to make sure a recursive obj doesn't go never-ending loop by not copying it over" );

	ret = sQuery.extend( true, { foo: [] }, { foo: [ 0 ] } ); // 1907
	assert.equal( ret.foo.length, 1, "Check to make sure a value with coercion 'false' copies over when necessary to fix #1907" );

	ret = sQuery.extend( true, { foo: "1,2,3" }, { foo: [ 1, 2, 3 ] } );
	assert.ok( typeof ret.foo !== "string", "Check to make sure values equal with coercion (but not actually equal) overwrite correctly" );

	ret = sQuery.extend( true, { foo:"bar" }, { foo:null } );
	assert.ok( typeof ret.foo !== "undefined", "Make sure a null value doesn't crash with deep extend, for #1908" );

	obj = { foo:null };
	sQuery.extend( true, obj, { foo:"notnull" } );
	assert.equal( obj.foo, "notnull", "Make sure a null value can be overwritten" );

	function func() {}
	sQuery.extend( func, { key: "value" } );
	assert.equal( func.key, "value", "Verify a function can be extended" );

	defaults = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" };
	defaultsCopy = { xnumber1: 5, xnumber2: 7, xstring1: "peter", xstring2: "pan" };
	options1 = { xnumber2: 1, xstring2: "x" };
	options1Copy = { xnumber2: 1, xstring2: "x" };
	options2 = { xstring2: "xx", xxx: "newstringx" };
	options2Copy = { xstring2: "xx", xxx: "newstringx" };
	merged2 = { xnumber1: 5, xnumber2: 1, xstring1: "peter", xstring2: "xx", xxx: "newstringx" };

	settings = sQuery.extend( {}, defaults, options1, options2 );
	assert.deepEqual( settings, merged2, "Check if extended: settings must be extended" );
	assert.deepEqual( defaults, defaultsCopy, "Check if not modified: options1 must not be modified" );
	assert.deepEqual( options1, options1Copy, "Check if not modified: options1 must not be modified" );
	assert.deepEqual( options2, options2Copy, "Check if not modified: options2 must not be modified" );
} );

QUnit.test( "sQuery.extend(Object, Object {created with \"defineProperties\"})", function( assert ) {
	assert.expect( 2 );

	var definedObj = Object.defineProperties({}, {
        "enumerableProp": {
          get: function () {
            return true;
          },
          enumerable: true
        },
        "nonenumerableProp": {
          get: function () {
            return true;
          }
        }
      }),
      accessorObj = {};

	sQuery.extend( accessorObj, definedObj );
	assert.equal( accessorObj.enumerableProp, true, "Verify that getters are transferred" );
	assert.equal( accessorObj.nonenumerableProp, undefined, "Verify that non-enumerable getters are ignored" );
} );

QUnit.test( "sQuery.extend(true,{},{a:[], o:{}}); deep copy with array, followed by object", function( assert ) {
	assert.expect( 2 );

	var result, initial = {

		// This will make "copyIsArray" true
		array: [ 1, 2, 3, 4 ],

		// If "copyIsArray" doesn't get reset to false, the check
		// will evaluate true and enter the array copy block
		// instead of the object copy block. Since the ternary in the
		// "copyIsArray" block will will evaluate to false
		// (check if operating on an array with ), this will be
		// replaced by an empty array.
		object: {}
	};

	result = sQuery.extend( true, {}, initial );

	assert.deepEqual( result, initial, "The [result] and [initial] have equal shape and values" );
	assert.ok( !sQuery.isArray( result.object ), "result.object wasn't paved with an empty array" );
} );
QUnit.test( "globalEval", function( assert ) {
	assert.expect( 3 );
	// Globals.register( "globalEvalTest" );

	sQuery.globalEval( "globalEvalTest = 1;" );
	assert.equal( window.globalEvalTest, 1, "Test variable assignments are global" );

	sQuery.globalEval( "var globalEvalTest = 2;" );
	assert.equal( window.globalEvalTest, 2, "Test variable declarations are global" );

	sQuery.globalEval( "this.globalEvalTest = 3;" );
	assert.equal( window.globalEvalTest, 3, "Test context (this) is the window object" );
} );

QUnit.test( "globalEval with 'use strict'", function( assert ) {
	assert.expect( 1 );
	// Globals.register( "strictEvalTest" );

	sQuery.globalEval( "'use strict'; var strictEvalTest = 1;" );
	assert.equal( window.strictEvalTest, 1, "Test variable declarations are global (strict mode)" );
} );
QUnit.test( "each(Function)", function( assert ) {
	assert.expect( 1 );
	var div, pass, i;

	div = sQuery( "div" );
	div.each( function() {this.foo = "zoo";} );
	pass = true;
	for ( i = 0; i < div.length; i++ ) {
		if ( div.get( i ).foo !== "zoo" ) {
			pass = false;
		}
	}
	assert.ok( pass, "Execute a function, Relative" );
} );

QUnit.test( "map()", function( assert ) {
	assert.expect( 2 );

	assert.deepEqual(
		sQuery( "#ap" ).map( function() {
			return sQuery( this ).find( "a" ).get();
		} ).get(),
		q( "google", "groups", "anchor1", "mark" ),
		"Array Map"
	);

	assert.deepEqual(
		sQuery( "#ap > a" ).map( function() {
			return this.parentNode;
		} ).get(),
		q( "ap", "ap", "ap" ),
		"Single Map"
	);
} );
QUnit.test( "sQuery.parseHTML", function( assert ) {
	assert.expect( 23 );

	var html, nodes;

	assert.deepEqual( sQuery.parseHTML(), [], "Without arguments" );
	assert.deepEqual( sQuery.parseHTML( undefined ), [], "Undefined" );
	assert.deepEqual( sQuery.parseHTML( null ), [], "Null" );
	assert.deepEqual( sQuery.parseHTML( false ), [], "Boolean false" );
	assert.deepEqual( sQuery.parseHTML( 0 ), [], "Zero" );
	assert.deepEqual( sQuery.parseHTML( true ), [], "Boolean true" );
	assert.deepEqual( sQuery.parseHTML( 42 ), [], "Positive number" );
	assert.deepEqual( sQuery.parseHTML( "" ), [], "Empty string" );
	assert.throws( function() {
		sQuery.parseHTML( "<div></div>", document.getElementById( "form" ) );
	}, "Passing an element as the context raises an exception (context should be a document)" );

	nodes = sQuery.parseHTML( sQuery( "body" )[ 0 ].innerHTML );
	assert.ok( nodes.length > 4, "Parse a large html string" );
	assert.equal( sQuery.type( nodes ), "array", "parseHTML returns an array rather than a nodelist" );

	html = "<script>undefined()</script>";
	assert.equal( sQuery.parseHTML( html ).length, 0, "Ignore scripts by default" );
	assert.equal( sQuery.parseHTML( html, true )[ 0 ].nodeName.toLowerCase(), "script", "Preserve scripts when requested" );

	html += "<div></div>";
	assert.equal( sQuery.parseHTML( html )[ 0 ].nodeName.toLowerCase(), "div", "Preserve non-script nodes" );
	assert.equal( sQuery.parseHTML( html, true )[ 0 ].nodeName.toLowerCase(), "script", "Preserve script position" );

	assert.equal( sQuery.parseHTML( "text" )[ 0 ].nodeType, 3, "Parsing text returns a text node" );
	assert.equal( sQuery.parseHTML( "\t<div></div>" )[ 0 ].nodeValue, "\t", "Preserve leading whitespace" );

	assert.equal( sQuery.parseHTML( " <div/> " )[ 0 ].nodeType, 3, "Leading spaces are treated as text nodes (#11290)" );

	html = sQuery.parseHTML( "<div>test div</div>" );

	assert.equal( html[ 0 ].parentNode.nodeType, 11, "parentNode should be documentFragment" );
	assert.equal( html[ 0 ].innerHTML, "test div", "Content should be preserved" );

	assert.equal( sQuery.parseHTML( "<span><span>" ).length, 1, "Incorrect html-strings should not break anything" );
	assert.equal( sQuery.parseHTML( "<td><td>" )[ 1 ].parentNode.nodeType, 11,
		"parentNode should be documentFragment for wrapMap (variable in manipulation module) elements too" );
	assert.ok( sQuery.parseHTML( "<#if><tr><p>This is a test.</p></tr><#/if>" ) || true, "Garbage input should not cause error" );
} );
QUnit.test( "toArray()", function( assert ) {
	assert.expect( 1 );
	assert.deepEqual( sQuery( "#qunit-fixture p" ).toArray(),
		q( "firstp", "ap", "sndp", "en", "sap", "first" ),
		"Convert sQuery object to an Array" );
} );

QUnit.test( "inArray()", function( assert ) {
	assert.expect( 19 );

	var selections = {
		p:   q( "firstp", "sap", "ap", "first" ),
		em:  q( "siblingnext", "siblingfirst" ),
		div: q( "qunit-testrunner-toolbar", "nothiddendiv", "nothiddendivchild", "foo" ),
		a:   q( "mark", "groups", "google", "simon1" ),
		empty: []
	},
	tests = {
		p:    { elem: sQuery( "#ap" )[ 0 ],           index: 2 },
		em:   { elem: sQuery( "#siblingfirst" )[ 0 ], index: 1 },
		div:  { elem: sQuery( "#nothiddendiv" )[ 0 ], index: 1 },
		a:    { elem: sQuery( "#simon1" )[ 0 ],       index: 3 }
	},
	falseTests = {
		p:  sQuery( "#liveSpan1" )[ 0 ],
		em: sQuery( "#nothiddendiv" )[ 0 ],
		empty: ""
	};

	sQuery.each( tests, function( key, obj ) {
		assert.equal( sQuery.inArray( obj.elem, selections[ key ] ), obj.index, "elem is in the array of selections of its tag" );

		// Third argument (fromIndex)
		assert.equal( !!~sQuery.inArray( obj.elem, selections[ key ], 5 ), false, "elem is NOT in the array of selections given a starting index greater than its position" );
		assert.equal( !!~sQuery.inArray( obj.elem, selections[ key ], 1 ), true, "elem is in the array of selections given a starting index less than or equal to its position" );
		assert.equal( !!~sQuery.inArray( obj.elem, selections[ key ], -3 ), true, "elem is in the array of selections given a negative index" );
	} );

	sQuery.each( falseTests, function( key, elem ) {
		assert.equal( !!~sQuery.inArray( elem, selections[ key ] ), false, "elem is NOT in the array of selections" );
	} );

} );
QUnit.test( "sQuery('html')", function( assert ) {
	assert.expect( 18 );

	var s, div, j;

	sQuery[ "foo" ] = false;
	s = sQuery( "<script>sQuery.foo='test';</script>" )[ 0 ];
	assert.ok( s, "Creating a script" );
	assert.ok( !sQuery[ "foo" ], "Make sure the script wasn't executed prematurely" );
	sQuery( "body" ).append( "<script>sQuery.foo='test';</script>" );
	assert.ok( sQuery[ "foo" ], "Executing a script's contents in the right context" );

	// Test multi-line HTML
	div = sQuery( "<div>\r\nsome text\n<p>some p</p>\nmore text\r\n</div>" )[ 0 ];
	assert.equal( div.nodeName.toUpperCase(), "DIV", "Make sure we're getting a div." );
	assert.equal( div.firstChild.nodeType, 3, "Text node." );
	assert.equal( div.lastChild.nodeType, 3, "Text node." );
	assert.equal( div.childNodes[ 1 ].nodeType, 1, "Paragraph." );
	assert.equal( div.childNodes[ 1 ].firstChild.nodeType, 3, "Paragraph text." );

	assert.ok( sQuery( "<link rel='stylesheet'/>" )[ 0 ], "Creating a link" );

	assert.ok( !sQuery( "<script/>" )[ 0 ].parentNode, "Create a script" );

	assert.ok( sQuery( "<input/>" ).attr( "type", "hidden" ), "Create an input and set the type." );

	j = sQuery( "<span>hi</span> there <!-- mon ami -->" );
	assert.ok( j.length >= 2, "Check node,textnode,comment creation (some browsers delete comments)" );

	assert.ok( !sQuery( "<option>test</option>" )[ 0 ].selected, "Make sure that options are auto-selected #2050" );

	assert.ok( sQuery( "<div></div>" )[ 0 ], "Create a div with closing tag." );
	assert.ok( sQuery( "<table></table>" )[ 0 ], "Create a table with closing tag." );

	assert.equal( sQuery( "element[attribute='<div></div>']" ).length, 0,
		"When html is within brackets, do not recognize as html." );

	//equal( sQuery( "element[attribute=<div></div>]" ).length, 0,
	//	"When html is within brackets, do not recognize as html." );
	if ( sQuery.find.compile ) {
		assert.equal( sQuery( "element:not(<div></div>)" ).length, 0,
			"When html is within parens, do not recognize as html." );
	} else {
		assert.ok( "skip", "Complex :not not supported in selector-native" );
	}
	assert.equal( sQuery( "\\<div\\>" ).length, 0, "Ignore escaped html characters" );
} );
QUnit.test( "sQuery()", function( assert ) {

	var elem, i,
		obj = sQuery( "div" ),
		code = sQuery( "<code/>" ),
		img = sQuery( "<img/>" ),
		div = sQuery( "<div/><hr/><code/><b/>" ),
		exec = false,
		expected = 23,
		attrObj = {
			"text": "test",
			"class": "test2",
			"id": "test3"
		};

	// The $(html, props) signature can stealth-call any $.fn method, check for a
	// few here but beware of modular builds where these methods may be excluded.
	if ( sQuery.fn.click ) {
		expected++;
		attrObj[ "click" ] = function() { assert.ok( exec, "Click executed." ); };
	}
	if ( sQuery.fn.width ) {
		expected++;
		attrObj[ "width" ] = 10;
	}
	if ( sQuery.fn.offset ) {
		expected++;
		attrObj[ "offset" ] = { "top": 1, "left": 1 };
	}
	if ( sQuery.fn.css ) {
		expected += 2;
		attrObj[ "css" ] = { "paddingLeft": 1, "paddingRight": 1 };
	}
	if ( sQuery.fn.attr ) {
		expected++;
		attrObj.attr = { "desired": "very" };
	}

	assert.expect( expected );

	// Basic constructor's behavior
	assert.equal( sQuery().length, 0, "sQuery() === sQuery([])" );
	assert.equal( sQuery( undefined ).length, 0, "sQuery(undefined) === sQuery([])" );
	assert.equal( sQuery( null ).length, 0, "sQuery(null) === sQuery([])" );
	assert.equal( sQuery( "" ).length, 0, "sQuery('') === sQuery([])" );
	assert.deepEqual( sQuery( obj ).get(), obj.get(), "sQuery(sQueryObj) == sQueryObj" );

	// Invalid #id goes to Sizzle which will throw an error (gh-1682)
	try {
		sQuery( "#" );
	} catch ( e ) {
		assert.ok( true, "Threw an error on #id with no id" );
	}

	// can actually yield more than one, when iframes are included, the window is an array as well
	assert.equal( sQuery( window ).length, 1, "Correct number of elements generated for sQuery(window)" );

/*
	// disabled since this test was doing nothing. i tried to fix it but i'm not sure
	// what the expected behavior should even be. FF returns "\n" for the text node
	// make sure this is handled
	var crlfContainer = sQuery('<p>\r\n</p>');
	var x = crlfContainer.contents().get(0).nodeValue;
	assert.equal( x, what???, "Check for \\r and \\n in sQuery()" );
*/

	/* // Disabled until we add this functionality in
	var pass = true;
	try {
		sQuery("<div>Testing</div>").appendTo(document.getElementById("iframe").contentDocument.body);
	} catch(e){
		pass = false;
	}
	assert.ok( pass, "sQuery('&lt;tag&gt;') needs optional document parameter to ease cross-frame DOM wrangling, see #968" );*/

	assert.equal( code.length, 1, "Correct number of elements generated for code" );
	assert.equal( code.parent().length, 0, "Make sure that the generated HTML has no parent." );

	assert.equal( img.length, 1, "Correct number of elements generated for img" );
	assert.equal( img.parent().length, 0, "Make sure that the generated HTML has no parent." );

	assert.equal( div.length, 4, "Correct number of elements generated for div hr code b" );
	assert.equal( div.parent().length, 0, "Make sure that the generated HTML has no parent." );

	assert.equal( sQuery( [ 1,2,3 ] ).get( 1 ), 2, "Test passing an array to the factory" );

	assert.equal( sQuery( document.body ).get( 0 ), sQuery( "body" ).get( 0 ), "Test passing an html node to the factory" );

	elem = sQuery( "  <em>hello</em>" )[ 0 ];
	assert.equal( elem.nodeName.toLowerCase(), "em", "leading space" );

	elem = sQuery( "\n\n<em>world</em>" )[ 0 ];
	assert.equal( elem.nodeName.toLowerCase(), "em", "leading newlines" );

	elem = sQuery( "<div/>", attrObj );

	if ( sQuery.fn.width ) {
		assert.equal( elem[ 0 ].style.width, "10px", "sQuery() quick setter width" );
	}

	if ( sQuery.fn.offset ) {
		assert.equal( elem[ 0 ].style.top, "1px", "sQuery() quick setter offset" );
	}

	if ( sQuery.fn.css ) {
		assert.equal( elem[ 0 ].style.paddingLeft, "1px", "sQuery quick setter css" );
		assert.equal( elem[ 0 ].style.paddingRight, "1px", "sQuery quick setter css" );
	}

	if ( sQuery.fn.attr ) {
		assert.equal( elem[ 0 ].getAttribute( "desired" ), "very", "sQuery quick setter attr" );
	}

	assert.equal( elem[ 0 ].childNodes.length, 1, "sQuery quick setter text" );
	assert.equal( elem[ 0 ].firstChild.nodeValue, "test", "sQuery quick setter text" );
	assert.equal( elem[ 0 ].className, "test2", "sQuery() quick setter class" );
	assert.equal( elem[ 0 ].id, "test3", "sQuery() quick setter id" );

	exec = true;
	elem.trigger( "click" );

	// manually clean up detached elements
	elem.remove();

	for ( i = 0; i < 3; ++i ) {
		elem = sQuery( "<input type='text' value='TEST' />" );
	}
	assert.equal( elem[ 0 ].defaultValue, "TEST", "Ensure cached nodes are cloned properly (Bug #6655)" );

	elem = sQuery( "<input type='hidden'>", {} );
	assert.strictEqual( elem[ 0 ].ownerDocument, document,
		"Empty attributes object is not interpreted as a document (trac-8950)" );
} );

QUnit[ sQuery.find ? "test" : "skip" ]( "sQuery(selector, context)", function( assert ) {
	assert.expect( 3 );
	assert.deepEqual( sQuery( "div p", "#qunit-fixture" ).get(), q( "sndp", "en", "sap" ), "Basic selector with string as context" );
	assert.deepEqual( sQuery( "div p", q( "qunit-fixture" )[ 0 ] ).get(), q( "sndp", "en", "sap" ), "Basic selector with element as context" );
	assert.deepEqual( sQuery( "div p", sQuery( "#qunit-fixture" ) ).get(), q( "sndp", "en", "sap" ), "Basic selector with sQuery object as context" );
} );



// QUnit.test( "globalEval execution after script injection (#7862)", function( assert ) {
// 	assert.expect( 1 );

// 	var now,
// 		script = document.createElement( "script" );

// 	script.src = "data/longLoadScript.php?sleep=2";

// 	now = sQuery.now();
// 	document.body.appendChild( script );

// 	sQuery.globalEval( "var strictEvalTest = " + sQuery.now() + ";" );
// 	assert.ok( window.strictEvalTest - now < 500, "Code executed synchronously" );
// } );

// This is not run in AMD mode
if ( sQuery.noConflict ) {
	QUnit.test( "noConflict", function( assert ) {
		assert.expect( 7 );

		var $$ = sQuery;

		assert.strictEqual( sQuery, sQuery.noConflict(), "noConflict returned the sQuery object" );
		assert.strictEqual( window[ "sQuery" ], $$, "Make sure sQuery wasn't touched." );
		assert.strictEqual( window[ "$" ], original$, "Make sure $ was reverted." );

		sQuery = $ = $$;

		assert.strictEqual( sQuery.noConflict( true ), $$, "noConflict returned the sQuery object" );
		assert.strictEqual( window[ "sQuery" ], originalsQuery, "Make sure sQuery was reverted." );
		assert.strictEqual( window[ "$" ], original$, "Make sure $ was reverted." );
		assert.ok( $$().pushStack( [] ), "Make sure that sQuery still works." );

		window[ "sQuery" ] = sQuery = $$;
	} );
}






QUnit.test( "isXMLDoc - HTML", function( assert ) {
	assert.expect( 4 );

	assert.ok( !sQuery.isXMLDoc( document ), "HTML document" );
	assert.ok( !sQuery.isXMLDoc( document.documentElement ), "HTML documentElement" );
	assert.ok( !sQuery.isXMLDoc( document.body ), "HTML Body Element" );

	var body,
		iframe = document.createElement( "iframe" );
	document.body.appendChild( iframe );

	try {
		body = sQuery( iframe ).contents()[ 0 ];

		try {
			assert.ok( !sQuery.isXMLDoc( body ), "Iframe body element" );
		} catch ( e ) {
			assert.ok( false, "Iframe body element exception" );
		}

	} catch ( e ) {
		assert.ok( true, "Iframe body element - iframe not working correctly" );
	}

	document.body.removeChild( iframe );
} );

QUnit.test( "XSS via location.hash", function( assert ) {
	assert.expect( 1 );

	QUnit.stop();
	sQuery[ "_check9521" ] = function( x ) {
		assert.ok( x, "script called from #id-like selector with inline handler" );
		sQuery( "#check9521" ).remove();
		delete sQuery[ "_check9521" ];
		QUnit.start();
	};
	try {

		// This throws an error because it's processed like an id
		sQuery( "#<img id='check9521' src='no-such-.gif' onerror='sQuery._check9521(false)'>" ).appendTo( "#qunit-fixture" );
	} catch ( err ) {
		sQuery[ "_check9521" ]( true );
	}
} );

QUnit.test( "isXMLDoc - XML", function( assert ) {
	assert.expect( 3 );
	var xml = createDashboardXML();
	assert.ok( sQuery.isXMLDoc( xml ), "XML document" );
	assert.ok( sQuery.isXMLDoc( xml.documentElement ), "XML documentElement" );
	assert.ok( sQuery.isXMLDoc( sQuery( "tab", xml )[ 0 ] ), "XML Tab Element" );
} );





QUnit.test( "sQuery(tag-hyphenated elements) gh-1987", function( assert ) {
	assert.expect( 17 );

	sQuery.each( "thead tbody tfoot colgroup caption tr th td".split( " " ), function( i, name ) {
		var j = sQuery( "<" + name + "-d></" + name + "-d>" );
		assert.ok( j[ 0 ], "Create a tag-hyphenated elements" );
		assert.ok( sQuery.nodeName( j[ 0 ], name.toUpperCase() + "-D" ), "Tag-hyphenated element has expected node name" );
	} );

	var j = sQuery( "<tr-multiple-hyphens></tr-multiple-hyphens>" );
	assert.ok( sQuery.nodeName( j[ 0 ], "TR-MULTIPLE-HYPHENS" ), "Element with multiple hyphens in its tag has expected node name" );
} );

QUnit.test( "sQuery('massive html #7990')", function( assert ) {
	assert.expect( 3 );

	var i,
		li = "<li>very very very very large html string</li>",
		html = [ "<ul>" ];

	for ( i = 0; i < 30000; i += 1 ) {
		html[ html.length ] = li;
	}
	html[ html.length ] = "</ul>";
	html = sQuery( html.join( "" ) )[ 0 ];
	assert.equal( html.nodeName.toLowerCase(), "ul" );
	assert.equal( html.firstChild.nodeName.toLowerCase(), "li" );
	assert.equal( html.childNodes.length, 30000 );
} );

QUnit.test( "sQuery('html', context)", function( assert ) {
	assert.expect( 1 );

	var $div = sQuery( "<div/>" )[ 0 ],
		$span = sQuery( "<span/>", $div );
	assert.equal( $span.length, 1, "verify a span created with a div context works, #1763" );
} );

QUnit.test( "sQuery(selector, xml).text(str) - loaded via xml document", function( assert ) {
	assert.expect( 2 );

	var xml = createDashboardXML(),

	// tests for #1419 where ie was a problem
		tab = sQuery( "tab", xml ).eq( 0 );
	assert.equal( tab.text(), "blabla", "verify initial text correct" );
	tab.text( "newtext" );
	assert.equal( tab.text(), "newtext", "verify new text correct" );
} );

QUnit.test( "end()", function( assert ) {
	assert.expect( 3 );
	assert.equal( "Yahoo", sQuery( "#yahoo" ).parent().end().text(), "check for end" );
	assert.ok( sQuery( "#yahoo" ).end(), "check for end with nothing to end" );

	var x = sQuery( "#yahoo" );
	x.parent();
	assert.equal( "Yahoo", sQuery( "#yahoo" ).text(), "check for non-destructive behaviour" );
} );

QUnit.test( "length", function( assert ) {
	assert.expect( 1 );
	assert.equal( sQuery( "#qunit-fixture p" ).length, 6, "Get Number of Elements Found" );
} );

QUnit.test( "get()", function( assert ) {
	assert.expect( 1 );
	assert.deepEqual( sQuery( "#qunit-fixture p" ).get(), q( "firstp", "ap", "sndp", "en", "sap", "first" ), "Get All Elements" );
} );



QUnit.test( "get(Number)", function( assert ) {
	assert.expect( 2 );
	assert.equal( sQuery( "#qunit-fixture p" ).get( 0 ), document.getElementById( "firstp" ), "Get A Single Element" );
	assert.strictEqual( sQuery( "#firstp" ).get( 1 ), undefined, "Try get with index larger elements count" );
} );

QUnit.test( "get(-Number)", function( assert ) {
	assert.expect( 2 );
	assert.equal( sQuery( "p" ).get( -1 ), document.getElementById( "first" ), "Get a single element with negative index" );
	assert.strictEqual( sQuery( "#firstp" ).get( -2 ), undefined, "Try get with index negative index larger then elements count" );
} );



QUnit.test( "slice()", function( assert ) {
	assert.expect( 7 );

	var $links = sQuery( "#ap a" );

	assert.deepEqual( $links.slice( 1, 2 ).get(), q( "groups" ), "slice(1,2)" );
	assert.deepEqual( $links.slice( 1 ).get(), q( "groups", "anchor1", "mark" ), "slice(1)" );
	assert.deepEqual( $links.slice( 0, 3 ).get(), q( "google", "groups", "anchor1" ), "slice(0,3)" );
	assert.deepEqual( $links.slice( -1 ).get(), q( "mark" ), "slice(-1)" );

	assert.deepEqual( $links.eq( 1 ).get(), q( "groups" ), "eq(1)" );
	assert.deepEqual( $links.eq( "2" ).get(), q( "anchor1" ), "eq('2')" );
	assert.deepEqual( $links.eq( -1 ).get(), q( "mark" ), "eq(-1)" );
} );

QUnit.test( "first()/last()", function( assert ) {
	assert.expect( 4 );

	var $links = sQuery( "#ap a" ), $none = sQuery( "asdf" );

	assert.deepEqual( $links.first().get(), q( "google" ), "first()" );
	assert.deepEqual( $links.last().get(), q( "mark" ), "last()" );

	assert.deepEqual( $none.first().get(), [], "first() none" );
	assert.deepEqual( $none.last().get(), [], "last() none" );
} );




QUnit.test( "JIT compilation does not interfere with length retrieval (gh-2145)", function( assert ) {
	assert.expect( 4 );

	var i;

	// Trigger JIT compilation of sQuery.each – and therefore isArraylike – in iOS.
	// Convince JSC to use one of its optimizing compilers
	// by providing code which can be LICM'd into nothing.
	for ( i = 0; i < 1000; i++ ) {
		sQuery.each( [] );
	}

	i = 0;
	sQuery.each( { 1: "1", 2: "2", 3: "3" }, function( index ) {
		assert.equal( ++i, index, "Iteration over object with solely " +
			"numeric indices (gh-2145 JIT iOS 8 bug)" );
	} );
	assert.equal( i, 3, "Iteration over object with solely " +
		"numeric indices (gh-2145 JIT iOS 8 bug)" );
} );

QUnit.test( "sQuery.makeArray", function( assert ) {
	assert.expect( 15 );

	assert.equal( sQuery.makeArray( sQuery( "html>*" ) )[ 0 ].nodeName.toUpperCase(), "HEAD", "Pass makeArray a sQuery object" );

	assert.equal( sQuery.makeArray( document.getElementsByName( "PWD" ) ).slice( 0, 1 )[ 0 ].name, "PWD", "Pass makeArray a nodelist" );

	assert.equal( ( function() { return sQuery.makeArray( arguments ); } )( 1, 2 ).join( "" ), "12", "Pass makeArray an arguments array" );

	assert.equal( sQuery.makeArray( [ 1,2,3 ] ).join( "" ), "123", "Pass makeArray a real array" );

	assert.equal( sQuery.makeArray().length, 0, "Pass nothing to makeArray and expect an empty array" );

	assert.equal( sQuery.makeArray( 0 )[ 0 ], 0, "Pass makeArray a number" );

	assert.equal( sQuery.makeArray( "foo" )[ 0 ], "foo", "Pass makeArray a string" );

	assert.equal( sQuery.makeArray( true )[ 0 ].constructor, Boolean, "Pass makeArray a boolean" );

	assert.equal( sQuery.makeArray( document.createElement( "div" ) )[ 0 ].nodeName.toUpperCase(), "DIV", "Pass makeArray a single node" );

	assert.equal( sQuery.makeArray( { length:2, 0:"a", 1:"b" } ).join( "" ), "ab", "Pass makeArray an array like map (with length)" );

	assert.ok( !!sQuery.makeArray( document.documentElement.childNodes ).slice( 0, 1 )[ 0 ].nodeName, "Pass makeArray a childNodes array" );

	// function, is tricky as it has length
	assert.equal( sQuery.makeArray( function() { return 1;} )[ 0 ](), 1, "Pass makeArray a function" );

	//window, also has length
	assert.equal( sQuery.makeArray( window )[ 0 ], window, "Pass makeArray the window" );

	assert.equal( sQuery.makeArray( /a/ )[ 0 ].constructor, RegExp, "Pass makeArray a regex" );

	// Some nodes inherit traits of nodelists
	assert.ok( sQuery.makeArray( document.getElementById( "form" ) ).length >= 13,
		"Pass makeArray a form (treat as elements)" );
} );



QUnit.test( "sQuery.proxy", function( assert ) {
	assert.expect( 9 );

	var test2, test3, test4, fn, cb,
		test = function() {
			assert.equal( this, thisObject, "Make sure that scope is set properly." );
		},
		thisObject = { foo: "bar", method: test };

	// Make sure normal works
	test.call( thisObject );

	// Basic scoping
	sQuery.proxy( test, thisObject )();

	// Another take on it
	sQuery.proxy( thisObject, "method" )();

	// Make sure it doesn't freak out
	assert.equal( sQuery.proxy( null, thisObject ), undefined, "Make sure no function was returned." );

	// Partial application
	test2 = function( a ) {
		assert.equal( a, "pre-applied", "Ensure arguments can be pre-applied." );
	};
	sQuery.proxy( test2, null, "pre-applied" )();

	// Partial application w/ normal arguments
	test3 = function( a, b ) {
		assert.equal( b, "normal", "Ensure arguments can be pre-applied and passed as usual." );
	};
	sQuery.proxy( test3, null, "pre-applied" )( "normal" );

	// Test old syntax
	test4 = { "meth": function( a ) {
		assert.equal( a, "boom", "Ensure old syntax works." );
	} };
	sQuery.proxy( test4, "meth" )( "boom" );

	// sQuery 1.9 improved currying with `this` object
	fn = function() {
		assert.equal( Array.prototype.join.call( arguments, "," ), "arg1,arg2,arg3", "args passed" );
		assert.equal( this.foo, "bar", "this-object passed" );
	};
	cb = sQuery.proxy( fn, null, "arg1", "arg2" );
	cb.call( thisObject, "arg3" );
} );



// if ( sQuery.support.createHTMLDocument ) {
// 	QUnit.asyncTest( "sQuery.parseHTML", function( assert ) {
// 		assert.expect( 1 );

// 		Globals.register( "parseHTMLError" );

// 		sQuery.globalEval( "parseHTMLError = false;" );
// 		sQuery.parseHTML( "<img src=x onerror='parseHTMLError = true'>" );

// 		window.setTimeout( function() {
// 			QUnit.start();
// 			assert.equal( window.parseHTMLError, false, "onerror eventhandler has not been called." );
// 		}, 2000 );
// 	} );
// }

QUnit.test( "sQuery.parseJSON", function( assert ) {
	assert.expect( 20 );

	assert.strictEqual( sQuery.parseJSON( null ), null, "primitive null" );
	assert.strictEqual( sQuery.parseJSON( "0.88" ), 0.88, "Number" );
	assert.strictEqual(
		sQuery.parseJSON( "\" \\\" \\\\ \\/ \\b \\f \\n \\r \\t \\u007E \\u263a \"" ),
		" \" \\ / \b \f \n \r \t ~ \u263A ",
		"String escapes"
	);
	assert.deepEqual( sQuery.parseJSON( "{}" ), {}, "Empty object" );
	assert.deepEqual( sQuery.parseJSON( "{\"test\":1}" ), { "test": 1 }, "Plain object" );
	assert.deepEqual( sQuery.parseJSON( "[0]" ), [ 0 ], "Simple array" );

	assert.deepEqual(
		sQuery.parseJSON( "[ \"string\", -4.2, 2.7180e0, 3.14E-1, {}, [], true, false, null ]" ),
		[ "string", -4.2, 2.718, 0.314, {}, [], true, false, null ],
		"Array of all data types"
	);
	assert.deepEqual(
		sQuery.parseJSON( "{ \"string\": \"\", \"number\": 4.2e+1, \"object\": {}," +
			"\"array\": [[]], \"boolean\": [ true, false ], \"null\": null }" ),
		{ string: "", number: 42, object: {}, array: [ [] ], "boolean": [ true, false ], "null": null },
		"Dictionary of all data types"
	);

	assert.deepEqual( sQuery.parseJSON( "\n{\"test\":1}\t" ), { "test": 1 },
		"Leading and trailing whitespace are ignored" );

	assert.throws( function() {
		sQuery.parseJSON();
	}, null, "Undefined raises an error" );
	assert.throws( function() {
		sQuery.parseJSON( "" );
	}, null, "Empty string raises an error" );
	assert.throws( function() {
		sQuery.parseJSON( "''" );
	}, null, "Single-quoted string raises an error" );
	/*

	// Broken on IE8
	assert.throws(function() {
		sQuery.parseJSON("\" \\a \"");
	}, null, "Invalid string escape raises an error" );

	// Broken on IE8, Safari 5.1 Windows
	assert.throws(function() {
		sQuery.parseJSON("\"\t\"");
	}, null, "Unescaped control character raises an error" );

	// Broken on IE8
	assert.throws(function() {
		sQuery.parseJSON(".123");
	}, null, "Number with no integer component raises an error" );

	*/
	assert.throws( function() {
		var result = sQuery.parseJSON( "0101" );

		// Support: IE9+
		// Ensure base-10 interpretation on browsers that erroneously accept leading-zero numbers
		if ( result === 101 ) {
			throw new Error( "close enough" );
		}
	}, null, "Leading-zero number raises an error or is parsed as decimal" );
	assert.throws( function() {
		sQuery.parseJSON( "{a:1}" );
	}, null, "Unquoted property raises an error" );
	assert.throws( function() {
		sQuery.parseJSON( "{'a':1}" );
	}, null, "Single-quoted property raises an error" );
	assert.throws( function() {
		sQuery.parseJSON( "[,]" );
	}, null, "Array element elision raises an error" );
	assert.throws( function() {
		sQuery.parseJSON( "{},[]" );
	}, null, "Comma expression raises an error" );
	assert.throws( function() {
		sQuery.parseJSON( "[]\n,{}" );
	}, null, "Newline-containing comma expression raises an error" );
	assert.throws( function() {
		sQuery.parseJSON( "\"\"\n\"\"" );
	}, null, "Automatic semicolon insertion raises an error" );

	assert.strictEqual( sQuery.parseJSON( [ 0 ] ), 0, "Input cast to string" );
} );

QUnit.test( "sQuery.parseXML", function( assert ) {
	assert.expect( 8 );

	var xml, tmp;
	try {
		xml = sQuery.parseXML( "<p>A <b>well-formed</b> xml string</p>" );
		tmp = xml.getElementsByTagName( "p" )[ 0 ];
		assert.ok( !!tmp, "<p> present in document" );
		tmp = tmp.getElementsByTagName( "b" )[ 0 ];
		assert.ok( !!tmp, "<b> present in document" );
		assert.strictEqual( tmp.childNodes[ 0 ].nodeValue, "well-formed", "<b> text is as expected" );
	} catch ( e ) {
		assert.strictEqual( e, undefined, "unexpected error" );
	}
	try {
		xml = sQuery.parseXML( "<p>Not a <<b>well-formed</b> xml string</p>" );
		assert.ok( false, "invalid xml not detected" );
	} catch ( e ) {
		assert.strictEqual( e.message, "Invalid XML: <p>Not a <<b>well-formed</b> xml string</p>", "invalid xml detected" );
	}
	try {
		xml = sQuery.parseXML( "" );
		assert.strictEqual( xml, null, "empty string => null document" );
		xml = sQuery.parseXML();
		assert.strictEqual( xml, null, "undefined string => null document" );
		xml = sQuery.parseXML( null );
		assert.strictEqual( xml, null, "null string => null document" );
		xml = sQuery.parseXML( true );
		assert.strictEqual( xml, null, "non-string => null document" );
	} catch ( e ) {
		assert.ok( false, "empty input throws exception" );
	}
} );



// testIframeWithCallback(
// 	"Conditional compilation compatibility (#13274)",
// 	"core/cc_on.html",
// 	function( cc_on, errors, $, assert ) {
// 		assert.expect( 3 );
// 		assert.ok( true, "JScript conditional compilation " + ( cc_on ? "supported" : "not supported" ) );
// 		assert.deepEqual( errors, [], "No errors" );
// 		assert.ok( $(), "sQuery executes" );
// 	}
// );

// iOS7 doesn't fire the load event if the long-loading iframe gets its source reset to about:blank.
// This makes this test fail but it doesn't seem to cause any real-life problems so blacklisting
// this test there is preferred to complicating the hard-to-test core/ready code further.
// if ( !/iphone os 7_/i.test( navigator.userAgent ) ) {
// 	testIframeWithCallback(
// 		"document ready when sQuery loaded asynchronously (#13655)",
// 		"core/dynamic_ready.html",
// 		function( ready, assert ) {
// 			assert.expect( 1 );
// 			assert.equal( true, ready, "document ready correctly fired when sQuery is loaded after DOMContentLoaded" );
// 		}
// 	);
// }

// testIframeWithCallback(
// 	"Tolerating alias-masked DOM properties (#14074)",
// 	"core/aliased.html",
// 	function( errors, assert ) {
// 		assert.expect( 1 );
// 		assert.deepEqual( errors, [], "sQuery loaded" );
// 	}
// );

// testIframeWithCallback(
// 	"Don't call window.onready (#14802)",
// 	"core/onready.html",
// 	function( error, assert ) {
// 		assert.expect( 1 );
// 		assert.equal( error, false, "no call to user-defined onready" );
// 	}
// );

QUnit.test( "Iterability of sQuery objects (gh-1693)", function( assert ) {
	/* jshint unused: false */
	assert.expect( 1 );

	var i, elem, result;

	if ( typeof Symbol === "function" ) {

		elem = sQuery( "<div></div><span></span><a></a>" );
		result = "";

		try {
			eval( "for ( i of elem ) { result += i.nodeName; }" );
		} catch ( e ) {}
		assert.equal( result, "DIVSPANA", "for-of works on sQuery objects" );
	} else {
		assert.ok( true, "The browser doesn't support Symbols" );
	}
} );
