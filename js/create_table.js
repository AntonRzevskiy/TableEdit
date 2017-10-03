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
            params = {$tr:$tr,$td:$('<td/>')};
        this.doAction( name + 'Before', params );
        if(this.hasOwnProperty(name + 'Before') && typeof this[name + 'Before'] == 'function' && this[name + 'Before'](params) == true || !this.hasOwnProperty(name + 'Before')) {
            if( this.controlOrientation === 'right' ) {
                params.$tr.append(
                    params.$td.html( this.stubElements )
                );
            }
            else if( this.controlOrientation === 'left' ) {
                params.$tr.prepend(
                    params.$td.html( this.stubElements )
                );
            }
        }
        if (this.hasOwnProperty(name + 'After') && typeof this[name + 'After'] == 'function')
            this[name + 'After'](params);
        this.doAction( name + 'After', params );
        return params.$tr;
    },

};