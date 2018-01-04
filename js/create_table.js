jQuery(document).ready(function($){

    if( !$.TableEdid ) return;

    $.TableEdid.localPlugin = {
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
        dataTableArray: [],
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
                    this.dataTableArray = params.selector;
                } catch (e) {
                    console.error(e);
                    this.dataTableArray = this.dataTableDefaultArray;
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
            this.$thead.append( this.doMethod('_addStub', params) );
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
                if( this.doMethod('_defineOutputMethod', {method:''}) === 'after' ) this.outputMethod = 'append';
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
            $( this.doMethod('_defineOutputConteiner', params) )[ this.doMethod('_defineOutputMethod', {method:''}) ]( this.$table );
        },

        _createHeader: function( params ) {
            this.setNumberOfColumns( params.tableHead );
            for( var col = 0; col < params.tableHead.length; col++ ) {
                if( params.tableHead[col].matrix && params.tableHead[col].matrix[0] == 1 || params.tableHead[col].matrix && params.tableHead[col].matrix[1] == 1 ) continue;
                var $th = $('<th/>');

                if( params.tableHead[col].hasOwnProperty('settings') )
                    this.doMethod('_cellConfiguration', {$td: $th,settings: params.tableHead[col].settings});

                if( params.tableHead[col].hasOwnProperty('value') )
                    $th.append( params.tableHead[col].value );

                this.doMethod('_setMatrix', {$td:$th,row:params.tableHead,col:params.tableHead[col],rowIndex:0,colIndex:col});

                params.$tr.append( $th );
            }
            this.$tbody.append( this.doMethod('_createRowControls', params) );
        },

        _createRow: function( params ) {
            for( var col = 0; col < params.row.length; col++ ) {
                params.$tr.append( this.createCell( params.$tr, params.row, params.row[col], params.index, col ) );
            }
            this.doMethod('_createRowControls', params);
            this.setNumberOfColumns( params.row );

            return params.$tr;
        },

        createCell: function( $tr, row, col, rowIndex, colIndex ) {
            if( col.matrix && col.matrix[0] == 1 || col.matrix && col.matrix[1] == 1 ) return;
            return this.doMethod('_createCell', {$tr:$tr,$td:$('<td/>'),row:row,col:col,rowIndex:rowIndex,colIndex:colIndex});
        },

        _createCell: function( params ) {
            if( params.col.settings )
                this.doMethod('_cellConfiguration', {$td: params.$td,settings: params.col.settings});

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
                        var inspectionCol = this.dataTableArray[ object.rowIndex + rowspan ][ j ];
                        if( inspectionCol.settings && inspectionCol.settings.colspan ) {
                            shiftIndex -= (inspectionCol.settings.colspan - 1);
                            j += (inspectionCol.settings.colspan - 1);
                        }
                    }
                    for( var i = 0; i < colspan; i++ ) {
                        this.dataTableArray[ object.rowIndex + rowspan ].splice( shiftIndex, 0, {matrix: [1,1]} );
                    }
                    this.dataTableArray[ object.rowIndex + rowspan ].splice( shiftIndex, 0, {matrix: [0,1]} );
                    rowspan--;
                }
                while( colspan-- > 0 ) {
                    this.dataTableArray[ object.rowIndex ].splice( object.colIndex + 1, 0, {matrix: [1,0]} );
                }
                this.dataTableArray[ object.rowIndex ][ object.colIndex ].matrix = [0,0];
                return object.$td.attr('data-real-index', object.colIndex);
            }
            else if( object.col.settings && object.col.settings.colspan ) {
                var colspan = object.col.settings.colspan - 1;
                while( colspan-- > 0 ) {
                    this.dataTableArray[ object.rowIndex ].splice( object.colIndex + 1, 0, {matrix: [1,0]} );
                }
                this.dataTableArray[ object.rowIndex ][ object.colIndex ].matrix = [0,0];
                return object.$td.attr('data-real-index', object.colIndex);
            }
            else if( object.col.settings && object.col.settings.rowspan ) {
                var rowspan = object.col.settings.rowspan - 1;
                while( rowspan > 0 ) {
                    var shiftIndex = object.colIndex;
                    for( var j = 0; j < object.colIndex; j++ ) {
                        var inspectionCol = this.dataTableArray[ object.rowIndex + rowspan ][ j ];
                        if( inspectionCol.settings && inspectionCol.settings.colspan ) {
                            shiftIndex -= (inspectionCol.settings.colspan - 1);
                            j += (inspectionCol.settings.colspan - 1);
                        }
                    }
                    this.dataTableArray[ object.rowIndex + rowspan ].splice( shiftIndex, 0, {matrix: [0,1]} );
                    rowspan--;
                }
                this.dataTableArray[ object.rowIndex ][ object.colIndex ].matrix = [0,0];
                return object.$td.attr('data-real-index', object.colIndex);
            }
            else {
                this.dataTableArray[ object.rowIndex ][ object.colIndex ].matrix = [0,0];
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

        createDelayedRows: function() {
            if(! this.hasOwnProperty('howCreateOnce')) return;
            var context = this,
                times = Math.ceil( (this.dataTableArray.length - 1) / this.howCreateOnce ),
                interation = 0;
            setTimeout(function generateRows(){
                generateRows.i == undefined ? generateRows.i = 1 : generateRows.i = 0;
                var save = context.howCreateOnce * interation,
                    length = (context.dataTableArray.length - save) < context.howCreateOnce ? context.dataTableArray.length - save : context.howCreateOnce;
                for( var row = generateRows.i; row < length; row++ ) {
                    context.$tbody.append( context.doMethod('_createRow', {$tr:$('<tr/>'),row:context.dataTableArray[row + save],index:(row + save)}) );
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
            this.doMethod('_defineType', params);
            this.doMethod('_compileTable');

            this.doMethod('_createHeader', {tableHead:this.dataTableArray[0] || [],$tr:$('<tr/>')});
            if( this.hasOwnProperty('maxRowsOutDelay') && this.dataTableArray.length > this.maxRowsOutDelay ) {
                this.createDelayedRows();
            }
            else {
                for( var row = 1, length = this.dataTableArray.length; row < length; row++ ) {
                    this.$tbody.append( this.doMethod('_createRow', {$tr:$('<tr/>'),row:this.dataTableArray[row],index:row}) );
                }
            }
            this.doMethod('_createTopControls', {$tr:$('<tr/>')});
            this.doMethod('_createBottomControls', {$tr:$('<tr/>')});

            this.doMethod('_addTable', params);
        },

    };

    $.TableEdid.init = function( selector ) {
        this.doMethod('_createTableManager', {selector:selector});
    };

});
