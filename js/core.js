(function ($, window) {

    'use strict';

    if(!window.jQuery) {
        return;
    }

    $.TableEdid = {};

    Object.defineProperties($.TableEdid, {

        _plugin: {
            value: {

                doAction: function( name, args, context ) {
                    var callbacks = $.TableEdid.callbacks;
                    if( callbacks[name] && callbacks[name].length ) {
                        for(var i = 0; i < callbacks[name].length; i++ ) {
                            var fn = callbacks[name][i],
                                res = fn.apply((context || this),[args,callbacks[name],i,name]);
                            if(!res) break;
                        }
                    }
                },

                init: function( selector ) {
                    var arrInit = $.TableEdid.init;
                    if( arrInit.length ) {
                        for(var i = 0; i < arrInit.length; i++ ) {
                            try {
                                this[ arrInit[ i ] ].apply(this,[selector,arrInit,i]);
                            } catch (e) {
                                arrInit[ i ].apply(this,[selector,arrInit,i]);
                            }
                        }
                    }
                },

                doMethod: function( method, args ) {
                    if( ! this[ method ] ) return;
                    var name = method.charAt(0) == '_' ? method.substring(1) : method;
                    this.doAction( name + 'Before', args );
                    if(this[name + 'Before'] && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](args) == true || !this[name + 'Before']) {
                        var result = this[ method ].call( this, args );
                    }
                    if(this[name + 'After'] && typeof this[name + 'After'] == 'function')
                        this[name + 'After'](args);
                    this.doAction( name + 'After', args );
                    if( result !== undefined ) return result;
                }

            }
        },

        plugin: {
            get: function() {
                return this._plugin;
            },
            set: function( newSettings ) {
                if( newSettings instanceof Object ) {
                    $.extend(true, this._plugin, newSettings);
                }
            }
        },

        _callbacks: {
            value: {

                refresh: function( object ) {
                    var obj = object || $.TableEdid.plugin;
                    var recent = [];
                    for( var method in obj ) {
                        if( method.charAt(0) == '_' && typeof obj[method] == 'function' ) {
                            if(! $.TableEdid.callbacks[method + 'Before'] ) {
                                (function( method ) {
                                    Object.defineProperty($.TableEdid.callbacks, method + 'Before', {
                                        value: []
                                    });
                                })(method);
                            }
                            if(! $.TableEdid.callbacks[method.substring(1) + 'Before'] ) {
                                (function( method ) {
                                    Object.defineProperty($.TableEdid.callbacks, method.substring(1) + 'Before', {
                                        get: function() {
                                            return this[method + 'Before'];
                                        },
                                        set: function( callback ) {
                                            if( typeof callback == 'function' ) {
                                                this[method + 'Before'].push(callback);
                                            }
                                            else if( Array.isArray(callback) && callback.length > 1 && typeof callback[0] == 'function' ) {
                                                this[method + 'Before'].splice( callback[1], 0, callback[0] );
                                            }
                                        }
                                    });
                                    recent.push( method.substring(1) + 'Before' );
                                })(method);
                            }
                            if(! $.TableEdid.callbacks[method + 'After'] ) {
                                (function( method ) {
                                    Object.defineProperty($.TableEdid.callbacks, method + 'After', {
                                        value: []
                                    });
                                })(method);
                            }
                            if(! $.TableEdid.callbacks[method.substring(1) + 'After'] ) {
                                (function( method ) {
                                    Object.defineProperty($.TableEdid.callbacks, method.substring(1) + 'After', {
                                        get: function() {
                                            return this[method + 'After'];
                                        },
                                        set: function( callback ) {
                                            if( typeof callback == 'function' ) {
                                                this[method + 'After'].push(callback);
                                            }
                                            else if( Array.isArray(callback) && callback.length > 1 && typeof callback[0] == 'function' ) {
                                                this[method + 'After'].splice( callback[1], 0, callback[0] );
                                            }
                                        }
                                    });
                                    recent.push( method.substring(1) + 'After' );
                                })(method);
                            }
                        }
                    }
                    return {
                        recent: recent,
                        eachCallback: function( fn, context ) {
                            for( var i = 0, length = this.recent.length; i < length; i++ ) {
                                fn.call((context || this), this.recent[i]);
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
                if( newCallbacks instanceof Object ) {
                    $.extend(true, this._callbacks, newCallbacks);
                }
            }
        },

        _init: {
            value: []
        },

        init: {
            get: function() {
                return this._init;
            },
            set: function( fName ) {
                if( typeof fName == 'function' || this.plugin[fName] && typeof this.plugin[ fName ] == 'function' ) {
                    this._init.push(fName);
                }
                else if( Array.isArray(fName) && fName.length > 1 && typeof fName[0] == 'function' || Array.isArray(fName) && fName.length > 1 && this.plugin[ fName[0] ] && typeof this.plugin[ fName[0] ] == 'function' ) {
                    this._init.splice( fName[1], 0, fName[0] );
                }
            }
        },

        _localPlugin: {
            value: {}
        },

        localPlugin: {
            get: function() {
                return this._localPlugin;
            },
            set: function( object ) {
                if( object instanceof Object ) {
                    $.extend(true, this._localPlugin, object);
                }
            }
        }

    });

    $.fn.tableEdid = function( options ) {

        if( Array.isArray(this) || this.length == 1 || this instanceof Object ) {

            var localPlugin = {};

            for( var property in $.TableEdid.localPlugin ) {
                if( typeof $.TableEdid.localPlugin[ property ] == 'function' ) {
                    localPlugin[ property ] = $.TableEdid.localPlugin[ property ]();
                }
                else {
                    localPlugin[ property ] = $.TableEdid.localPlugin[ property ];
                }
            }

            var options = options || {},
                that = $.extend(true,
                    localPlugin,
                    $.TableEdid.plugin,
                    options
                );

            that.init( this );
            return this;
        }

        return this.each(function() {
            $( this ).tableEdid( options );
        });

    };

    if(! Array.prototype.tableEdid) {

        Object.defineProperty(Array.prototype, "tableEdid", {
            value: $.fn.tableEdid
        });

    }

    if(! Object.prototype.tableEdid) {

        Object.defineProperty(Object.prototype, "tableEdid", {
            value: $.fn.tableEdid
        });

    }

})(jQuery, window);
