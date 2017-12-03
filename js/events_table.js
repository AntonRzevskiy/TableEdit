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
                        e.data._addNewRows({scene:thisRowIndex});
                    }
                );

                this.$tbody.on(
                    'click._delRow',
                    '.delrow',
                    this,
                    function(e) {
                        var thisRowIndex = $(this).closest('tr').index();
                        e.data._deleteSomeRows({scene:thisRowIndex});
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

                this.$tbody.on(
                    'dblclick._editCell',
                    'td[data-real-index],th[data-real-index]',
                    this,
                    function(e) {
                        var $this = $(this);
                        var $that = e.data;
                        if( $that.cache && $that.cache.editableCell && $that.cache.isEditCell && $that.cache.editableCell.is( $this ) ) return;
                        if(! $that.cache ) $that.cache = {};
                        $that.cache.editableCell = $this;
                        $that.cache.isEditCell = true;
                        $that.$tbody.trigger('cell:editing:start', {
                            $that: $that,
                            target: $this
                        });
                    }
                );

                $('body').on(
                    'click._editCell',
                    this,
                    function(e) {
                        if( e.data.cache && e.data.cache.isEditCell && ! $(e.target).closest('.edit-cell').length ) {
                            e.data.cache.isEditCell = false;
                            e.data.$tbody.trigger('cell:editing:stop', {
                                $that: e.data,
                                target: e.data.cache.editableCell
                            });
                        }
                    }
                );

                this.$tbody.on(
                    'cell:editing:start',
                    this._cellEditingStart
                );

                this.$tbody.on(
                    'cell:editing:stop',
                    this._cellEditingStop
                );

            }
            if (this[name + 'After'] && typeof this[name + 'After'] == 'function')
                this[name + 'After']();
            this.doAction( name + 'After' );
        },

        _addCol: function(e) {
            var thisColIndex = $(this).closest('td').index();
            e.data._addNewCols({scene:thisColIndex});
        },

        _delCol: function(e) {
            var thisColIndex = $(this).closest('td').index();
            e.data._deleteSomeCols({scene:thisColIndex});
        },

        _cellEditingStart: function( event, object ) {
            var name = 'cellEditingStart',
                $that = object.$that,
                params = {
                    event: event,
                    $target: object.target,
                    targetOffset: object.target.offset(),
                    $targetContent: $('<textarea/>', {text: object.target.html()}),
                    $targetCss: {
                        'height': function() {
                            return object.target.height();
                        }
                    },
                    $menuContainer: $('body'),
                    $menuContent: $('' +
                        '<div class="edit-cell edit-cell-content" data-row="'+ object.target.closest('tr').index() +'" data-col="'+ object.target.attr('data-real-index') +'">' +
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
            $that.doAction( name + 'Before', params );
            if($that[name + 'Before'] && typeof $that[name + 'Before'] == 'function' && $that[name + 'Before'](params) == true || !$that[name + 'Before']) {
                params.$target.html( params.$targetContent.css( params.$targetCss ) )
                .addClass('edit-cell')
                .find( params.$targetContent ).focus(function(){
                    var $thisVal = $(this).val();
                    $(this).val('').val($thisVal);
                }).focus();
                params.$menuContainer.append( params.$menuContent.css( params.$menuCss ) );
            }
            if($that[name + 'After'] && typeof $that[name + 'After'] == 'function')
                $that[name + 'After'](params);
            $that.doAction( name + 'After', params );
        },

        _cellEditingStop: function( event, object ) {
            var name = 'cellEditingStop',
                $that = object.$that,
                params = {
                    event: event,
                    $target: object.target,
                    formElement: 'textarea'
                };
            params.newValue = object.target.find( params.formElement ).val();
            $that.doAction( name + 'Before', params );
            if($that[name + 'Before'] && typeof $that[name + 'Before'] == 'function' && $that[name + 'Before'](params) == true || !$that[name + 'Before']) {
                $that._saveBackCell( +params.$target.closest('tr').index(), +params.$target.attr('data-real-index'), 'value', params.newValue );
                params.$target.html( params.newValue ).removeClass('edit-cell');
                $('body').find( '.edit-cell-content' ).remove();
            }
            if($that[name + 'After'] && typeof $that[name + 'After'] == 'function')
                $that[name + 'After'](params);
            $that.doAction( name + 'After', params );
        },

    };

    $.TableEdid.init = '_eventsBind';

});
