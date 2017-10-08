$.TableEdid.defaults = {

    _compileTable: function() {
        var name = 'compileTable';
        this.doAction( name + 'Before' );
        if(this.hasOwnProperty(name + 'Before') && typeof this[name + 'Before'] == 'function' && this[name + 'Before']() == true || !this.hasOwnProperty(name + 'Before')) {
            this.$table.append(this.$thead,this.$tfoot,this.$tbody);
        }
        if (this.hasOwnProperty(name + 'After') && typeof this[name + 'After'] == 'function')
            this[name + 'After']();
        this.doAction( name + 'After' );
    },

    dataTableDefaultArray: [],

    _defineType: function( selector ) {
        var name = 'defineType',
            params = {selector:selector};
        this.doAction( name + 'Before', params );
        if(this.hasOwnProperty(name + 'Before') && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](params) == true || !this.hasOwnProperty(name + 'Before')) {

            if( Array.isArray( params.selector ) ) {
                try {
                    this.dataTableArray = params.selector;
                } catch (e) {
                    throw e;
                    this.dataTableArray = this.dataTableDefaultArray;
                }
            }

        }
        if (this.hasOwnProperty(name + 'After') && typeof this[name + 'After'] == 'function')
            this[name + 'After'](params);
        this.doAction( name + 'After', params );
    },

    controlOrientation: 'right',

    topControlsElements: '',

    bottomControlsElements: '',

    rowControlsElements: '',

    stubElements: '',

    _addStub: function( $tr ) {
        var name = 'addStub',
            params = {$tr:$tr};
        this.doAction( name + 'Before', params );
        if(this.hasOwnProperty(name + 'Before') && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](params) == true || !this.hasOwnProperty(name + 'Before')) {
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
        }
        if (this.hasOwnProperty(name + 'After') && typeof this[name + 'After'] == 'function')
            this[name + 'After'](params);
        this.doAction( name + 'After', params );
        return params.$tr;
    },

    _createTopControls: function() {
        var name = 'createTopControls',
            params = {$tr:$('<tr/>')};
        this.doAction( name + 'Before', params );
        if(this.hasOwnProperty(name + 'Before') && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](params) == true || !this.hasOwnProperty(name + 'Before')) {
            for( var i = 0; i < this._numberOfColumns; i++ ) {
                params.$tr.append(
                    $('<td/>').html( this.topControlsElements )
                );
            }
            this.$thead.append( this._addStub( params.$tr ) );
        }
        if (this.hasOwnProperty(name + 'After') && typeof this[name + 'After'] == 'function')
            this[name + 'After'](params);
        this.doAction( name + 'After', params );
    },

    _createBottomControls: function() {
        var name = 'createBottomControls',
            params = {$tr:$('<tr/>')};
        this.doAction( name + 'Before', params );
        if(this.hasOwnProperty(name + 'Before') && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](params) == true || !this.hasOwnProperty(name + 'Before')) {
            for( var i = 0; i < this._numberOfColumns; i++ ) {
                params.$tr.append(
                    $('<td/>').html( this.bottomControlsElements )
                );
            }
            this.$tfoot.append( this._addStub( params.$tr ) );
        }
        if (this.hasOwnProperty(name + 'After') && typeof this[name + 'After'] == 'function')
            this[name + 'After'](params);
        this.doAction( name + 'After', params );
    },

    _createRowControls: function( $tr ) {
        var name = 'createRowControls',
            params = {$tr:$tr};
        this.doAction( name + 'Before', params );
        if(this.hasOwnProperty(name + 'Before') && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](params) == true || !this.hasOwnProperty(name + 'Before')) {
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
        }
        if (this.hasOwnProperty(name + 'After') && typeof this[name + 'After'] == 'function')
            this[name + 'After'](params);
        this.doAction( name + 'After', params );
        return params.$tr;
    },

    _defineOutputConteiner: function( selector ) {
        var name = 'defineOutputConteiner',
            params = {selector:selector};
        this.doAction( name + 'Before', params );
        if(this.hasOwnProperty(name + 'Before') && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](params) == true || !this.hasOwnProperty(name + 'Before')) {
            if( this.hasOwnProperty('outputConteiner') && $(this.outputConteiner).length ) {
                // return this.outputConteiner;
                params.selector = this.outputConteiner;
            }
            else if( $('body').find(params.selector).length ) {
                // return selector;
            }
            else {
                if( this._defineOutputMethod() === 'after' ) this.outputMethod = 'append';
                // return 'body';
                params.selector = 'body';
            }
        }
        if (this.hasOwnProperty(name + 'After') && typeof this[name + 'After'] == 'function')
            this[name + 'After'](params);
        this.doAction( name + 'After', params );
        return params.selector;
    },

    _defineOutputMethod: function() {
        var name = 'defineOutputMethod',
            params = {method:''};
        this.doAction( name + 'Before', params );
        if(this.hasOwnProperty(name + 'Before') && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](params) == true || !this.hasOwnProperty(name + 'Before')) {
            if( this.hasOwnProperty('outputMethod') && $.fn.hasOwnProperty( this.outputMethod ) ) {
                // return this.outputMethod;
                params.method = this.outputMethod;
            } else {
                // return 'after';
                params.method = 'after';
            }
        }
        if (this.hasOwnProperty(name + 'After') && typeof this[name + 'After'] == 'function')
            this[name + 'After'](params);
        this.doAction( name + 'After', params );
        return params.method;
    },

    _addTable: function( selector ) {
        var name = 'addTable',
            params = {selector:selector};
        this.doAction( name + 'Before', params );
        if(this.hasOwnProperty(name + 'Before') && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](params) == true || !this.hasOwnProperty(name + 'Before')) {
            $( this._defineOutputConteiner(params.selector) )[ this._defineOutputMethod() ]( this.$table );
        }
        if (this.hasOwnProperty(name + 'After') && typeof this[name + 'After'] == 'function')
            this[name + 'After'](params);
        this.doAction( name + 'After', params );
    },

    _createHeader: function() {
        var name = 'createHeader',
            params = {tableHead:this.dataTableArray[0] || [],$tr:$('<tr/>')};
        this.doAction( name + 'Before', params );
        if(this.hasOwnProperty(name + 'Before') && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](params) == true || !this.hasOwnProperty(name + 'Before')) {
            for( var col = 0; col < params.tableHead.length; col++ ) {
                var $th = $('<th/>');

                if( params.tableHead[col].hasOwnProperty('settings') )
                    this._cellConfiguration( $th, params.tableHead[col].settings );

                if( params.tableHead[col].hasOwnProperty('value') )
                    $th.append( params.tableHead[col].value );

                this._setMatrix( {$td:$th,row:params.tableHead,col:params.tableHead[col],rowIndex:0,colIndex:col} );

                params.$tr.append( $th );
            }
            this.$tbody.append( this._createRowControls( params.$tr ) );
            this._setNumberOfColumns( params.tableHead );
        }
        if (this.hasOwnProperty(name + 'After') && typeof this[name + 'After'] == 'function')
            this[name + 'After'](params);
        this.doAction( name + 'After', params );
    },

    _createRow: function() {
        var name = 'createRow';
        for( var row = 1, length = this.dataTableArray.length; row < length; row++ ) {
            var params = {$tr:$('<tr/>'),row:this.dataTableArray[row],index:row};
            this.doAction( name + 'Before', params );
            if(this.hasOwnProperty(name + 'Before') && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](params) == true || !this.hasOwnProperty(name + 'Before')) {
                params.$tr.append( this._createCell( params.$tr, params.row, params.index ) );
                this.$tbody.append( this._createRowControls( params.$tr ) );
                this._setNumberOfColumns( params.row );
            }
            if (this.hasOwnProperty(name + 'After') && typeof this[name + 'After'] == 'function')
                this[name + 'After'](params);
            this.doAction( name + 'After', params );
        }
    },

    _createCell: function( $tr, row, index ) {
        var name = 'createCell';
        for( var col = 0; col < row.length; col++ ) {

            if( row[col].hasOwnProperty('matrix') && row[col].matrix[0] == 1 || row[col].hasOwnProperty('matrix') && row[col].matrix[1] == 1 ) continue;

            var params = {$tr:$tr,$td:$('<td/>'),row:row,col:row[col],rowIndex:index,colIndex:col};
            this.doAction( name + 'Before', params );
            if(this.hasOwnProperty(name + 'Before') && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](params) == true || !this.hasOwnProperty(name + 'Before')) {

                if( params.col.hasOwnProperty('settings') )
                    this._cellConfiguration( params.$td, params.col.settings );

                if( params.col.hasOwnProperty('value') )
                    params.$td.append( params.col.value );

                if( params.col.hasOwnProperty('callbacks') )
                    this._doDelayedFunction( params );

                this._setMatrix( params );

                params.$tr.append( params.$td );
            }
            if (this.hasOwnProperty(name + 'After') && typeof this[name + 'After'] == 'function')
                this[name + 'After'](params);
            this.doAction( name + 'After', params );
        }
        return params.$tr;
    },

    _setMatrix: function( object ) {
        var name = 'setMatrix';
        this.doAction( name + 'Before', object );
        if(this.hasOwnProperty(name + 'Before') && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](object) == true || !this.hasOwnProperty(name + 'Before')) {

            if( object.col.hasOwnProperty('matrix') && object.row.length == this._numberOfColumns ) return;

            if( object.col.settings && object.col.settings.hasOwnProperty('colspan') && object.col.settings.hasOwnProperty('rowspan') ) {
                var colspan = object.col.settings.colspan - 1;
                var rowspan = object.col.settings.rowspan - 1;
                while( rowspan > 0 ) {
                    var shiftIndex = object.colIndex;
                    for( var j = 0; j < object.colIndex; j++ ) {
                        var inspectionCol = this.dataTableArray[ object.rowIndex + rowspan ][ j ];
                        if( inspectionCol.settings && inspectionCol.settings.hasOwnProperty('colspan') ) {
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
                object.$td.attr('data-real-index', object.colIndex);
            }
            else if( object.col.settings && object.col.settings.hasOwnProperty('colspan') ) {
                var colspan = object.col.settings.colspan - 1;
                while( colspan-- > 0 ) {
                    this.dataTableArray[ object.rowIndex ].splice( object.colIndex + 1, 0, {matrix: [1,0]} );
                }
                this.dataTableArray[ object.rowIndex ][ object.colIndex ].matrix = [0,0];
                object.$td.attr('data-real-index', object.colIndex);
            }
            else if( object.col.settings && object.col.settings.hasOwnProperty('rowspan') ) {
                var rowspan = object.col.settings.rowspan - 1;
                while( rowspan > 0 ) {
                    var shiftIndex = object.colIndex;
                    for( var j = 0; j < object.colIndex; j++ ) {
                        var inspectionCol = this.dataTableArray[ object.rowIndex + rowspan ][ j ];
                        if( inspectionCol.settings && inspectionCol.settings.hasOwnProperty('colspan') ) {
                            shiftIndex -= (inspectionCol.settings.colspan - 1);
                            j += (inspectionCol.settings.colspan - 1);
                        }
                    }
                    this.dataTableArray[ object.rowIndex + rowspan ].splice( shiftIndex, 0, {matrix: [0,1]} );
                    rowspan--;
                }
                this.dataTableArray[ object.rowIndex ][ object.colIndex ].matrix = [0,0];
                object.$td.attr('data-real-index', object.colIndex);
            }
            else {
                this.dataTableArray[ object.rowIndex ][ object.colIndex ].matrix = [0,0];
                object.$td.attr('data-real-index', object.colIndex);
            }
        }
        if (this.hasOwnProperty(name + 'After') && typeof this[name + 'After'] == 'function')
            this[name + 'After'](object);
        this.doAction( name + 'After', object );
    },

    _setNumberOfColumns: function( row ) {
        if( this._numberOfColumns == false ) {
            var length = row.length;
            for( var col = 0; col < row.length; col++ ) {
                if( row[col].settings && row[col].settings.hasOwnProperty('colspan') ) {
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
                if( row[col].settings && row[col].settings.hasOwnProperty('colspan') ) {
                    length += (row[col].settings.colspan - 1);
                }
            }
            if ( this._numberOfColumns >= length ) {
                return this._numberOfColumns;
            } else {
                return this._numberOfColumns = length;
            }
        }
    },

    _cellConfiguration: function( $td, settings ) {
        var name = 'cellConfiguration',
            params = {$td:$td,settings:settings};
        this.doAction( name + 'Before', params );
        if(this.hasOwnProperty(name + 'Before') && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](params) == true || !this.hasOwnProperty(name + 'Before')) {
            if( params.settings && typeof params.settings === 'object' ) {
                for( var attr in params.settings ) {
                    params.$td.attr( attr, params.settings[attr] );
                }
            }
        }
        if (this.hasOwnProperty(name + 'After') && typeof this[name + 'After'] == 'function')
            this[name + 'After'](params);
        this.doAction( name + 'After', params );
        return params.$td;
    },

    _createDelayedRows: function() {
        if(! this.hasOwnProperty('howCreateOnce')) return;
        var name = 'createDelayedRows',
            context = this,
            times = Math.ceil( (this.dataTableArray.length - 1) / this.howCreateOnce ),
            interation = 0;
        setTimeout(function generateRows(){
            generateRows.i == undefined ? generateRows.i = 1 : generateRows.i = 0;
            var save = context.howCreateOnce * interation,
                length = (context.dataTableArray.length - save) < context.howCreateOnce ? context.dataTableArray.length - save : context.howCreateOnce;
            for( var row = generateRows.i; row < length; row++ ) {
                var params = {$tr:$('<tr/>'),row:context.dataTableArray[row + save],index:(row + save)};
                context.doAction( name + 'Before', params );
                if(context.hasOwnProperty(name + 'Before') && typeof context[name + 'Before'] == 'function' && context[name + 'Before'](params) == true || !context.hasOwnProperty(name + 'Before')) {
                    params.$tr.append( context._createCell( params.$tr, params.row, params.index ) );
                    context.$tbody.append( context._createRowControls( params.$tr ) );
                    context._setNumberOfColumns( params.row );
                }
                if (context.hasOwnProperty(name + 'After') && typeof context[name + 'After'] == 'function')
                    context[name + 'After'](params);
                context.doAction( name + 'After', params );
            }
            if( ++interation < times )
                setTimeout(generateRows,0);
        },0);
    },

    _doDelayedFunction: function( obj ) {
        var name = 'doDelayedFunction';
        this.doAction( name + 'Before', obj );
        if(this.hasOwnProperty(name + 'Before') && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](obj) == true || !this.hasOwnProperty(name + 'Before')) {
            if( obj.col.callbacks.length ) {
                var fn = obj.col.callbacks.pop();
                fn.call(this, obj);
                this._doDelayedFunction( obj );
            }
        }
        if (this.hasOwnProperty(name + 'After') && typeof this[name + 'After'] == 'function')
            this[name + 'After'](obj);
        this.doAction( name + 'After', obj );
    },

    _setDelayedFunction: function( destination, fn ) {
        var name = 'setDelayedFunction',
            params = {destination:destination,fn:fn};
        this.doAction( name + 'Before', params );
        if(this.hasOwnProperty(name + 'Before') && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](params) == true || !this.hasOwnProperty(name + 'Before')) {
            if( params.destination.hasOwnProperty('callbacks') && Array.isArray(params.destination.callbacks) && typeof params.fn == 'function' ) {
                params.destination.callbacks.push( params.fn );
            }
            else if( ! params.destination.hasOwnProperty('callbacks') && typeof params.fn == 'function' ) {
                params.destination.callbacks = [ params.fn ];
            }
        }
        if (this.hasOwnProperty(name + 'After') && typeof this[name + 'After'] == 'function')
            this[name + 'After'](params);
        this.doAction( name + 'After', params );
    },

    _createTableManager: function( selector ) {
        var name = 'createTableManager',
            params = {selector:selector};
        this.doAction( name + 'Before', params );
        if(this.hasOwnProperty(name + 'Before') && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](params) == true || !this.hasOwnProperty(name + 'Before')) {
            this._defineType(params.selector);
            this._compileTable();

            this._createHeader();
            if( this.hasOwnProperty('maxRowsOutDelay') && this.dataTableArray.length > this.maxRowsOutDelay ) {
                this._createDelayedRows();
            }
            else {
                this._createRow();
            }
            this._createTopControls();
            this._createBottomControls();

            this._addTable(params.selector);
        }
        if (this.hasOwnProperty(name + 'After') && typeof this[name + 'After'] == 'function')
            this[name + 'After'](params);
        this.doAction( name + 'After', params );
    },

};