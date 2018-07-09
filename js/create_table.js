/**
 * Plugin for creating an editable table from an array, textarea, table and not only.
 * You can easily add and delete rows, cells.
 * The plugin contains enough options and callback functions for quick customization for your task.
 *
 * @author     Rzhevskiy Anton <antonrzhevskiy@gmail.com>
 */

/**
 * Functions for creating a table from data.
 *
 * @link       https://github.com/AntonRzevskiy/TableEdit/blob/master/js/create_table.js
 * @since      0.0.1
 *
 * @package    TableEdit
 * @subpackage TableEdit/js
 */
jQuery(document).ready(function($){

    if( !$.TableEdit ) return;

    $.TableEdit.localPlugin = {

        /**
         * HTML element TABLE.
         *
         * @since    0.0.1
         *
         * @var      Node    table    HTML Node.
         */
        'table': function(){
            return document.createElement('table');
        },

        /**
         * HTML element THEAD.
         *
         * @since    0.0.1
         *
         * @var      Node    thead    HTML Node.
         */
        'thead': function(){
            return document.createElement('thead');
        },

        /**
         * HTML element TFOOT.
         *
         * @since    0.0.1
         *
         * @var      Node    tfoot    HTML Node.
         */
        'tfoot': function(){
            return document.createElement('tfoot');
        },

        /**
         * HTML element TBODY.
         *
         * @since    0.0.1
         *
         * @var      Node    tbody    HTML Node.
         */
        'tbody': function(){
            return document.createElement('tbody');
        },

        /**
         * General object with table data.
         *
         * @dataTableArray contains @dataTbodyArray, @dataTheadArray & @dataTfootArray
         * to combine data into one array.
         *
         * @since    0.0.1
         *
         * @var      object     dataTableObject    Table data.
         */
        'dataTableObject': function() {
            return {
                'tbodyArray': [],
                'theadArray': [],
                'tfootArray': []
            }
        },

        /**
         * Number of columns.
         *
         * @since    0.0.1
         *
         * @var      bool/int     _numberOfColumns    Count table columns.
         */
        '_numberOfColumns': false,
    };

    $.TableEdit.plugin = {

        /**
         * The default data table array
         *
         * @since    0.0.1
         *
         * @var      array    dataTableDefaultArray    Optional. Tboody data. Default empty.
         */
        'dataTableDefaultArray': [],

        /**
         * Retrieve group data.
         *
         * This method use @toLowerCase javaScript.
         *
         * @since    0.0.1
         *
         * @param    string   group    Name of group.
         *
         * @return   array    Actual link to data. Empty array if failed.
         */
        'getGroup': function( group ) {
            switch( group.toLowerCase() ) {
                case 'tbodyarray':
                // short aliases
                case 'tbody': case 'b':
                 return this.dataTableObject.tbodyArray;
                  break;

                case 'theadarray':
                // short aliases
                case 'thead': case 'h':
                 return this.dataTableObject.theadArray;
                  break;

                case 'tfootarray':
                // short aliases
                case 'tfoot': case 'f':
                 return this.dataTableObject.tfootArray;
                  break;

                default: return [];
            }
        },

        /**
         * Create HTML Node element.
         *
         * @since    0.0.1
         *
         * @param    string   name    Name of HTML element.
         *
         * @return   Node     Link to HTML element.
         */
        'createEL': function( name ) {
            return document.createElement( name );
        },

        /**
         * Set/Get HTML of Node element.
         *
         * @since    0.0.1
         *
         * @param    Node              element    Link to HTML element.
         * @param    string/function   val        Optional. String will be inserted in element.
         *                                        Function will receive element as a context.
         *
         * @return   Node/string       DOM Element if @val defined. Element content otherwise.
         */
        'html': function( element, val ) {
            if( typeof val === 'function' ) {
                val.call( element );
                return element;
            }
            if( val !== undefined ) {
                element.innerHTML = val;
                return element;
            }
            return element.innerHTML;
        },

        /**
         * 
         * must return DOM Element if @val defined
         */
        'attr': function( element, attr, val ) {
            if( val !== undefined ) {
                element.setAttribute( attr, val + '' );
                return element;
            }
            if( element.hasAttribute( attr ) ) {
                return element.getAttribute( attr );
            }
            return undefined;
        },

        /**
         * 
         */
        'getNumOfCols': function() {
            return this._numberOfColumns || 0;
        },

        /**
         * 
         */
        '_compileTable': function() {
            this.table.appendChild( this.thead );
            this.table.appendChild( this.tfoot );
            this.table.appendChild( this.tbody );
        },

        /**
         * 
         * @selector - 
         */
        '_defineType': function( params ) {
            if( Array.isArray( params.selector ) ) {
                try {
                    this.dataTableObject.tbodyArray = params.selector;
                } catch (e) {
                    console.error(e);
                    this.dataTableObject.tbodyArray = this.dataTableDefaultArray;
                }
            }
            if( params.selector instanceof Object ) {
                try {
                    this.dataTableObject.theadArray = params.selector.theadArray || [];
                    this.dataTableObject.tbodyArray = params.selector.tbodyArray || [];
                    this.dataTableObject.tfootArray = params.selector.tfootArray || [];
                } catch (e) {
                    console.error(e);
                    this.dataTableObject.tbodyArray = this.dataTableDefaultArray;
                }
            }
        },

        /**
         * 
         */
        'controlOrientation': 'right',

        /**
         * 
         */
        'topControlsElements': '<a class="addCol" href="javascript://" role="button"><span class="glyphicon glyphicon-plus"></span></a>' +
                             '<a class="delCol" href="javascript://" role="button"><span class="glyphicon glyphicon-minus"></span></a>',

        'bottomControlsElements': '<a class="addCol" href="javascript://" role="button"><span class="glyphicon glyphicon-plus"></span></a>' +
                                '<a class="delCol" href="javascript://" role="button"><span class="glyphicon glyphicon-minus"></span></a>',

        'rowControlsElements': '<a class="addrow" href="javascript://" role="button"><span class="glyphicon glyphicon-plus"></span></a>' +
                             '<a class="delrow" href="javascript://" role="button"><span class="glyphicon glyphicon-minus"></span></a>',

        'stubElements': '<a class="addCol" href="javascript://" role="button"><span class="glyphicon glyphicon-plus"></span></a>',

        /**
         * @tr - 
         */
        '_addStub': function( params ) {
            if( this.controlOrientation === 'right' ) {
                params.tr.appendChild(
                    this.html( this.createEL('td'), this.stubElements )
                );
            }
            else if( this.controlOrientation === 'left' ) {
                $( params.tr ).prepend(
                    this.html( this.createEL('td'), this.stubElements )
                );
            }
        },

        /**
         * @tr - 
         */
        '_createTopControls': function( params ) {
            for( var i = 0; i < this.getNumOfCols(); i++ ) {
                params.tr.appendChild(
                    this.html( this.createEL('td'), this.topControlsElements )
                );
            }
            this.doMethod('_addStub', params);
            $( this.thead ).prepend( params.tr );
        },

        /**
         * @tr - 
         */
        '_createBottomControls': function( params ) {
            for( var i = 0; i < this.getNumOfCols(); i++ ) {
                params.tr.appendChild(
                    this.html( this.createEL('td'), this.bottomControlsElements )
                );
            }
            this.doMethod('_addStub', params);
            this.tfoot.appendChild( params.tr );
        },

        /**
         * @tr - 
         */
        '_createRowControls': function( params ) {
            if( this.controlOrientation === 'right' ) {
                params.tr.appendChild(
                    this.html( this.createEL('td'), this.rowControlsElements )
                );
            }
            else if( this.controlOrientation === 'left' ) {
                $( params.tr ).prepend(
                    this.html( this.createEL('td'), this.rowControlsElements )
                );
            }
            return params.tr;
        },

        /**
         * @selector - 
         */
        '_defineOutputConteiner': function( params ) {
            if( this.hasOwnProperty('outputConteiner') && $(this.outputConteiner).length ) {
                // return this.outputConteiner;
                params.selector = this.outputConteiner;
            }
            else if( $('body').find(params.selector).length ) {
                // return selector;
            }
            else {
                if( this.doMethod('_defineOutputMethod', {}) === 'after' ) this.outputMethod = 'append';
                // return 'body';
                params.selector = 'body';
            }
            return params.selector;
        },

        /**
         * @method - 
         */
        '_defineOutputMethod': function( params ) {
            if( this.hasOwnProperty('outputMethod') && $.fn.hasOwnProperty( this.outputMethod ) ) {
                // return this.outputMethod;
                params.method = this.outputMethod;
            } else {
                // return 'after';
                params.method = 'after';
            }
            return params.method;
        },

        /**
         * @selector - 
         */
        '_addTable': function( params ) {
            $( this.doMethod('_defineOutputConteiner', {'selector':params.selector}) )[ this.doMethod('_defineOutputMethod', {}) ]( this.table );
        },

        /**
         * @tr - 
         */
        '_createRow': function( params ) {
            this.setNumberOfColumns( params.row );
            for( var col = 0; col < params.row.length; col++ ) {
                if( params.row[col].mx && params.row[col].mx > 1 ) {
                    // special method for skipped cells, not included in the default object
                    this.doMethod('_skippedCell', $.extend({}, params, {'col': col}));
                    continue;
                }
                params.tr.appendChild( this.createCell(
                    params.tr,      // HTML Element
                    params.row,     // Array
                    params.row[col],// Object
                    params.index,   // Number Index of row
                    col,            // Number Index of col
                    params.group,   // Array
                    params.td       // String optional
                ) );
            }
            this.doMethod('_createRowControls', params);

            return params.tr;
        },

        /**
         * @tr - 
         */
        'createCell': function( tr, row, col, rowIndex, colIndex, group, td ) {
            if( col.mx && col.mx > 1 ) return;
            return this.doMethod('_createCell', {
                'tr': tr,
                'row': row,
                'col': col,
                'rowIndex': rowIndex,
                'colIndex': colIndex,
                'group': group,
                // deffault param string, will be HTML Element
                'td': ( td ) ? this.createEL( td ) : this.createEL('td'),
            });
        },

        /**
         * @tr - 
         */
        '_createCell': function( params ) {
            if( params.col.attr )
                this.doMethod('_cellConfiguration', {'td': params.td,'attr': params.col.attr});

            if( params.col.val )
                this.html( params.td, params.col.val );

            if( params.col.callbacks )
                this.doMethod('_doDelayedFunction', params);

            this.doMethod('_setMatrix', params);

            return params.td;
        },

        /**
         * @tr - 
         */
        '_setMatrix': function( object ) {

            if( object.col.mx && object.row.length == this._numberOfColumns ) return this.attr( object.td, 'data-real-index', object.colIndex );

            if( object.col.attr && object.col.attr.colspan && object.col.attr.rowspan ) {
                var colspan = object.col.attr.colspan - 1;
                var rowspan = object.col.attr.rowspan - 1;
                while( rowspan > 0 ) {
                    var shiftIndex = object.colIndex;
                    for( var j = 0; j < object.colIndex; j++ ) {
                        var inspectionCol = object.group[ object.rowIndex + rowspan ][ j ];
                        if( inspectionCol.attr && inspectionCol.attr.colspan ) {
                            shiftIndex -= (inspectionCol.attr.colspan - 1);
                            j += (inspectionCol.attr.colspan - 1);
                        }
                    }
                    for( var i = 0; i < colspan; i++ ) {
                        object.group[ object.rowIndex + rowspan ].splice( shiftIndex, 0, {mx: 4} );
                    }
                    object.group[ object.rowIndex + rowspan ].splice( shiftIndex, 0, {mx: 3} );
                    rowspan--;
                }
                while( colspan-- > 0 ) {
                    object.group[ object.rowIndex ].splice( object.colIndex + 1, 0, {mx: 2} );
                }
                object.group[ object.rowIndex ][ object.colIndex ].mx = 1;
                return this.attr( object.td, 'data-real-index', object.colIndex );
            }
            else if( object.col.attr && object.col.attr.colspan ) {
                var colspan = object.col.attr.colspan - 1;
                while( colspan-- > 0 ) {
                    object.group[ object.rowIndex ].splice( object.colIndex + 1, 0, {mx: 2} );
                }
                object.group[ object.rowIndex ][ object.colIndex ].mx = 1;
                return this.attr( object.td, 'data-real-index', object.colIndex );
            }
            else if( object.col.attr && object.col.attr.rowspan ) {
                var rowspan = object.col.attr.rowspan - 1;
                while( rowspan > 0 ) {
                    var shiftIndex = object.colIndex;
                    for( var j = 0; j < object.colIndex; j++ ) {
                        var inspectionCol = object.group[ object.rowIndex + rowspan ][ j ];
                        if( inspectionCol.attr && inspectionCol.attr.colspan ) {
                            shiftIndex -= (inspectionCol.attr.colspan - 1);
                            j += (inspectionCol.attr.colspan - 1);
                        }
                    }
                    object.group[ object.rowIndex + rowspan ].splice( shiftIndex, 0, {mx: 3} );
                    rowspan--;
                }
                object.group[ object.rowIndex ][ object.colIndex ].mx = 1;
                return this.attr( object.td, 'data-real-index', object.colIndex );
            }
            else {
                object.group[ object.rowIndex ][ object.colIndex ].mx = 1;
                return this.attr( object.td, 'data-real-index', object.colIndex );
            }
        },

        /**
         * @row - 
         */
        'setNumberOfColumns': function( row ) {
            if( this._numberOfColumns == false ) {
                var length = row.length;
                for( var col = 0; col < row.length; col++ ) {
                    if( row[col].mx ) return this._numberOfColumns = row.length;
                    if( row[col].attr && row[col].attr.colspan ) {
                        length += (row[col].attr.colspan - 1);
                    }
                }
                return this._numberOfColumns = length;
            }
            else if( this._numberOfColumns == row.length ) {
                return this._numberOfColumns;
            }
            else {
                var length = row.length;
                for( var col = 0; col < row.length; col++ ) {
                    if( row[col].attr && row[col].attr.colspan ) {
                        length += (row[col].attr.colspan - 1);
                    }
                }
                if( this._numberOfColumns >= length ) {
                    return this._numberOfColumns;
                } else {
                    return this._numberOfColumns = length;
                }
            }
        },

        /**
         * @td - 
         * @attr - 
         */
        '_cellConfiguration': function( params ) {
            if( params.attr && typeof params.attr === 'object' ) {
                for( var attr in params.attr ) {
                    params.td.setAttribute( attr, params.attr[attr] + '' );
                    // $( params.td ).attr( attr, params.attr[attr] );
                }
            }
            return params.td;
        },

        /**
         * @td - 
         * @attr - 
         */
        'createDelayedRows': function( td ) {
            if(! this.hasOwnProperty('howCreateOnce')) return;
            var context = this,
                times = Math.ceil( this.getGroup('B').length / this.howCreateOnce ),
                interation = 0;
            setTimeout(function generateRows() {
                var save = context.howCreateOnce * interation,
                    length = (context.getGroup('B').length - save) < context.howCreateOnce ? context.getGroup('B').length - save : context.howCreateOnce;
                for( var row = 0; row < length; row++ ) {
                    context.tbody.appendChild( context.doMethod('_createRow', {
                        'tr': context.createEL('tr'),
                        'row': context.getGroup('B')[row + save],
                        'index': (row + save),
                        'group': context.getGroup('B'),
                        'td': td
                    }) );
                }
                if( ++interation < times ) {
                    setTimeout(generateRows,0);
                }
                else {
                    context.doAction('createPageAfter');
                }
            },0);
        },

        /**
         * @td - 
         * @attr - 
         */
        '_doDelayedFunction': function( obj ) {
            if( obj.col.callbacks.length ) {
                var fn = obj.col.callbacks.pop();
                fn.call(this, obj);
                this._doDelayedFunction( obj );
            }
        },

        /**
         * @td - 
         * @attr - 
         */
        '_setDelayedFunction': function( destination, fn ) {
            var name = 'setDelayedFunction',
                params = {'destination':destination,'fn':fn};
            this.doAction( name + 'Before', params );
            if(this[name + 'Before'] && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](params) == true || !this[name + 'Before']) {
                if( params.destination.hasOwnProperty('callbacks') && Array.isArray(params.destination.callbacks) && typeof params.fn == 'function' ) {
                    params.destination.callbacks.push( params.fn );
                }
                else if( ! params.destination.hasOwnProperty('callbacks') && typeof params.fn == 'function' ) {
                    params.destination.callbacks = [ params.fn ];
                }
            }
            if(this[name + 'After'] && typeof this[name + 'After'] == 'function')
                this[name + 'After'](params);
            this.doAction( name + 'After', params );
        },

        /**
         * @td - 
         * @attr - 
         */
        '_createPage': function() {
            if( this.hasOwnProperty('maxRowsOutDelay') && this.getGroup('B').length > this.maxRowsOutDelay ) {
                this.createDelayedRows();
            }
            else {
                for( var row = 0, length = this.getGroup('B').length; row < length; row++ ) {
                    this.tbody.appendChild( this.doMethod('_createRow', {
                        'tr': this.createEL('tr'),
                        'index': row,
                        'row': this.getGroup('B')[row],
                        'group': this.getGroup('B')
                    }) );
                }
            }
        },

        /**
         * @td - 
         * @attr - 
         */
        '_createTableManager': function( params ) {
            var row, length;
            this.doMethod('_defineType', params);
            this.doMethod('_compileTable');

            if( this.getGroup('H').length ) {
                for( row = 0, length = this.getGroup('H').length; row < length; row++ ) {
                    this.thead.appendChild( this.doMethod('_createRow', {
                        'tr': this.createEL('tr'),
                        'index': row,
                        'row': this.getGroup('H')[ row ],
                        'group': this.getGroup('H'),
                        'td': 'th'
                    }) );
                }
            }

            if( this.getGroup('F').length ) {
                for( row = 0, length = this.getGroup('F').length; row < length; row++ ) {
                    this.tfoot.appendChild( this.doMethod('_createRow', {
                        'tr': this.createEL('tr'),
                        'index': row,
                        'row': this.getGroup('F')[ row ],
                        'group': this.getGroup('F'),
                        'td': 'th'
                    }) );
                }
            }

            this.doMethod('_createPage');

            if( ! this.getNumOfCols() ) this.setNumberOfColumns( this.getGroup('B')[ 0 ] );

            this.doMethod('_createTopControls', {
                'tr': this.attr( this.createEL('tr'), 'data-controls', true )
            });
            this.doMethod('_createBottomControls', {
                'tr': this.attr( this.createEL('tr'), 'data-controls', true )
            });

            this.doMethod('_addTable', params);
        },

    };

    $.TableEdit.init = function( selector ) {
        this.doMethod('_createTableManager', {'selector':selector});
    };

});
