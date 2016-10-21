define(['../core', '../core/access'], function(sQuery, access) {
	sQuery.extend({
		propFix: {
			"tabindex": "tabIndex",
			"readonly": "readOnly",
			"for": "htmlFor",
			"class": "className",
			"maxlength": "maxLength",
			"cellspacing": "cellSpacing",
			"cellpadding": "cellPadding",
			"rowspan": "rowSpan",
			"colspan": "colSpan",
			"usemap": "useMap",
			"frameborder": "frameBorder",
			"contenteditable": "contentEditable"			
		},
		propHooks: {

		},
		prop: function (elem, name, value) {
			var nType = elem.nodeType;
			if ( nType === 3 || nType === 8 || nType === 2) {
				return;
			}

			name = sQuery.propFix[ name ] || name;
			// hooks = sQuery.propHooks[ name ];

			if ( value !== undefined ) {
				return ( elem[ name ] = value );
			}

			return elem[ name ];
		}
	})
	sQuery.fn.extend({
		prop: function ( name, value ) {
			return access( this, sQuery.prop, name, value, arguments.length > 1 );
		}
	})
})