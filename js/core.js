(function ($, window) {

    'use strict';

    if (!window.jQuery) {
        return;
    }

    $.TableEdid = {};

    Object.defineProperties($.TableEdid, {

        _defaults: {
            value: {}
        },

        defaults: {
            get: function() {
                return this._defaults;
            },
            set: function( newSettings ) {
                if ( newSettings instanceof Object ) {
                    $.extend(true, this._defaults, newSettings);
                }
            }
        },

    });

})(jQuery, window);