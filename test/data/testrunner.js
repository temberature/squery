window.moduleTeardown = function( assert ) {
    var i, expectedKeys, actualKeys,
        cacheLength = 0;

    // Only look for jQuery data problems if this test actually
    // provided some information to compare against.
    if ( QUnit.urlParams.jqdata || this.checkJqData ) {
        for ( i in jQuery.cache ) {
            expectedKeys = expectedDataKeys[ i ];
            actualKeys = jQuery.cache[ i ] ? Object.keys( jQuery.cache[ i ] ) : jQuery.cache[ i ];
            if ( !QUnit.equiv( expectedKeys, actualKeys ) ) {
                assert.deepEqual( actualKeys, expectedKeys, "Expected keys exist in jQuery.cache" );
            }
            delete jQuery.cache[ i ];
            delete expectedDataKeys[ i ];
        }

        // In case it was removed from cache before (or never there in the first place)
        for ( i in expectedDataKeys ) {
            assert.deepEqual(
                expectedDataKeys[ i ],
                undefined,
                "No unexpected keys were left in jQuery.cache (#" + i + ")"
            );
            delete expectedDataKeys[ i ];
        }
    }

    // Reset data register
    expectedDataKeys = {};

    // Check for (and clean up, if possible) incomplete animations/requests/etc.
    if ( jQuery.timers && jQuery.timers.length !== 0 ) {
        assert.equal( jQuery.timers.length, 0, "No timers are still running" );
        splice.call( jQuery.timers, 0, jQuery.timers.length );
        jQuery.fx.stop();
    }
    if ( jQuery.active !== undefined && jQuery.active !== oldActive ) {
        assert.equal( jQuery.active, oldActive, "No AJAX requests are still active" );
        if ( ajaxTest.abort ) {
            ajaxTest.abort( "active requests" );
        }
        oldActive = jQuery.active;
    }

    Globals.cleanup();

    for ( i in jQuery.cache ) {
        ++cacheLength;
    }

    // Because QUnit doesn't have a mechanism for retrieving
    // the number of expected assertions for a test,
    // if we unconditionally assert any of these,
    // the test will fail with too many assertions :|
    if ( cacheLength !== oldCacheLength ) {
        assert.equal( cacheLength, oldCacheLength, "No unit tests leak memory in jQuery.cache" );
        oldCacheLength = cacheLength;
    }
};