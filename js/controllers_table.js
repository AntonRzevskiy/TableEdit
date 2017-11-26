jQuery(document).ready(function($){

    if( !$.TableEdid ) return;

    $.TableEdid.plugin = {

        _addNewRows: function( options ) {
            var name = '_addNewRows',
                o = {
                    count: 1,
                    direction: 'bottom',
                    scene: 0,
                    newRow: null,
                };
            $.extend(true, o, options);
            o.shiftIndex = o.direction === 'top' ? o.scene : o.scene + 1;
            o.checkedRow = this.dataTableArray[ o.shiftIndex ];
            while( o.count-- > 0 ) {
                o.newRow = new Array( this._numberOfColumns );
                this.doAction( name + 'Before', o );
                if(this[name + 'Before'] && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](o) == true || !this[name + 'Before']) {
                    for( var col = 0; col < o.newRow.length; col++ ) {
                        if( o.checkedRow !== undefined && o.checkedRow[col].matrix[1] == 1 ) {
                            o.newRow[col] = {matrix: o.checkedRow[col].matrix};
                            if( o.checkedRow[col].matrix[0] == 0 ) {
                                this._correctCell( (o.shiftIndex - 1), col, 1, 'rowspan' );
                            }
                        }
                        else {
                            o.newRow[col] = this._defaultValueNewCell();
                        }
                    }
                    this.dataTableArray.splice( o.shiftIndex, 0, o.newRow );
                    var $add = this.$tbody.find('tr').eq( o.shiftIndex );
                    if( $add.length ) {
                        $add.before( this._createRow(o.shiftIndex) );
                    }
                    else {
                        this.$tbody.append( this._createRow(o.shiftIndex) );
                    }
                }
                if (this[name + 'After'] && typeof this[name + 'After'] == 'function')
                    this[name + 'After'](o);
                this.doAction( name + 'After', o );
            }
        },

        _defaultValueNewCell: function( cell ) {
            var name = '_defaultValueNewCell',
                params = cell || {};
            this.doAction( name + 'Before', params );
            if(this[name + 'Before'] && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](params) == true || !this[name + 'Before']) {
                if( ! params.hasOwnProperty('value') ) params.value = '';
            }
            if (this[name + 'After'] && typeof this[name + 'After'] == 'function')
                this[name + 'After'](params);
            this.doAction( name + 'After', params );
            return params;
        },

        _correctCell: function( rowIndex, colIndex, correct, property ) {
            var name = '_correctCell',
                params = {rowIndex:rowIndex,colIndex:colIndex,correct:correct,property:property};
            this.doAction( name + 'Before', params );
            if(this[name + 'Before'] && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](params) == true || !this[name + 'Before']) {
                if( params.property === 'rowspan' ) {
                    do {
                        if( this.dataTableArray[ params.rowIndex ][ params.colIndex ].matrix[1] == 0 ) {
                            this.dataTableArray[ params.rowIndex ][ params.colIndex ].settings.rowspan += params.correct;
                            var $wanted = this.$tbody.find('tr').eq( params.rowIndex ).find('td[data-real-index='+ params.colIndex +'],th[data-real-index='+ params.colIndex +']');
                            $wanted.attr('rowspan', +$wanted.attr('rowspan') + params.correct);
                            break;
                        }
                    } while( params.rowIndex-- >= 0 );
                }
                else if( params.property === 'colspan' ) {
                    do {
                        if( this.dataTableArray[ params.rowIndex ][ params.colIndex ].matrix[0] == 0 ) {
                            this.dataTableArray[ params.rowIndex ][ params.colIndex ].settings.colspan += params.correct;
                            var $wanted = this.$tbody.find('tr').eq( params.rowIndex ).find('td[data-real-index='+ params.colIndex +'],th[data-real-index='+ params.colIndex +']');
                            $wanted.attr('colspan', +$wanted.attr('colspan') + params.correct);
                            break;
                        }
                    } while( params.colIndex-- >= 0 );
                }
            }
            if (this[name + 'After'] && typeof this[name + 'After'] == 'function')
                this[name + 'After'](params);
            this.doAction( name + 'After', params );
        },

        _deleteSomeRows: function( options ) {
            var name = '_deleteSomeRows',
                o = {
                    count: 1,
                    direction: 'bottom',
                    scene: 0
                };
            $.extend(true, o, options);
            o.pullOutIndex = o.scene;
            o.pullOutRow = null;
            o.nextRow = null;
            while( o.count-- > 0 && this.dataTableArray[ o.pullOutIndex ] !== undefined ) {
                o.pullOutRow = this.dataTableArray[ o.pullOutIndex ];
                o.nextRow = this.dataTableArray[ o.pullOutIndex + 1 ];
                this.doAction( name + 'Before', o );
                if(this[name + 'Before'] && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](o) == true || !this[name + 'Before']) {
                    for( var col = 0; col < o.pullOutRow.length; col++ ) {
                        if( o.pullOutRow[ col ].hasOwnProperty('settings') && o.pullOutRow[ col ].settings.hasOwnProperty('rowspan') && o.pullOutRow[ col ].settings.rowspan > 1 ) {
                            o.pullOutRow[ col ].settings.rowspan -= 1;
                            o.nextRow[col] = o.pullOutRow[ col ];
                            var $movable = this.$tbody.find('tr').eq( o.pullOutIndex ).find('td[data-real-index='+ col +'],th[data-real-index='+ col +']');
                            var $wanted = this.$tbody.find('tr').eq( o.pullOutIndex + 1 ).find('td[data-real-index='+ (col + (+$movable.attr('colspan') || 1)) +'],th[data-real-index='+ (col + (+$movable.attr('colspan') || 1)) +']');
                            $wanted.before( $movable.attr('rowspan', +$movable.attr('rowspan') - 1) );
                        }
                        if( o.pullOutRow[ col ].matrix[0] == 1 && o.pullOutRow[ col ].matrix[1] == 0 ) {
                            o.nextRow[col] = o.pullOutRow[ col ];
                        }
                        if( o.pullOutRow[col].matrix[0] == 0 && o.pullOutRow[col].matrix[1] == 1 ) {
                            this._correctCell( o.pullOutIndex, col, -1, 'rowspan' );
                        }
                    }
                    this.dataTableArray.splice( o.pullOutIndex, 1 );
                    this.$tbody.find('tr').eq( o.pullOutIndex ).remove();
                    if( o.count && o.direction === 'top' ) o.pullOutIndex--;
                }
                if (this[name + 'After'] && typeof this[name + 'After'] == 'function')
                    this[name + 'After'](o);
                this.doAction( name + 'After', o );
            }
        },

        _addNewCols: function( options ) {
            var o = {
                    count: 1,
                    scene: 0,
                    part: true,
                    newCol: null,
                    checkedCell: null,
                };
            $.extend(true, o, options);
            while( o.count-- > 0 ) {
                o.newCol = new Array( this.dataTableArray.length );
                this._numberOfColumns += 1;
                var $method = this.controlOrientation == 'left' ? 'after' : 'before';
                this.$thead.find('td').eq( o.scene )[ $method ]( $('<td/>').html( this.topControlsElements ) );
                this.$tfoot.find('td').eq( o.scene )[ $method ]( $('<td/>').html( this.bottomControlsElements ) );
                if( o.part && this.hasOwnProperty('maxRowsOutDelay') && o.newCol.length > this.maxRowsOutDelay ) {
                    this._addNewDelayedCols( o );
                }
                else {
                    for( var row = 0, length = o.newCol.length; row < length; row++ ) {
                        this._addNewCol( row, o );
                    }
                }
            }
        },

        _addNewDelayedCols: function( o ) {
            if(! this.hasOwnProperty('howCreateOnce')) return;
            var $that = this,
                times = Math.ceil( (o.newCol.length - 1) / this.howCreateOnce ),
                interation = 0;
            setTimeout(function generateCol(){
                var save = $that.howCreateOnce * interation,
                    length = (o.newCol.length - save) < $that.howCreateOnce ? o.newCol.length - save : $that.howCreateOnce;
                for( var row = 0; row < length; row++ ) {
                    $that._addNewCol( (row + save), o );
                }
                if( ++interation < times )
                    setTimeout(generateCol,0);
            },0);
        },

        _addNewCol: function( row, o ) {
            o.checkedCell = this.dataTableArray[ row ][ o.scene ];
            var name = '_addNewCols';
            this.doAction( name + 'Before', o );
            if(this[name + 'Before'] && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](o) == true || !this[name + 'Before']) {
                if( o.checkedCell !== undefined && o.checkedCell.matrix[0] == 1 ) {
                    o.newCol[ row ] = {matrix: o.checkedCell.matrix};
                    if( o.checkedCell.matrix[1] == 0 ) {
                        this._correctCell( row, o.scene, 1, 'colspan' );
                    }
                }
                else {
                    o.newCol[ row ] = this._defaultValueNewCell();
                }
                this.dataTableArray[ row ].splice( o.scene, 0, o.newCol[row] );
                var cell = this.dataTableArray[ row ][ o.scene ],
                    $tr = this.$tbody.find('tr').eq( row );
                $tr.find('td[data-real-index],th[data-real-index]').filter(function(){
                    var $this = $(this);
                    if( $this.attr('data-real-index') >= o.scene )
                        $this.attr('data-real-index', +$this.attr('data-real-index') + 1);
                });
                var $destination = $tr.find('td[data-real-index='+ (o.scene + 1) +'],th[data-real-index='+ (o.scene + 1) +']');
                if( $destination.length ) {
                    $destination.before( this._createCell( $tr, this.dataTableArray[row], cell, row, o.scene ) );
                }
                else {
                    var d = o.scene;
                    while( --d >= 0 ) {
                        $destination = $tr.find('td[data-real-index='+ d +'],th[data-real-index='+ d +']');
                        if( $destination.length ) {
                            $destination.after( this._createCell( $tr, this.dataTableArray[row], cell, row, o.scene ) );
                            break;
                        }
                    }
                    if( d == -1 ) $tr.prepend( this._createCell( $tr, this.dataTableArray[row], cell, row, o.scene ) );
                }
            }
            if (this[name + 'After'] && typeof this[name + 'After'] == 'function')
                this[name + 'After'](o);
            this.doAction( name + 'After', o );
        },

        _deleteSomeCols: function( options ) {
            var o = {
                    count: 1,
                    scene: 0,
                    part: true,
                    $tr: null,
                    checkedCell: null,
                };
            $.extend(true, o, options);
            o.pullOutIndex = o.scene;
            while( o.count-- > 0 ) {
                this._numberOfColumns -= 1;
                this.$thead.find('td').eq( o.pullOutIndex ).remove();
                this.$tfoot.find('td').eq( o.pullOutIndex ).remove();
                if( this.controlOrientation == 'left' ) o.pullOutIndex -= 1;
                if( o.part && this.hasOwnProperty('maxRowsOutDelay') && this.dataTableArray.length > this.maxRowsOutDelay ) {
                    this._deleteDelayedCols( o );
                }
                else {
                    for( var row = 0, length = this.dataTableArray.length; row < length; row++ ) {
                        this._deleteCol( row, o );
                    }
                }
            }
        },

        _deleteDelayedCols: function( o ) {
            if(! this.hasOwnProperty('howCreateOnce')) return;
            var $that = this,
                times = Math.ceil( (this.dataTableArray.length - 1) / this.howCreateOnce ),
                interation = 0;
            setTimeout(function delCol(){
                var save = $that.howCreateOnce * interation,
                    length = ($that.dataTableArray.length - save) < $that.howCreateOnce ? $that.dataTableArray.length - save : $that.howCreateOnce;
                for( var row = 0; row < length; row++ ) {
                    $that._deleteCol( (row + save), o );
                }
                if( ++interation < times )
                    setTimeout(delCol,0);
            },0);
        },

        _deleteCol: function( row, o ) {
            o.$tr = this.$tbody.find('tr').eq( row );
            o.checkedCell = this.dataTableArray[ row ][ o.pullOutIndex ];
            var name = '_deleteSomeCols';
            this.doAction( name + 'Before', o );
            if(this[name + 'Before'] && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](o) == true || !this[name + 'Before']) {
                var remove = true;
                if( o.checkedCell.hasOwnProperty('settings') && o.checkedCell.settings.hasOwnProperty('colspan') && o.checkedCell.settings.colspan > 1 ) {
                    o.checkedCell.settings.colspan -= 1;
                    this.dataTableArray[ row ][ o.pullOutIndex + 1 ] = o.checkedCell;
                    var $wanted = o.$tr.find('td[data-real-index='+ o.pullOutIndex +'],th[data-real-index='+ o.pullOutIndex +']');
                    $wanted.attr('colspan', +$wanted.attr('colspan') - 1);
                    remove = false;
                }
                if( o.checkedCell.matrix[0] == 0 && o.checkedCell.matrix[1] == 1 ) {
                    this.dataTableArray[ row ][ o.pullOutIndex + 1 ] = o.checkedCell;
                }
                if( o.checkedCell.matrix[0] == 1 && o.checkedCell.matrix[1] == 0 ) {
                    this._correctCell( row, o.pullOutIndex, -1, 'colspan' );
                }
                this.dataTableArray[ row ].splice( o.pullOutIndex, 1 );
                if( remove ) o.$tr.find('td[data-real-index='+ o.pullOutIndex +'],th[data-real-index='+ o.pullOutIndex +']').remove();
                o.$tr.find('td[data-real-index],th[data-real-index]').filter(function(){
                    var $this = $(this);
                    if( $this.attr('data-real-index') > o.pullOutIndex )
                        $this.attr('data-real-index', +$this.attr('data-real-index') - 1);
                });
            }
            if (this[name + 'After'] && typeof this[name + 'After'] == 'function')
                this[name + 'After'](o);
            this.doAction( name + 'After', o );
        },

    },

    _saveBackCell: function( rowIndex, colIndex, saving, newValue ) {
        var name = 'saveBackCell',
            chain = saving.split('.'),
            params = {rowIndex:rowIndex,colIndex:colIndex,saving:chain,newValue:newValue};
        this.doAction( name + 'Before', params );
        if(this[name + 'Before'] && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](params) == true || !this[name + 'Before']) {
            var tmp = [],
                o = {};
            for(var i = params.chain.length - 1, lastKey = params.chain.length - 1; i >= 0; i--  ) {
                var a = {};
                if( i == lastKey ) {
                    a[ params.chain[i] ] = params.newValue;
                    tmp.push( a );
                } else {
                    var b = tmp.pop();
                    a[ params.chain[i] ] = b;
                    tmp.push( a );
                }
            }
            o = tmp.pop();
            $.extend(true, this.dataTableArray[ params.rowIndex ][ params.colIndex ], o);
        }
        if(this[name + 'After'] && typeof this[name + 'After'] == 'function')
            this[name + 'After'](params);
        this.doAction( name + 'After', params );
    },

});
