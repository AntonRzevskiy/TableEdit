(function ($, window) {

    'use strict';

    if (!window.jQuery) {
        return;
    }

    $.TableEdid = {};

    Object.defineProperties($.TableEdid, {

        _defaults: {
            value: {

                doAction: function( name, args, context ) {
                    var callbacks = $.TableEdid.callbacks;
                    if( callbacks.hasOwnProperty(name) && callbacks[name].length ) {
                        for(var i = 0; i < callbacks[name].length; i++ ) {
                            var fn = callbacks[name][i],
                                res = fn.apply((context || this),[callbacks[name],i,args]);
                            if(!res) break;
                        }
                    }
                }

            }
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

        _callbacks: {
            value: {

                refresh: function( object ) {
                    var obj = object || $.TableEdid.defaults;
                    for( var method in obj ) {
                        if( method.charAt(0) == '_' && typeof obj[method] == 'function' ) {
                            if(! $.TableEdid.callbacks.hasOwnProperty(method + 'Before') ) {
                                (function( method ) {
                                    Object.defineProperty($.TableEdid.callbacks, method + 'Before', {
                                        value: []
                                    });
                                })(method);
                            }
                            if(! $.TableEdid.callbacks.hasOwnProperty(method.substring(1) + 'Before') ) {
                                (function( method ) {
                                    Object.defineProperty($.TableEdid.callbacks, method.substring(1) + 'Before', {
                                        get: function() {
                                            return this[method + 'Before'];
                                        },
                                        set: function( callback ) {
                                            if ( typeof callback == 'function' ) {
                                                this[method + 'Before'].push(callback);
                                            }
                                            else if( Array.isArray(callback) && callback.length > 1 && typeof callback[0] == 'function' ) {
                                                this[method + 'Before'].splice( callback[1], 0, callback[0] );
                                            }
                                        }
                                    });
                                })(method);
                            }
                            if(! $.TableEdid.callbacks.hasOwnProperty(method + 'After') ) {
                                (function( method ) {
                                    Object.defineProperty($.TableEdid.callbacks, method + 'After', {
                                        value: []
                                    });
                                })(method);
                            }
                            if(! $.TableEdid.callbacks.hasOwnProperty(method.substring(1) + 'After') ) {
                                (function( method ) {
                                    Object.defineProperty($.TableEdid.callbacks, method.substring(1) + 'After', {
                                        get: function() {
                                            return this[method + 'After'];
                                        },
                                        set: function( callback ) {
                                            if ( typeof callback == 'function' ) {
                                                this[method + 'After'].push(callback);
                                            }
                                            else if( Array.isArray(callback) && callback.length > 1 && typeof callback[0] == 'function' ) {
                                                this[method + 'After'].splice( callback[1], 0, callback[0] );
                                            }
                                        }
                                    });
                                })(method);
                            }
                        }
                    }
                }

            }
        },

        callbacks: {
            get: function() {
                return this._callbacks;
            },
            set: function( newCallbacks ) {
                if ( newCallbacks instanceof Object ) {
                    $.extend(true, this._callbacks, newCallbacks);
                }
            }
        }

    });

    $.fn.TableEdid = function( options ) {

        var localDefaults = {

                $table: $('<table/>'),
                $thead: $('<thead/>'),
                $tfoot: $('<tfoot/>'),
                $tbody: $('<tbody/>'),
                dataTableArray: [],

            },
            options = options || {},
            that = $.extend(true,
                localDefaults,
                $.TableEdid.defaults,
                options
            );

        return this;

    }

    if(! Array.prototype.TableEdid) {

        Object.defineProperty(Array.prototype, "TableEdid", {
            value: $.fn.TableEdid
        });

    }

})(jQuery, window);