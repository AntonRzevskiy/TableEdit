jQuery(document).ready(function($){

    if( !$.TableEdid ) return;

    $.TableEdid.plugin = {

        addNewRows: function( options ) {
            var o = {
                    'condition': true,
                    'count':     1,
                    'direction': 'top',
                    'scene':     0,
                    'group':     '',
                    '$group':    null,
                    'newRow':    null,
                    'td':        '',
                };
            $.extend(true, o, options);
            o.shiftIndex = o.direction === 'top' ? o.scene : o.scene + 1;
            o.group = this[ o.group ];
            o.checkedRow = o.group[ o.shiftIndex ];
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
                        this.doMethod('_correctCell', {
                            'rowIndex': (o.shiftIndex - 1),
                            'colIndex': col,
                            'correct': 1,
                            'property': 'rowspan',
                            'group': o.group,
                            '$group': o.$group
                        });
                    }
                }
                else {
                    o.newRow[col] = this.doMethod('_defaultValueNewCell', (o.newRow[ col ] instanceof Object) ? o.newRow[ col ] : {});
                }
            }
            o.group.splice( o.shiftIndex, 0, o.newRow );
            var $add = this.doMethod('_getFrontRow', {'rowIndex': o.shiftIndex, '$tr': null, '$group': o.$group});
            if( $add.length ) {
                $add.before( this.doMethod('_createRow', {'$tr':$('<tr/>'),'row':o.group[o.shiftIndex],'index':o.shiftIndex,'group':o.group,'td':o.td}) );
            }
            else {
                o.$group.append( this.doMethod('_createRow', {'$tr':$('<tr/>'),'row':o.group[o.shiftIndex],'index':o.shiftIndex,'group':o.group,'td':o.td}) );
            }
        },

        _defaultValueNewCell: function( params ) {
            if( ! params.hasOwnProperty('value') ) params.value = '';
            return params;
        },

        _correctCell: function( params ) {
            if( params.property === 'rowspan' ) {
                do {
                    if( params.group[ params.rowIndex ][ params.colIndex ].matrix[1] == 0 ) {
                        params.group[ params.rowIndex ][ params.colIndex ].settings.rowspan += params.correct;
                        var $wanted = this.doMethod('_getFrontCell', {'row': params.rowIndex, 'col': params.colIndex, '$td': null, '$group': params.$group});
                        $wanted.attr('rowspan', +$wanted.attr('rowspan') + params.correct);
                        break;
                    }
                } while( params.rowIndex-- >= 0 );
            }
            else if( params.property === 'colspan' ) {
                do {
                    if( params.group[ params.rowIndex ][ params.colIndex ].matrix[0] == 0 ) {
                        params.group[ params.rowIndex ][ params.colIndex ].settings.colspan += params.correct;
                        var $wanted = this.doMethod('_getFrontCell', {'row': params.rowIndex, 'col': params.colIndex, '$td': null, '$group': params.$group});
                        $wanted.attr('colspan', +$wanted.attr('colspan') + params.correct);
                        break;
                    }
                } while( params.colIndex-- >= 0 );
            }
        },

        deleteSomeRows: function( options ) {
            var o = {
                    'condition': true,
                    'count': 1,
                    'direction': 'bottom',
                    'scene': 0,
                    'group': '',
                    '$group': this.$tbody,
                };
            $.extend(true, o, options);
            o.pullOutIndex = o.scene;
            o.pullOutRow = null;
            o.nextRow = null;
            o.group = this[ o.group ];
            while( o.count-- > 0 && o.group[ o.pullOutIndex ] !== undefined ) {
                o.pullOutRow = o.group[ o.pullOutIndex ];
                o.nextRow = o.group[ o.pullOutIndex + 1 ];
                this.doMethod('_deleteRow', o);
            }
        },

        _deleteRow: function( o ) {
            if( o.condition === false ) return;
            for( var col = 0; col < o.pullOutRow.length; col++ ) {
                if( o.pullOutRow[ col ].hasOwnProperty('settings') && o.pullOutRow[ col ].settings.hasOwnProperty('rowspan') && o.pullOutRow[ col ].settings.rowspan > 1 ) {
                    o.pullOutRow[ col ].settings.rowspan -= 1;
                    o.nextRow[col] = o.pullOutRow[ col ];
                    var $movable = this.doMethod('_getFrontCell', {'row': o.pullOutIndex, 'col': col, '$td': null, '$group': o.$group});
                    var $wanted = this.doMethod('_getFrontCell', {'row': (o.pullOutIndex + 1), 'col': (col + (+$movable.attr('colspan') || 1)), '$td': null, '$group': o.$group});
                    $wanted.before( $movable.attr('rowspan', +$movable.attr('rowspan') - 1) );
                }
                if( o.pullOutRow[ col ].matrix[0] == 1 && o.pullOutRow[ col ].matrix[1] == 0 ) {
                    if( o.nextRow ) o.nextRow[col] = o.pullOutRow[ col ];
                }
                if( o.pullOutRow[col].matrix[0] == 0 && o.pullOutRow[col].matrix[1] == 1 ) {
                    this.doMethod('_correctCell', {
                        'rowIndex': o.pullOutIndex,
                        'colIndex': col,
                        'correct': -1,
                        'property': 'rowspan',
                        'group': o.group,
                        '$group': o.$group
                    });
                }
            }
            o.group.splice( o.pullOutIndex, 1 );
            this.doMethod('_getFrontRow', {'rowIndex': o.pullOutIndex, '$tr': null, '$group': o.$group}).remove();
            if( o.count && o.direction === 'top' ) o.pullOutIndex--;
        },

        addNewCols: function( options ) {
            var o = {
                    'condition': true,
                    'count': 1,
                    'scene': 0,
                    'part': true,
                    'newCol': null,
                    'checkedCell': null,
                    'rowIndex': null,
                    'group': null,
                    '$group': null,
                    'td': '',
                };
            $.extend(true, o, options);
            while( o.count-- > 0 ) {
                this.doMethod('_addNewColumn', o);
            }
        },

        _addNewColumn: function( o ) {
            if( o.condition === false ) return;
            this._numberOfColumns += 1;
            var $method = this.controlOrientation == 'left' ? 'after' : 'before';
            this.$thead.find('tr[data-controls]').find('td').eq( o.scene )[ $method ]( $('<td/>').html( this.topControlsElements ) );
            this.$tfoot.find('tr[data-controls]').find('td').eq( o.scene )[ $method ]( $('<td/>').html( this.bottomControlsElements ) );
            var row, length;

            o.newCol = new Array( this.dataTheadArray.length );
            o.group = this.dataTheadArray;
            o.$group = this.$thead;
            o.td = 'th';
            for( row = 0, length = o.newCol.length; row < length; row++ ) {
                o.checkedCell = o.group[ row ][ o.scene ];
                o.rowIndex = row;
                this.doMethod('_addNewCol', o);
            }

            o.newCol = new Array( this.dataTfootArray.length );
            o.group = this.dataTfootArray;
            o.$group = this.$tfoot;
            o.td = 'th';
            for( row = 0, length = o.newCol.length; row < length; row++ ) {
                o.checkedCell = o.group[ row ][ o.scene ];
                o.rowIndex = row;
                this.doMethod('_addNewCol', o);
            }

            o.newCol = new Array( this.dataTbodyArray.length );
            o.group = this.dataTbodyArray;
            o.$group = this.$tbody;
            o.td = 'td';
            if( o.part && this.hasOwnProperty('maxRowsOutDelay') && o.newCol.length > this.maxRowsOutDelay ) {
                this.addNewDelayedCols( o );
            }
            else {
                for( row = 0, length = o.newCol.length; row < length; row++ ) {
                    o.checkedCell = o.group[ row ][ o.scene ];
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
                    o.checkedCell = o.group[ (row + save) ][ o.scene ];
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
                    this.doMethod('_correctCell', {'rowIndex':o.rowIndex,'colIndex':o.scene,'correct':1,'property':'colspan','group':o.group,'$group': o.$group});
                }
            }
            else {
                o.newCol[ o.rowIndex ] = this.doMethod('_defaultValueNewCell', (o.newCol[ o.rowIndex ] instanceof Object) ? o.newCol[ o.rowIndex ] : {});
            }
            o.group[ o.rowIndex ].splice( o.scene, 0, o.newCol[o.rowIndex] );
            var cell = o.group[ o.rowIndex ][ o.scene ],
                $tr = this.doMethod('_getFrontRow', {'rowIndex': o.rowIndex, '$tr': null, '$group': o.$group});
            $tr.find('td[data-real-index],th[data-real-index]').filter(function(){
                var $this = $(this);
                if( $this.attr('data-real-index') >= o.scene )
                    $this.attr('data-real-index', +$this.attr('data-real-index') + 1);
            });
            var $destination = this.doMethod('_getFrontCell', {'row': $tr, 'col': (o.scene + 1), '$td': null, '$group': o.$group});
            if( $destination.length ) {
                $destination.before( this.createCell( $tr, o.group[o.rowIndex], cell, o.rowIndex, o.scene, o.group, o.td ) );
            }
            else {
                var d = o.scene;
                while( --d >= 0 ) {
                    $destination = this.doMethod('_getFrontCell', {'row': $tr, 'col': d, '$td': null, '$group': o.$group});
                    if( $destination.length ) {
                        $destination.after( this.createCell( $tr, o.group[o.rowIndex], cell, o.rowIndex, o.scene, o.group, o.td ) );
                        break;
                    }
                }
                if( d == -1 ) $tr.prepend( this.createCell( $tr, o.group[o.rowIndex], cell, o.rowIndex, o.scene, o.group, o.td ) );
            }
        },

        deleteSomeCols: function( options ) {
            var o = {
                    'condition': true,
                    'count': 1,
                    'scene': 0,
                    'part': true,
                    '$tr': null,
                    'checkedCell': null,
                    'rowIndex': null,
                    'group': null,
                    '$group': null,
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
            this.$thead.find('tr[data-controls]').find('td').eq( o.pullOutIndex ).remove();
            this.$tfoot.find('tr[data-controls]').find('td').eq( o.pullOutIndex ).remove();
            if( this.controlOrientation == 'left' ) o.pullOutIndex -= 1;
            var row, length;

            o.group = this.dataTheadArray;
            o.$group = this.$thead;
            for( row = 0, length = o.group.length; row < length; row++ ) {
                o.$tr = this.doMethod('_getFrontRow', {'rowIndex': row, '$tr': null, '$group': o.$group});
                o.checkedCell = o.group[ row ][ o.pullOutIndex ];
                o.rowIndex = row;
                this.doMethod('_deleteCol', o);
            }

            o.group = this.dataTfootArray;
            o.$group = this.$tfoot;
            for( row = 0, length = o.group.length; row < length; row++ ) {
                o.$tr = this.doMethod('_getFrontRow', {'rowIndex': row, '$tr': null, '$group': o.$group});
                o.checkedCell = o.group[ row ][ o.pullOutIndex ];
                o.rowIndex = row;
                this.doMethod('_deleteCol', o);
            }

            o.group = this.dataTbodyArray;
            o.$group = this.$tbody;
            if( o.part && this.hasOwnProperty('maxRowsOutDelay') && o.group.length > this.maxRowsOutDelay ) {
                this.deleteDelayedCols( o );
            }
            else {
                for( row = 0, length = o.group.length; row < length; row++ ) {
                    o.$tr = this.doMethod('_getFrontRow', {'rowIndex': row, '$tr': null, '$group': o.$group});
                    o.checkedCell = o.group[ row ][ o.pullOutIndex ];
                    o.rowIndex = row;
                    this.doMethod('_deleteCol', o);
                }
            }
        },

        deleteDelayedCols: function( o ) {
            if(! this.hasOwnProperty('howCreateOnce')) return;
            var $that = this,
                times = Math.ceil( (o.group.length - 1) / this.howCreateOnce ),
                interation = 0;
            setTimeout(function delCol(){
                var save = $that.howCreateOnce * interation,
                    length = (o.group.length - save) < $that.howCreateOnce ? o.group.length - save : $that.howCreateOnce;
                for( var row = 0; row < length; row++ ) {
                    o.$tr = $that.doMethod('_getFrontRow', {'rowIndex': (row + save), '$tr': null, '$group': o.$group});
                    o.checkedCell = o.group[ (row + save) ][ o.pullOutIndex ];
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
                o.group[ o.rowIndex ][ o.pullOutIndex + 1 ] = o.checkedCell;
                var $wanted = this.doMethod('_getFrontCell', {'row': o.$tr, 'col': o.pullOutIndex, '$td': null, '$group': o.$group});
                $wanted.attr('colspan', +$wanted.attr('colspan') - 1);
                remove = false;
            }
            if( o.checkedCell.matrix[0] == 0 && o.checkedCell.matrix[1] == 1 ) {
                o.group[ o.rowIndex ][ o.pullOutIndex + 1 ] = o.checkedCell;
            }
            if( o.checkedCell.matrix[0] == 1 && o.checkedCell.matrix[1] == 0 ) {
                this.doMethod('_correctCell', {'rowIndex':o.rowIndex,'colIndex':o.pullOutIndex,'correct':-1,'property':'colspan','group':o.group,'$group': o.$group});
            }
            o.group[ o.rowIndex ].splice( o.pullOutIndex, 1 );
            if( remove ) this.doMethod('_getFrontCell', {'row': o.$tr, 'col': o.pullOutIndex, '$td': null, '$group': o.$group}).remove();
            o.$tr.find('td[data-real-index],th[data-real-index]').filter(function(){
                var $this = $(this);
                if( $this.attr('data-real-index') > o.pullOutIndex )
                    $this.attr('data-real-index', +$this.attr('data-real-index') - 1);
            });
        },

        saveBackCell: function( rowIndex, colIndex, saving, newValue, group ) {
            var chain = saving.split('.');
            this.doMethod('_saveBackCell', {
                'rowIndex': rowIndex,
                'colIndex': colIndex,
                'saving': chain,
                'newValue': newValue,
                'group': group,
            });
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
            $.extend(true, params.group[ params.rowIndex ][ params.colIndex ], o);
        },

        _getFrontRow: function( params ) {
            if( params.$group.is('thead') ) {
                // minus controls rows for thead only
                params.rowIndex += params.$group.find('tr[data-controls]').length;
            }
            return params.$tr = params.$group.find('tr').eq( +params.rowIndex );
        },

        _getFrontCell: function( params ) {
            if( typeof params.row === 'object' ) {
                return params.$td = params.row.find('td[data-real-index='+ +params.col +'],th[data-real-index='+ +params.col +']');
            }
            else {
                return params.$td = this.doMethod('_getFrontRow', {'rowIndex': params.row, '$tr': null, '$group': params.$group}).find('td[data-real-index='+ +params.col +'],th[data-real-index='+ +params.col +']');
            }
        },

        change: function( group, rowIndex, colIndex, newData ) {
            var params = {
                    group: this[ group ],
                    $group: null,
                    rowIndex: +rowIndex,
                    colIndex: +colIndex,
                    newData: newData,
                    adding: [],
                    remove: [],
                    cell: this[ group ][ +rowIndex ][ +colIndex ],
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
            switch( group ) {
                case 'dataTheadArray':
                    params.$group = this.$thead;
                        break;
                case 'dataTbodyArray':
                    params.$group = this.$tbody;
                        break;
                case 'dataTfootArray':
                    params.$group = this.$tfoot;
                        break;
            }
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
                            cell: params.group[ (params.rowIndex + row) ][ (params.colIndex + params.getTune('colspan',params.cell) - 1 - col) ],
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
                            cell: params.group[ (params.rowIndex + params.getTune('rowspan',params.cell) - 1 - row) ][ (params.colIndex + col) ],
                        });
                    }
                }
            }
            if( params.getTune('colspan',params.newData) > params.getTune('colspan',params.cell) ) {
                countCol = params.getTune('colspan',params.newData) - params.getTune('colspan',params.cell);
                countRow = params.getTune('rowspan',params.cell) - params.getTune('rowspan',params.newData) > 0 ? params.getTune('rowspan',params.newData) : params.getTune('rowspan',params.cell);
                for( var row = 0; row < countRow; row++ ) {
                    for( var col = 0; col < countCol; col++ ) {
                        var checkCell = params.group[ (params.rowIndex + row) ][ (params.colIndex + params.getTune('colspan',params.cell) + col) ];
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
                        var checkCell = params.group[ (params.rowIndex + params.getTune('rowspan',params.cell) + row) ] ? params.group[ (params.rowIndex + params.getTune('rowspan',params.cell) + row) ][ (params.colIndex + col) ] : undefined;
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
                this.saveBackCell( params.rowIndex, params.colIndex, 'value', params.newData.value, params.group );
                this.doMethod('_getFrontCell', {'row': params.rowIndex, 'col': params.colIndex, '$td': null, '$group': params.$group}).html( params.newData.value );
            }
        },

        _handleContraction: function( params ) {
            if( params.stretchError.rowspan.length == 0 && params.stretchError.colspan.length == 0 ) {
                for( var i = 0; i < params.adding.length; i++ ) {
                    var el = params.adding[i];
                    var col = el.colIndex + 1;
                    delete el.cell.matrix;
                    this.doMethod('_defaultValueNewCell', el.cell);
                    var $tr = this.doMethod('_getFrontRow', {'rowIndex': el.rowIndex, '$tr': null, '$group': params.$group});
                    do {
                        if( params.group[ el.rowIndex ][ col ] === undefined ) {
                            if( this.controlOrientation === 'left' ) {
                                $tr.append( this.createCell( $tr, params.group[el.rowIndex], el.cell, el.rowIndex, el.colIndex, params.group, 'td' ) );
                                break;
                            }
                            $tr.find('td,th').eq( -1 ).before( this.createCell( $tr, params.group[el.rowIndex], el.cell, el.rowIndex, el.colIndex, params.group, 'td' ) );
                            break;
                        }
                        if( params.group[ el.rowIndex ][ col ].matrix[0] == 0 && params.group[ el.rowIndex ][ col ].matrix[1] == 0 ) {
                            
                            this.doMethod('_getFrontCell', {'row': $tr, 'col': col, '$td': null, '$group': params.$group}).before(
                                this.createCell( $tr, params.group[el.rowIndex], el.cell, el.rowIndex, el.colIndex, params.group, 'td' )
                            );
                            break;
                        }
                    }while( col++ < this._numberOfColumns );
                }
                if( params.getTune('colspan',params.newData) < params.getTune('colspan',params.cell) ) {
                    this.saveBackCell( params.rowIndex, params.colIndex, 'settings.colspan', params.newData.settings.colspan, params.group );
                    this.doMethod('_getFrontCell', {'row': params.rowIndex, 'col': params.colIndex, '$td': null, '$group': params.$group}).attr('colspan', params.cell.settings.colspan);
                }
                if( params.getTune('rowspan',params.newData) < params.getTune('rowspan',params.cell) ) {
                    this.saveBackCell( params.rowIndex, params.colIndex, 'settings.rowspan', params.newData.settings.rowspan, params.group );
                    this.doMethod('_getFrontCell', {'row': params.rowIndex, 'col': params.colIndex, '$td': null, '$group': params.$group}).attr('rowspan', params.cell.settings.rowspan);
                }
            }
        },

        _handleStretching: function( params ) {
            if( params.stretchError.rowspan.length == 0 && params.stretchError.colspan.length == 0 ) {
                for( var i = 0; i < params.remove.length; i++ ) {
                    var el = params.remove[i];
                    this.doMethod('_emptyCell', el.cell);
                    this.doMethod('_getFrontCell', {'row': el.rowIndex, 'col': el.colIndex, '$td': null, '$group': params.$group}).remove();
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
                    this.saveBackCell( params.rowIndex, params.colIndex, 'settings.colspan', params.newData.settings.colspan, params.group );
                    this.doMethod('_getFrontCell', {'row': params.rowIndex, 'col': params.colIndex, '$td': null, '$group': params.$group}).attr('colspan', params.cell.settings.colspan);
                }
                if( params.getTune('rowspan',params.newData) > params.getTune('rowspan',params.cell) ) {
                    this.saveBackCell( params.rowIndex, params.colIndex, 'settings.rowspan', params.newData.settings.rowspan, params.group );
                    this.doMethod('_getFrontCell', {'row': params.rowIndex, 'col': params.colIndex, '$td': null, '$group': params.$group}).attr('rowspan', params.cell.settings.rowspan);
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
