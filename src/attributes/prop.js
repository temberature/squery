define(['../core'], function(sQuery) {
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
		}
	})
})