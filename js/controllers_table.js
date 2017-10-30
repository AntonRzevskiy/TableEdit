$.TableEdid.defaults = {

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
            if(this.hasOwnProperty(name + 'Before') && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](o) == true || !this.hasOwnProperty(name + 'Before')) {
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
            if (this.hasOwnProperty(name + 'After') && typeof this[name + 'After'] == 'function')
                this[name + 'After'](o);
            this.doAction( name + 'After', o );
        }
    },

    _defaultValueNewCell: function() {
        var name = '_defaultValueNewCell',
            params = {};
        this.doAction( name + 'Before', params );
        if(this.hasOwnProperty(name + 'Before') && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](params) == true || !this.hasOwnProperty(name + 'Before')) {
            if( ! params.hasOwnProperty('value') ) params.value = '';
        }
        if (this.hasOwnProperty(name + 'After') && typeof this[name + 'After'] == 'function')
            this[name + 'After'](params);
        this.doAction( name + 'After', params );
        return params;
    },

};
