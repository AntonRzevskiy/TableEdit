jQuery(document).ready(function($){

    if( !$.TableEdid ) return;

    $.TableEdid.localPlugin = {

        /**
         * The following four functions set the properties individually for each table
         */
        $table: function(){
            return $('<table/>');
        },
        $thead: function(){
            return $('<thead/>');
        },
        $tfoot: function(){
            return $('<tfoot/>');
        },
        $tbody: function(){
            return $('<tbody/>');
        },

        /**
         * @dataTableArray contains @dataTbodyArray, @dataTheadArray & @dataTfootArray
         * to combine data into one array
         */
        dataTableArray: [],

        
        dataTbodyArray: [],
        dataTheadArray: [],
        dataTfootArray: [],

        /**
         * @_numberOfColumns property is responsible for the number of columns
         */
        _numberOfColumns: false,
    };

    $.TableEdid.plugin = {

        _compileTable: function() {
            this.$table.append(this.$thead,this.$tfoot,this.$tbody);
        },

        dataTableDefaultArray: [],

        _defineType: function( params ) {
            if( Array.isArray( params.selector ) ) {
                try {
                    this.dataTbodyArray = params.selector;
                } catch (e) {
                    console.error(e);
                    this.dataTbodyArray = this.dataTableDefaultArray;
                }
            }
            if( params.selector instanceof Object ) {
                try {
                    this.dataTheadArray = params.selector.thead || [];
                    this.dataTbodyArray = params.selector.tbody || [];
                    this.dataTfootArray = params.selector.tfoot || [];
                } catch (e) {
                    console.error(e);
                    this.dataTbodyArray = this.dataTableDefaultArray;
                }
            }
        },

        controlOrientation: 'right',

        topControlsElements: '<a class="addCol" href="javascript://" role="button"><span class="glyphicon glyphicon-plus"></span></a>' +
                             '<a class="delCol" href="javascript://" role="button"><span class="glyphicon glyphicon-minus"></span></a>',

        bottomControlsElements: '<a class="addCol" href="javascript://" role="button"><span class="glyphicon glyphicon-plus"></span></a>' +
                                '<a class="delCol" href="javascript://" role="button"><span class="glyphicon glyphicon-minus"></span></a>',

        rowControlsElements: '<a class="addrow" href="javascript://" role="button"><span class="glyphicon glyphicon-plus"></span></a>' +
                             '<a class="delrow" href="javascript://" role="button"><span class="glyphicon glyphicon-minus"></span></a>',

        stubElements: '<a class="addCol" href="javascript://" role="button"><span class="glyphicon glyphicon-plus"></span></a>',

        _addStub: function( params ) {
            if( this.controlOrientation === 'right' ) {
                params.$tr.append(
                    $('<td/>').html( this.stubElements )
                );
            }
            else if( this.controlOrientation === 'left' ) {
                params.$tr.prepend(
                    $('<td/>').html( this.stubElements )
                );
            }
            return params.$tr;
        },

        _createTopControls: function( params ) {
            for( var i = 0; i < this._numberOfColumns; i++ ) {
                params.$tr.append(
                    $('<td/>').html( this.topControlsElements )
                );
            }
            this.$thead.prepend( this.doMethod('_addStub', params) );
        },

        _createBottomControls: function( params ) {
            for( var i = 0; i < this._numberOfColumns; i++ ) {
                params.$tr.append(
                    $('<td/>').html( this.bottomControlsElements )
                );
            }
            this.$tfoot.append( this.doMethod('_addStub', params) );
        },

        _createRowControls: function( params ) {
            if( this.controlOrientation === 'right' ) {
                params.$tr.append(
                    $('<td/>').html( this.rowControlsElements )
                );
            }
            else if( this.controlOrientation === 'left' ) {
                params.$tr.prepend(
                    $('<td/>').html( this.rowControlsElements )
                );
            }
            return params.$tr;
        },

        _defineOutputConteiner: function( params ) {
            if( this.hasOwnProperty('outputConteiner') && $(this.outputConteiner).length ) {
                // return this.outputConteiner;
                params.selector = this.outputConteiner;
            }
            else if( $('body').find(params.selector).length ) {
                // return selector;
            }
            else {
                if( this.doMethod('_defineOutputMethod', {'method':''}) === 'after' ) this.outputMethod = 'append';
                // return 'body';
                params.selector = 'body';
            }
            return params.selector;
        },

        _defineOutputMethod: function( params ) {
            if( this.hasOwnProperty('outputMethod') && $.fn.hasOwnProperty( this.outputMethod ) ) {
                // return this.outputMethod;
                params.method = this.outputMethod;
            } else {
                // return 'after';
                params.method = 'after';
            }
            return params.method;
        },

        _addTable: function( params ) {
            $( this.doMethod('_defineOutputConteiner', {'selector':params.selector}) )[ this.doMethod('_defineOutputMethod', {'method':''}) ]( this.$table );
        },

        _createRow: function( params ) {
            this.setNumberOfColumns( params.row );
            for( var col = 0; col < params.row.length; col++ ) {
                params.$tr.append( this.createCell(
                    params.$tr,     // jQuery obj
                    params.row,     // Array
                    params.row[col],// Object
                    params.index,   // Number Index of row
                    col,            // Number Index of col
                    params.group,   // Array
                    params.td       // String optional
                ) );
            }
            this.doMethod('_createRowControls', params);

            return params.$tr;
        },

        createCell: function( $tr, row, col, rowIndex, colIndex, group, td ) {
            if( col.matrix && col.matrix[0] == 1 || col.matrix && col.matrix[1] == 1 ) return;
            return this.doMethod('_createCell', {
                '$tr': $tr,
                'row': row,
                'col': col,
                'rowIndex': rowIndex,
                'colIndex': colIndex,
                'group': group,
                // deffault param string, will be jQuery
                '$td': ( td ) ? $('<' + td + '/>') : $('<td/>'),
            });
        },

        _createCell: function( params ) {
            if( params.col.settings )
                this.doMethod('_cellConfiguration', {'$td': params.$td,'settings': params.col.settings});

            if( params.col.value )
                params.$td.append( params.col.value );

            if( params.col.callbacks )
                this.doMethod('_doDelayedFunction', params);

            this.doMethod('_setMatrix', params);

            return params.$td;
        },

        _setMatrix: function( object ) {

            if( object.col.matrix && object.row.length == this._numberOfColumns ) return object.$td.attr('data-real-index', object.colIndex);

            if( object.col.settings && object.col.settings.colspan && object.col.settings.rowspan ) {
                var colspan = object.col.settings.colspan - 1;
                var rowspan = object.col.settings.rowspan - 1;
                while( rowspan > 0 ) {
                    var shiftIndex = object.colIndex;
                    for( var j = 0; j < object.colIndex; j++ ) {
                        var inspectionCol = object.group[ object.rowIndex + rowspan ][ j ];
                        if( inspectionCol.settings && inspectionCol.settings.colspan ) {
                            shiftIndex -= (inspectionCol.settings.colspan - 1);
                            j += (inspectionCol.settings.colspan - 1);
                        }
                    }
                    for( var i = 0; i < colspan; i++ ) {
                        object.group[ object.rowIndex + rowspan ].splice( shiftIndex, 0, {matrix: [1,1]} );
                    }
                    object.group[ object.rowIndex + rowspan ].splice( shiftIndex, 0, {matrix: [0,1]} );
                    rowspan--;
                }
                while( colspan-- > 0 ) {
                    object.group[ object.rowIndex ].splice( object.colIndex + 1, 0, {matrix: [1,0]} );
                }
                object.group[ object.rowIndex ][ object.colIndex ].matrix = [0,0];
                return object.$td.attr('data-real-index', object.colIndex);
            }
            else if( object.col.settings && object.col.settings.colspan ) {
                var colspan = object.col.settings.colspan - 1;
                while( colspan-- > 0 ) {
                    object.group[ object.rowIndex ].splice( object.colIndex + 1, 0, {matrix: [1,0]} );
                }
                object.group[ object.rowIndex ][ object.colIndex ].matrix = [0,0];
                return object.$td.attr('data-real-index', object.colIndex);
            }
            else if( object.col.settings && object.col.settings.rowspan ) {
                var rowspan = object.col.settings.rowspan - 1;
                while( rowspan > 0 ) {
                    var shiftIndex = object.colIndex;
                    for( var j = 0; j < object.colIndex; j++ ) {
                        var inspectionCol = object.group[ object.rowIndex + rowspan ][ j ];
                        if( inspectionCol.settings && inspectionCol.settings.colspan ) {
                            shiftIndex -= (inspectionCol.settings.colspan - 1);
                            j += (inspectionCol.settings.colspan - 1);
                        }
                    }
                    object.group[ object.rowIndex + rowspan ].splice( shiftIndex, 0, {matrix: [0,1]} );
                    rowspan--;
                }
                object.group[ object.rowIndex ][ object.colIndex ].matrix = [0,0];
                return object.$td.attr('data-real-index', object.colIndex);
            }
            else {
                object.group[ object.rowIndex ][ object.colIndex ].matrix = [0,0];
                return object.$td.attr('data-real-index', object.colIndex);
            }
        },

        setNumberOfColumns: function( row ) {
            if( this._numberOfColumns == false ) {
                var length = row.length;
                for( var col = 0; col < row.length; col++ ) {
                    if( row[col].matrix ) return this._numberOfColumns = row.length;
                    if( row[col].settings && row[col].settings.colspan ) {
                        length += (row[col].settings.colspan - 1);
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
                    if( row[col].settings && row[col].settings.colspan ) {
                        length += (row[col].settings.colspan - 1);
                    }
                }
                if( this._numberOfColumns >= length ) {
                    return this._numberOfColumns;
                } else {
                    return this._numberOfColumns = length;
                }
            }
        },

        _cellConfiguration: function( params ) {
            if( params.settings && typeof params.settings === 'object' ) {
                for( var attr in params.settings ) {
                    params.$td.attr( attr, params.settings[attr] );
                }
            }
            return params.$td;
        },

        createDelayedRows: function( td ) {
            if(! this.hasOwnProperty('howCreateOnce')) return;
            var context = this,
                times = Math.ceil( (this.dataTbodyArray.length - 1) / this.howCreateOnce ),
                interation = 0;
            setTimeout(function generateRows() {
                var save = context.howCreateOnce * interation,
                    length = (context.dataTbodyArray.length - save) < context.howCreateOnce ? context.dataTbodyArray.length - save : context.howCreateOnce;
                for( var row = 0; row < length; row++ ) {
                    context.$tbody.append( context.doMethod('_createRow', {
                        '$tr': $('<tr/>'),
                        'row': context.dataTbodyArray[row + save],
                        'index' :(row + save),
                        'group': context.dataTbodyArray,
                        'td': td
                    }) );
                }
                if( ++interation < times )
                    setTimeout(generateRows,0);
            },0);
        },

        _doDelayedFunction: function( obj ) {
            if( obj.col.callbacks.length ) {
                var fn = obj.col.callbacks.pop();
                fn.call(this, obj);
                this._doDelayedFunction( obj );
            }
        },

        _setDelayedFunction: function( destination, fn ) {
            var name = 'setDelayedFunction',
                params = {destination:destination,fn:fn};
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

        _createTableManager: function( params ) {
            var row, length;
            this.doMethod('_defineType', params);
            this.doMethod('_compileTable');

            if( this.dataTheadArray.length ) {
                for( row = 0, length = this.dataTheadArray.length; row < length; row++ ) {
                    this.$thead.append( this.doMethod('_createRow', {
                        '$tr': $('<tr/>'),
                        'index': row,
                        'row': this.dataTheadArray[ row ],
                        'group': this.dataTheadArray,
                        'td': 'th'
                    }) );
                }
            }

            if( this.hasOwnProperty('maxRowsOutDelay') && this.dataTbodyArray.length > this.maxRowsOutDelay ) {
                this.createDelayedRows();
            }
            else {
                for( row = 0, length = this.dataTbodyArray.length; row < length; row++ ) {
                    this.$tbody.append( this.doMethod('_createRow', {
                        '$tr': $('<tr/>'),
                        'index': row,
                        'row': this.dataTbodyArray[row],
                        'group': this.dataTbodyArray
                    }) );
                }
            }

            if( this.dataTfootArray.length ) {
                for( row = 0, length = this.dataTheadArray.length; row < length; row++ ) {
                    this.$tfoot.prepend( this.doMethod('_createRow', {
                        '$tr': $('<tr/>'),
                        'index': row,
                        'row': this.dataTfootArray[ row ],
                        'group': this.dataTfootArray,
                        'td': 'th'
                    }) );
                }
            }

            if( ! this._numberOfColumns ) this.setNumberOfColumns( this.dataTbodyArray[ 0 ] );

            this.doMethod('_createTopControls', {
                '$tr': $('<tr/>').attr('data-controls',true)
            });
            this.doMethod('_createBottomControls', {
                '$tr': $('<tr/>').attr('data-controls',true)
            });

            this.doMethod('_addTable', params);
        },

    };

    $.TableEdid.init = function( selector ) {
        this.doMethod('_createTableManager', {selector:selector});
    };

});
