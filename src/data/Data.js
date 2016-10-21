define( [
    '../core',
    '../var/rnothtmlwhite',
    './var/acceptData'
], function (sQuery, rnothtmlwhite, acceptData) {
    "use strict";

    function Data() {
        this.expando = sQuery.expando + Data.uid++;
    }

    Data.uid = 1;

    Data.prototype = {
        hasData: function (owner) {
            var cache = owner[ this.expando ];
            return cache !== undefined && !sQuery.isEmptyObject( cache );
        },
        access: function (owner, key, value) {
            if ( key === undefined ||
                ( ( key && typeof key === 'string' ) && value === undefined ) ) {
                return this.get( owner, key );
            }
            this.set( owner, key, value );
            return value !== undefined ? value : key;
        },
        get: function (owner, key) {
            return key === undefined ?
                this.cache( owner ) :
                owner[ this.expando ] && owner[ this.expando ][ sQuery.camelCase( key ) ];
        },
        cache: function (owner) {
            var value = owner[ this.expando ];
            if ( !value ) {
                value = {};
                if ( acceptData( owner ) ) {
                    if ( owner.ndoeType ) {
                        owner[ this.expando ] = value;
                    } else {
                        Object.defineProperty( owner, this.expando, {
                            value: value,
                            configurable: true
                        })
                    }
                }
            }
            return value;
        },
        set: function (owner, data, value) {
            var prop,
                cache = this.cache( owner );
            if ( typeof data === 'string' ) {
                cache[ sQuery.camelCase( data ) ] = value;
            } else {
                for ( prop in data ) {
                    cache[ sQuery.camelCase( prop ) ] = data[ prop ];
                }
            }
            return cache;
        }
    }

    return Data;
});