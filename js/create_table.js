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

};