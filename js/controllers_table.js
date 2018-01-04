jQuery(document).ready(function($){

    if( !$.TableEdid ) return;

    $.TableEdid.plugin = {

        addNewRows: function( options ) {
            var o = {
                    condition: true,
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
                this.doMethod('_addNewRow', o);
            }
        },

        _addNewRow: function( o ) {
            if( o.condition === false ) return;
            for( var col = 0; col < o.newRow.length; col++ ) {
                if( o.checkedRow !== undefined && o.checkedRow[col].matrix[1] == 1 ) {
                    o.newRow[col] = {matrix: o.checkedRow[col].matrix};
                    if( o.checkedRow[col].matrix[0] == 0 ) {
                        this.doMethod('_correctCell', {rowIndex:(o.shiftIndex - 1),colIndex:col,correct:1,property:'rowspan'});
                    }
                }
                else {
                    o.newRow[col] = this.doMethod('_defaultValueNewCell', (o.newRow[ col ] instanceof Object) ? o.newRow[ col ] : {});
                }
            }
            this.dataTableArray.splice( o.shiftIndex, 0, o.newRow );
            var $add = this.doMethod('_getFrontRow', {rowIndex: o.shiftIndex, $tr: null});
            if( $add.length ) {
                $add.before( this._createRow({$tr:$('<tr/>'),row:this.dataTableArray[o.shiftIndex],index:o.shiftIndex}) );
            }
            else {
                this.$tbody.append( this._createRow({$tr:$('<tr/>'),row:this.dataTableArray[o.shiftIndex],index:o.shiftIndex}) );
            }
        },

        _defaultValueNewCell: function( params ) {
            if( ! params.hasOwnProperty('value') ) params.value = '';
            return params;
        },

        _correctCell: function( params ) {
            if( params.property === 'rowspan' ) {
                do {
                    if( this.dataTableArray[ params.rowIndex ][ params.colIndex ].matrix[1] == 0 ) {
                        this.dataTableArray[ params.rowIndex ][ params.colIndex ].settings.rowspan += params.correct;
                        var $wanted = this.doMethod('_getFrontCell', {row: params.rowIndex, col: params.colIndex, $td: null});
                        $wanted.attr('rowspan', +$wanted.attr('rowspan') + params.correct);
                        break;
                    }
                } while( params.rowIndex-- >= 0 );
            }
            else if( params.property === 'colspan' ) {
                do {
                    if( this.dataTableArray[ params.rowIndex ][ params.colIndex ].matrix[0] == 0 ) {
                        this.dataTableArray[ params.rowIndex ][ params.colIndex ].settings.colspan += params.correct;
                        var $wanted = this.doMethod('_getFrontCell', {row: params.rowIndex, col: params.colIndex, $td: null});
                        $wanted.attr('colspan', +$wanted.attr('colspan') + params.correct);
                        break;
                    }
                } while( params.colIndex-- >= 0 );
            }
        },

        deleteSomeRows: function( options ) {
            var o = {
                    condition: true,
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
                this.doMethod('_deleteRow', o);
            }
        },

        _deleteRow: function( o ) {
            if( o.condition === false ) return;
            for( var col = 0; col < o.pullOutRow.length; col++ ) {
                if( o.pullOutRow[ col ].hasOwnProperty('settings') && o.pullOutRow[ col ].settings.hasOwnProperty('rowspan') && o.pullOutRow[ col ].settings.rowspan > 1 ) {
                    o.pullOutRow[ col ].settings.rowspan -= 1;
                    o.nextRow[col] = o.pullOutRow[ col ];
                    var $movable = this.doMethod('_getFrontCell', {row: o.pullOutIndex, col: col, $td: null});
                    var $wanted = this.doMethod('_getFrontCell', {row: (o.pullOutIndex + 1), col: (col + (+$movable.attr('colspan') || 1)), $td: null});
                    $wanted.before( $movable.attr('rowspan', +$movable.attr('rowspan') - 1) );
                }
                if( o.pullOutRow[ col ].matrix[0] == 1 && o.pullOutRow[ col ].matrix[1] == 0 ) {
                    o.nextRow[col] = o.pullOutRow[ col ];
                }
                if( o.pullOutRow[col].matrix[0] == 0 && o.pullOutRow[col].matrix[1] == 1 ) {
                    this.doMethod('_correctCell', {rowIndex:o.pullOutIndex,colIndex:col,correct:-1,property:'rowspan'});
                }
            }
            this.dataTableArray.splice( o.pullOutIndex, 1 );
            this.doMethod('_getFrontRow', {rowIndex: o.pullOutIndex, $tr: null}).remove();
            if( o.count && o.direction === 'top' ) o.pullOutIndex--;
        },

        addNewCols: function( options ) {
            var o = {
                    condition: true,
                    count: 1,
                    scene: 0,
                    part: true,
                    newCol: null,
                    checkedCell: null,
                    rowIndex: null,
                };
            $.extend(true, o, options);
            while( o.count-- > 0 ) {
                o.newCol = new Array( this.dataTableArray.length );
                this.doMethod('_addNewColumn', o);
                
            }
        },

        _addNewColumn: function( o ) {
            if( o.condition === false ) return;
            this._numberOfColumns += 1;
            var $method = this.controlOrientation == 'left' ? 'after' : 'before';
            this.$thead.find('td').eq( o.scene )[ $method ]( $('<td/>').html( this.topControlsElements ) );
            this.$tfoot.find('td').eq( o.scene )[ $method ]( $('<td/>').html( this.bottomControlsElements ) );
            if( o.part && this.hasOwnProperty('maxRowsOutDelay') && o.newCol.length > this.maxRowsOutDelay ) {
                this.addNewDelayedCols( o );
            }
            else {
                for( var row = 0, length = o.newCol.length; row < length; row++ ) {
                    o.checkedCell = this.dataTableArray[ row ][ o.scene ];
                    o.rowIndex = row;
                    this.doMethod('_addNewCol', o);
                }
            }
        },

        addNewDelayedCols: function( o ) {
            if(! this.hasOwnProperty('howCreateOnce')) return;
            var $that = this,
                times = Math.ceil( (o.newCol.length - 1) / this.howCreateOnce ),
                interation = 0;
            setTimeout(function generateCol(){
                var save = $that.howCreateOnce * interation,
                    length = (o.newCol.length - save) < $that.howCreateOnce ? o.newCol.length - save : $that.howCreateOnce;
                for( var row = 0; row < length; row++ ) {
                    o.checkedCell = $that.dataTableArray[ (row + save) ][ o.scene ];
                    o.rowIndex = (row + save);
                    $that.doMethod('_addNewCol', o);
                }
                if( ++interation < times )
                    setTimeout(generateCol,0);
            },0);
        },

        _addNewCol: function( o ) {
            if( o.checkedCell !== undefined && o.checkedCell.matrix[0] == 1 ) {
                o.newCol[ o.rowIndex ] = {matrix: o.checkedCell.matrix};
                if( o.checkedCell.matrix[1] == 0 ) {
                    this.doMethod('_correctCell', {rowIndex:o.rowIndex,colIndex:o.scene,correct:1,property:'colspan'});
                    
                }
            }
            else {
                o.newCol[ o.rowIndex ] = this.doMethod('_defaultValueNewCell', (o.newCol[ o.rowIndex ] instanceof Object) ? o.newCol[ o.rowIndex ] : {});
            }
            this.dataTableArray[ o.rowIndex ].splice( o.scene, 0, o.newCol[o.rowIndex] );
            var cell = this.dataTableArray[ o.rowIndex ][ o.scene ],
                $tr = this.doMethod('_getFrontRow', {rowIndex: o.rowIndex, $tr: null});
            $tr.find('td[data-real-index],th[data-real-index]').filter(function(){
                var $this = $(this);
                if( $this.attr('data-real-index') >= o.scene )
                    $this.attr('data-real-index', +$this.attr('data-real-index') + 1);
            });
            var $destination = this.doMethod('_getFrontCell', {row: $tr, col: (o.scene + 1), $td: null});
            if( $destination.length ) {
                $destination.before( this.createCell( $tr, this.dataTableArray[o.rowIndex], cell, o.rowIndex, o.scene ) );
            }
            else {
                var d = o.scene;
                while( --d >= 0 ) {
                    $destination = this.doMethod('_getFrontCell', {row: $tr, col: d, $td: null});
                    if( $destination.length ) {
                        $destination.after( this.createCell( $tr, this.dataTableArray[o.rowIndex], cell, o.rowIndex, o.scene ) );
                        break;
                    }
                }
                if( d == -1 ) $tr.prepend( this.createCell( $tr, this.dataTableArray[o.rowIndex], cell, o.rowIndex, o.scene ) );
            }
        },

        deleteSomeCols: function( options ) {
            var o = {
                    condition: true,
                    count: 1,
                    scene: 0,
                    part: true,
                    $tr: null,
                    checkedCell: null,
                    rowIndex: null,
                };
            $.extend(true, o, options);
            o.pullOutIndex = o.scene;
            while( o.count-- > 0 ) {
                this.doMethod('_deleteColumn', o);
            }
        },

        _deleteColumn: function( o ) {
            if( o.condition === false ) return;
            this._numberOfColumns -= 1;
            this.$thead.find('td').eq( o.pullOutIndex ).remove();
            this.$tfoot.find('td').eq( o.pullOutIndex ).remove();
            if( this.controlOrientation == 'left' ) o.pullOutIndex -= 1;
            if( o.part && this.hasOwnProperty('maxRowsOutDelay') && this.dataTableArray.length > this.maxRowsOutDelay ) {
                this.deleteDelayedCols( o );
            }
            else {
                for( var row = 0, length = this.dataTableArray.length; row < length; row++ ) {
                    o.$tr = this.doMethod('_getFrontRow', {rowIndex: row, $tr: null});
                    o.checkedCell = this.dataTableArray[ row ][ o.pullOutIndex ];
                    o.rowIndex = row;
                    this.doMethod('_deleteCol', o);
                }
            }
        },

        deleteDelayedCols: function( o ) {
            if(! this.hasOwnProperty('howCreateOnce')) return;
            var $that = this,
                times = Math.ceil( (this.dataTableArray.length - 1) / this.howCreateOnce ),
                interation = 0;
            setTimeout(function delCol(){
                var save = $that.howCreateOnce * interation,
                    length = ($that.dataTableArray.length - save) < $that.howCreateOnce ? $that.dataTableArray.length - save : $that.howCreateOnce;
                for( var row = 0; row < length; row++ ) {
                    o.$tr = $that.doMethod('_getFrontRow', {rowIndex: (row + save), $tr: null});
                    o.checkedCell = $that.dataTableArray[ (row + save) ][ o.pullOutIndex ];
                    o.rowIndex = (row + save);
                    $that.doMethod('_deleteCol', o);
                }
                if( ++interation < times )
                    setTimeout(delCol,0);
            },0);
        },

        _deleteCol: function( o ) {
            var remove = true;
            if( o.checkedCell.hasOwnProperty('settings') && o.checkedCell.settings.hasOwnProperty('colspan') && o.checkedCell.settings.colspan > 1 ) {
                o.checkedCell.settings.colspan -= 1;
                this.dataTableArray[ o.rowIndex ][ o.pullOutIndex + 1 ] = o.checkedCell;
                var $wanted = this.doMethod('_getFrontCell', {row: o.$tr, col: o.pullOutIndex, $td: null});
                $wanted.attr('colspan', +$wanted.attr('colspan') - 1);
                remove = false;
            }
            if( o.checkedCell.matrix[0] == 0 && o.checkedCell.matrix[1] == 1 ) {
                this.dataTableArray[ o.rowIndex ][ o.pullOutIndex + 1 ] = o.checkedCell;
            }
            if( o.checkedCell.matrix[0] == 1 && o.checkedCell.matrix[1] == 0 ) {
                this.doMethod('_correctCell', {rowIndex:o.rowIndex,colIndex:o.pullOutIndex,correct:-1,property:'colspan'});
            }
            this.dataTableArray[ o.rowIndex ].splice( o.pullOutIndex, 1 );
            if( remove ) this.doMethod('_getFrontCell', {row: o.$tr, col: o.pullOutIndex, $td: null}).remove();
            o.$tr.find('td[data-real-index],th[data-real-index]').filter(function(){
                var $this = $(this);
                if( $this.attr('data-real-index') > o.pullOutIndex )
                    $this.attr('data-real-index', +$this.attr('data-real-index') - 1);
            });
        },

        saveBackCell: function( rowIndex, colIndex, saving, newValue ) {
            var chain = saving.split('.');
            this.doMethod('_saveBackCell', {rowIndex:rowIndex,colIndex:colIndex,saving:chain,newValue:newValue});
        },

        _saveBackCell: function( params ) {
            var tmp = [],
                o = {};
            for(var i = params.saving.length - 1, lastKey = params.saving.length - 1; i >= 0; i--  ) {
                var a = {};
                if( i == lastKey ) {
                    a[ params.saving[i] ] = params.newValue;
                    tmp.push( a );
                } else {
                    var b = tmp.pop();
                    a[ params.saving[i] ] = b;
                    tmp.push( a );
                }
            }
            o = tmp.pop();
            $.extend(true, this.dataTableArray[ params.rowIndex ][ params.colIndex ], o);
        },

        _getFrontRow: function( params ) {
            return params.$tr = this.$tbody.find('tr').eq( +params.rowIndex );
        },

        _getFrontCell: function( params ) {
            if( typeof params.row === 'object' ) {
                return params.$td = params.row.find('td[data-real-index='+ +params.col +'],th[data-real-index='+ +params.col +']');
            }
            else {
                return params.$td = this.doMethod('_getFrontRow', {rowIndex: params.row, $tr: null}).find('td[data-real-index='+ +params.col +'],th[data-real-index='+ +params.col +']');
            }
        },

        change: function( rowIndex, colIndex, newData ) {
            var params = {
                    rowIndex: +rowIndex,
                    colIndex: +colIndex,
                    newData: newData,
                    adding: [],
                    remove: [],
                    cell: this.dataTableArray[ rowIndex ][ colIndex ],
                    stretchError: {
                        colspan: [],
                        rowspan: []
                    },
                    getTune: function( interest, obj, replace ) {
                        replace = replace || 1;
                        return obj.settings && obj.settings[interest] ? +obj.settings[interest] : replace;
                    },
                    isStretched: function( cell ) {
                        if( cell === undefined ) return true;
                        if( cell.matrix ) {
                            if( cell.matrix[0] != 0 || cell.matrix[1] != 0 ) return true;
                        }
                        if( this.getTune('colspan',cell) > 1 ) return true;
                        if( this.getTune('rowspan',cell) > 1 ) return true;
                        return false;
                    }
                };
            return this.doMethod('_change', params);
        },

        _change: function( params ) {
            var countCol,
                countRow;

            if( params.getTune('colspan',params.newData) < params.getTune('colspan',params.cell) ) {
                countCol = params.getTune('colspan',params.cell) - params.getTune('colspan',params.newData);
                countRow = params.getTune('rowspan',params.cell);
                for( var row = 0; row < countRow; row++ ) {
                    for( var col = 0; col < countCol; col++ ) {
                        params.adding.push({
                            rowIndex: (params.rowIndex + row),
                            colIndex: (params.colIndex + params.getTune('colspan',params.cell) - 1 - col),
                            cell: this.dataTableArray[ (params.rowIndex + row) ][ (params.colIndex + params.getTune('colspan',params.cell) - 1 - col) ],
                        });
                    }
                }
            }
            if( params.getTune('rowspan',params.newData) < params.getTune('rowspan',params.cell) ) {
                countCol = params.getTune('colspan',params.cell) - params.getTune('colspan',params.newData) > 0 ? params.getTune('colspan',params.newData) : params.getTune('colspan',params.cell);
                countRow = params.getTune('rowspan',params.cell) - params.getTune('rowspan',params.newData);
                for( var row = 0; row < countRow; row++ ) {
                    for( var col = 0; col < countCol; col++ ) {
                        params.adding.push({
                            rowIndex: (params.rowIndex + params.getTune('rowspan',params.cell) - 1 - row),
                            colIndex: (params.colIndex + col),
                            cell: this.dataTableArray[ (params.rowIndex + params.getTune('rowspan',params.cell) - 1 - row) ][ (params.colIndex + col) ],
                        });
                    }
                }
            }
            if( params.getTune('colspan',params.newData) > params.getTune('colspan',params.cell) ) {
                countCol = params.getTune('colspan',params.newData) - params.getTune('colspan',params.cell);
                countRow = params.getTune('rowspan',params.cell) - params.getTune('rowspan',params.newData) > 0 ? params.getTune('rowspan',params.newData) : params.getTune('rowspan',params.cell);
                for( var row = 0; row < countRow; row++ ) {
                    for( var col = 0; col < countCol; col++ ) {
                        var checkCell = this.dataTableArray[ (params.rowIndex + row) ][ (params.colIndex + params.getTune('colspan',params.cell) + col) ];
                        params.remove.push({
                            rowIndex: (params.rowIndex + row),
                            colIndex: (params.colIndex + params.getTune('colspan',params.cell) + col),
                            cell: checkCell,
                        });
                        if( params.isStretched(checkCell) ) {
                            params.stretchError.colspan.push({
                                rowIndex: (params.rowIndex + row),
                                colIndex: (params.colIndex + params.getTune('colspan',params.cell) + col),
                                cell: checkCell,
                            });
                        }
                    }
                }
            }
            if( params.getTune('rowspan',params.newData) > params.getTune('rowspan',params.cell) ) {
                countCol = params.newData.settings.colspan ? params.getTune('colspan',params.newData) : params.getTune('colspan',params.cell);
                countRow = params.getTune('rowspan',params.newData) - params.getTune('rowspan',params.cell);
                for( var row = 0; row < countRow; row++ ) {
                    for( var col = 0; col < countCol; col++ ) {
                        var checkCell = this.dataTableArray[ (params.rowIndex + params.getTune('rowspan',params.cell) + row) ] ? this.dataTableArray[ (params.rowIndex + params.getTune('rowspan',params.cell) + row) ][ (params.colIndex + col) ] : undefined;
                        params.remove.push({
                            rowIndex: (params.rowIndex + params.getTune('rowspan',params.cell) + row),
                            colIndex: (params.colIndex + col),
                            cell: checkCell,
                        });
                        if( params.isStretched(checkCell) ) {
                            params.stretchError.rowspan.push({
                                rowIndex: (params.rowIndex + params.getTune('rowspan',params.cell) + row),
                                colIndex: (params.colIndex + col),
                                cell: checkCell,
                            });
                        }
                    }
                }
            }

            if( params.adding.length ) this.doMethod('_handleContraction', params );
            if( params.remove.length ) this.doMethod('_handleStretching', params );
            if( params.newData.hasOwnProperty('value') ) this.doMethod('_handleValueChanging', params );
        },

        _handleValueChanging: function( params ) {
            if( params.cell.hasOwnProperty('value') && params.cell.value != params.newData.value ) {
                this.saveBackCell( params.rowIndex, params.colIndex, 'value', params.newData.value );
                this.doMethod('_getFrontCell', {row: params.rowIndex, col: params.colIndex, $td: null}).html( params.newData.value );
            }
        },

        _handleContraction: function( params ) {
            if( params.stretchError.rowspan.length == 0 && params.stretchError.colspan.length == 0 ) {
                for( var i = 0; i < params.adding.length; i++ ) {
                    var el = params.adding[i];
                    var col = el.colIndex + 1;
                    delete el.cell.matrix;
                    this.doMethod('_defaultValueNewCell', el.cell);
                    var $tr = this.doMethod('_getFrontRow', {rowIndex: el.rowIndex, $tr: null});
                    do {
                        if( this.dataTableArray[ el.rowIndex ][ col ] === undefined ) {
                            if( this.controlOrientation === 'left' ) {
                                $tr.append( this.createCell( $tr, this.dataTableArray[el.rowIndex], el.cell, el.rowIndex, el.colIndex ) );
                                break;
                            }
                            $tr.find('td,th').eq( -1 ).before( this.createCell( $tr, this.dataTableArray[el.rowIndex], el.cell, el.rowIndex, el.colIndex ) );
                            break;
                        }
                        if( this.dataTableArray[ el.rowIndex ][ col ].matrix[0] == 0 && this.dataTableArray[ el.rowIndex ][ col ].matrix[1] == 0 ) {
                            
                            this.doMethod('_getFrontCell', {row: $tr, col: col, $td: null}).before(
                                this.createCell( $tr, this.dataTableArray[el.rowIndex], el.cell, el.rowIndex, el.colIndex )
                            );
                            break;
                        }
                    }while( col++ < this._numberOfColumns );
                }
                if( params.getTune('colspan',params.newData) < params.getTune('colspan',params.cell) ) {
                    this.saveBackCell( params.rowIndex, params.colIndex, 'settings.colspan', params.newData.settings.colspan );
                    this.doMethod('_getFrontCell', {row: params.rowIndex, col: params.colIndex, $td: null}).attr('colspan', params.cell.settings.colspan);
                }
                if( params.getTune('rowspan',params.newData) < params.getTune('rowspan',params.cell) ) {
                    this.saveBackCell( params.rowIndex, params.colIndex, 'settings.rowspan', params.newData.settings.rowspan );
                    this.doMethod('_getFrontCell', {row: params.rowIndex, col: params.colIndex, $td: null}).attr('rowspan', params.cell.settings.rowspan);
                }
            }
        },

        _handleStretching: function( params ) {
            if( params.stretchError.rowspan.length == 0 && params.stretchError.colspan.length == 0 ) {
                for( var i = 0; i < params.remove.length; i++ ) {
                    var el = params.remove[i];
                    this.doMethod('_emptyCell', el.cell);
                    this.doMethod('_getFrontCell', {row: el.rowIndex, col: el.colIndex, $td: null}).remove();
                    if( el.rowIndex ==  params.rowIndex ) {
                        el.cell.matrix = [1,0];
                    }
                    else if( el.colIndex ==  params.colIndex ) {
                        el.cell.matrix = [0,1];
                    }
                    else {
                       el.cell.matrix = [1,1]; 
                    }
                }
                if( params.getTune('colspan',params.newData) > params.getTune('colspan',params.cell) ) {
                    this.saveBackCell( params.rowIndex, params.colIndex, 'settings.colspan', params.newData.settings.colspan );
                    this.doMethod('_getFrontCell', {row: params.rowIndex, col: params.colIndex, $td: null}).attr('colspan', params.cell.settings.colspan);
                }
                if( params.getTune('rowspan',params.newData) > params.getTune('rowspan',params.cell) ) {
                    this.saveBackCell( params.rowIndex, params.colIndex, 'settings.rowspan', params.newData.settings.rowspan );
                    this.doMethod('_getFrontCell', {row: params.rowIndex, col: params.colIndex, $td: null}).attr('rowspan', params.cell.settings.rowspan);
                }
            }
        },

        _emptyCell: function( cell ) {
            for( var key in cell) {
                delete cell[key];
            }
        },

    };

});
