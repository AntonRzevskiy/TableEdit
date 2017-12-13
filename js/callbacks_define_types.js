jQuery(document).ready(function($){

    if( !$.TableEdid ) return;

    $.TableEdid.plugin = {

        _getSettingsFromCell: function( params ) {
            if( params.$element.attr('rowspan') ) params.settings.rowspan = +params.$element.attr('rowspan');
            if( params.$element.attr('colspan') ) params.settings.colspan = +params.$element.attr('colspan');
            return params.settings;
        },

        convertTableToArray: function( selector, search ) {
            params = {
               selector: selector,
               search: search,
               rows: [],
               row: null,
               cell: null,
            }
            return this.doMethod('_convertTableToArray', params);
        },

        _convertTableToArray: function( params ) {
            var that = this;
            $( params.selector ).find( params.search ).each(function() {
                params.row = [];
                $(this).find('th, td').each(function() {
                    params.cell = {
                        value: $(this).html(),
                        settings: that.doMethod('_getSettingsFromCell', {$element: $(this), settings: {}})
                    };
                    if( $.isEmptyObject(params.cell.settings) ) delete params.cell.settings;
                    params.row.push( params.cell );
                });
                params.rows.push( params.row );
            });
            return params.rows;
        }

    };

    $.TableEdid.callbacks.refresh();

    $.TableEdid.callbacks.defineTypeAfter = function(params) {

        if( this.dataTableArray.length ) return true;

        // from textarea
        if( $(params.selector).is('textarea') ) {
            try {
                this.dataTableArray = JSON.parse($(params.selector).val());
                return true;
            } catch (e) {
                console.error(e);
                this.dataTableArray = this.dataTableDefaultArray;
            }
        }

        // from table
        if( $(params.selector).is('table') ) {
            try {
                var thead = this.convertTableToArray( params.selector, 'thead > tr' );
                var tbody = this.convertTableToArray( params.selector, 'tbody > tr' );
                var tfoot = this.convertTableToArray( params.selector, 'tfoot > tr' );
                this.dataTableArray = thead.concat(tbody, tfoot);
                if( this.dataTableArray.length ) return true;
            } catch (e) {
                console.error(e);
                this.dataTableArray = this.dataTableDefaultArray;
            }
        }

        return true;
    };

    $.TableEdid.callbacks.addTableAfter = function( obj ) {
        if( $(obj.selector).is('table') ) $(obj.selector).addClass('hidden');
        return true;
    };

});
