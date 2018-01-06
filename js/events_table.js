jQuery(document).ready(function($){

    if( !$.TableEdid ) return;

    $.TableEdid.plugin = {

        _eventsBind: function() {

            if( ! this.uniqueID ) this.uniqueID = this._numberOfColumns + this.dataTbodyArray.length + Math.floor(Math.random() * 900 + 100);

            this.$tbody.on(
                'click._addRow',
                '.addrow',
                this,
                function(e) {
                    var thisRowIndex = $(this).closest('tr').index();
                    e.data.addNewRows({
                        'scene': thisRowIndex,
                        'group': e.data.dataTbodyArray // coz event for tbody
                    });
                }
            );

            this.$tbody.on(
                'click._delRow',
                '.delrow',
                this,
                function(e) {
                    var thisRowIndex = $(this).closest('tr').index();
                    e.data.deleteSomeRows({
                        'scene': thisRowIndex,
                        'group': e.data.dataTbodyArray // coz event for tbody
                    });
                }
            );

            this.$thead.on(
                'click._addCol',
                '.addCol',
                this,
                this.addCol
            );

            this.$tfoot.on(
                'click._addCol',
                '.addCol',
                this,
                this.addCol
            );

            this.$thead.on(
                'click._delCol',
                '.delCol',
                this,
                this.delCol
            );

            this.$tfoot.on(
                'click._delCol',
                '.delCol',
                this,
                this.delCol
            );

            this.$thead.on(
                'dblclick._editCell',
                'td[data-real-index],th[data-real-index]',
                this,
                this.editingStart
            );

            this.$tbody.on(
                'dblclick._editCell',
                'td[data-real-index],th[data-real-index]',
                this,
                this.editingStart
            );

            this.$tfoot.on(
                'dblclick._editCell',
                'td[data-real-index],th[data-real-index]',
                this,
                this.editingStart
            );

            $('body').on(
                'click._editCell',
                this,
                function(e) {
                    if( e.data.cache && e.data.cache.isEditCell && ! $(e.target).closest('.edit-cell').length ) {
                        var group;
                        switch( e.data.cache.editableCell.parent().parent()[0].nodeName ) {
                            case 'THEAD':
                                group = 'dataTheadArray';
                                    break;
                            case 'TBODY':
                                group = 'dataTbodyArray';
                                    break;
                            case 'TFOOT':
                                group = 'dataTfootArray';
                                    break;
                        }
                        e.data.cache.isEditCell = false;
                        e.data.$table.trigger('cell:editing:stop', {
                            $that: e.data,
                            target: e.data.cache.editableCell,
                            group: group
                        });
                    }
                }
            );

            this.$table.on(
                'cell:editing:start',
                this.cellEditingStart
            );

            this.$table.on(
                'cell:editing:stop',
                this.cellEditingStop
            );

        },
        
        editingStart: function(e) {
            var $this = $(this);
            var $that = e.data;
            var group;
            if( $that.cache && $that.cache.editableCell && $that.cache.isEditCell && $that.cache.editableCell.is( $this ) ) return;
            if(! $that.cache ) $that.cache = {};
            $that.cache.editableCell = $this;
            $that.cache.isEditCell = true;
            switch( e.delegateTarget.nodeName ) {
                case 'THEAD':
                    group = 'dataTheadArray';
                        break;
                case 'TBODY':
                    group = 'dataTbodyArray';
                        break;
                case 'TFOOT':
                    group = 'dataTfootArray';
                        break;
            }
            $that.$table.trigger('cell:editing:start', {
                '$that': $that,
                'target': $this,
                'group': group
            });
        },

        addCol: function(e) {
            var thisColIndex = $(this).closest('td').index();
            e.data.addNewCols({scene:thisColIndex});
        },

        delCol: function(e) {
            var thisColIndex = $(this).closest('td').index();
            e.data.deleteSomeCols({scene:thisColIndex});
        },

        cellEditingStart: function( event, object ) {
            var rowIndex = +object.target.closest('tr').index();
            if( object.target.closest('tr').parent().is('thead') ) {
                rowIndex -= object.target.closest('tr').parent().find('tr[data-controls]').length;
            }
            var $that = object.$that,
                params = {
                    event: event,
                    $target: object.target,
                    group: $that[ object.group ],
                    targetOffset: object.target.offset(),
                    $targetContent: $('<textarea/>', {text: object.target.html()}),
                    $targetCss: {
                        'height': function() {
                            return object.target.height();
                        }
                    },
                    $menuContainer: $('body'),
                    $menuContent: $('' +
                        '<div class="edit-cell edit-cell-content" data-group="'+ object.group +'" data-row="'+ rowIndex +'" data-col="'+ object.target.attr('data-real-index') +'" data-uniq="'+ $that.uniqueID +'">' +
                            // '<button type="button" class="btn btn-default btn-xs edit-cell" data-toggle="modal" data-target="#TableEdidModal"><span class="glyphicon glyphicon-pencil"></span></button>' +
                        '</div>' +
                    ''),
                    $menuCss: {
                        'top': function() {
                            return params.targetOffset.top - 1;
                        },
                        'left': function() {
                            if( $that.controlOrientation == 'right' )
                                return (params.targetOffset.left + object.target.outerWidth(true) + 1);
                            return (params.targetOffset.left - $(this).outerWidth(true) - 1);
                        },
                        'min-height': object.target.outerHeight(true) + 2,
                    }
                };
            $that.doMethod('_cellEditingStart', params);
        },

        _cellEditingStart: function( params ) {
            params.$target.html( params.$targetContent.css( params.$targetCss ) )
            .addClass('edit-cell')
            .find( params.$targetContent ).focus(function(){
                var $thisVal = $(this).val();
                $(this).val('').val($thisVal);
            }).focus();
            params.$menuContainer.append( params.$menuContent.css( params.$menuCss ) );
        },

        cellEditingStop: function( event, object ) {
            var $that = object.$that,
                params = {
                    event: event,
                    $target: object.target,
                    group: $that[object.group],
                    formElement: 'textarea'
                };
            params.newValue = object.target.find( params.formElement ).val();
            $that.doMethod('_cellEditingStop', params);
        },

        _cellEditingStop: function( params ) {
            var rowIndex = +params.$target.closest('tr').index();
            if( params.$target.closest('tr').parent().is('thead') ) {
                rowIndex -= params.$target.closest('tr').parent().find('tr[data-controls]').length;
            }
            this.saveBackCell( rowIndex, +params.$target.attr('data-real-index'), 'value', params.newValue, params.group );
            params.$target.html( params.newValue ).removeClass('edit-cell');
            $('body').find( '.edit-cell-content' ).remove();
        },

    };

    $.TableEdid.init = function() {
        this.doMethod('_eventsBind');
    };

});
