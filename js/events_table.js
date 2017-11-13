jQuery(document).ready(function($){

    if( !$.TableEdid ) return;

    $.TableEdid.plugin = {

        _eventsBind: function() {
            var name = 'eventsBind';
            this.doAction( name + 'Before' );
            if(this[name + 'Before'] && typeof this[name + 'Before'] == 'function' && this[name + 'Before']() == true || !this[name + 'Before']) {

                this.$tbody.on(
                    'click._addRow',
                    '.addrow',
                    this,
                    function(e) {
                        var thisRowIndex = $(this).closest('tr').index();
                        e.data._addNewRows({count:5,scene:thisRowIndex,direction:'top'});
                    }
                );

                this.$tbody.on(
                    'click._delRow',
                    '.delrow',
                    this,
                    function(e) {
                        var thisRowIndex = $(this).closest('tr').index();
                        e.data._deleteSomeRows({count:5,scene:thisRowIndex,direction:'bottom'});
                    }
                );

                this.$thead.on(
                    'click._addCol',
                    '.addCol',
                    this,
                    this._addCol
                );

                this.$tfoot.on(
                    'click._addCol',
                    '.addCol',
                    this,
                    this._addCol
                );

                this.$thead.on(
                    'click._delCol',
                    '.delCol',
                    this,
                    this._delCol
                );

                this.$tfoot.on(
                    'click._delCol',
                    '.delCol',
                    this,
                    this._delCol
                );

            }
            if (this[name + 'After'] && typeof this[name + 'After'] == 'function')
                this[name + 'After']();
            this.doAction( name + 'After' );
        },

        _addCol: function(e) {
            var thisColIndex = $(this).closest('td').index();
            e.data._addNewCols({ scene:thisColIndex, part:true, count:5 });
        },

        _delCol: function(e) {
            var thisColIndex = $(this).closest('td').index();
            e.data._deleteSomeCols({ scene:thisColIndex, part:true, count:5 });
        },

    };

    $.TableEdid.init = '_eventsBind';

});
