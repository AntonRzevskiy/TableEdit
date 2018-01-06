jQuery(document).ready(function($){

    if( !$.TableEdid ) return;

    $.TableEdid.callbacks.refresh();

    $.TableEdid.callbacks = {

        eventsBindAfter: function() {

            $('#TableEdidModal').on(
                'show.bs.modal', 
                this, 
                function(e) {
                    var $that = e.data,
                        $form = $(this).find('form'),
                        $buttonActi = $(e.relatedTarget),
                        group = $buttonActi.closest('.edit-cell-content').attr('data-group'),
                        row = +$buttonActi.closest('.edit-cell-content').attr('data-row'),
                        col = +$buttonActi.closest('.edit-cell-content').attr('data-col'),
                        uniqueID = +$buttonActi.closest('.edit-cell-content').attr('data-uniq');

                    if( uniqueID !== $that.uniqueID ) return;

                    $form.find('#markers').attr('data-group', group).attr('data-row', row).attr('data-col', col).attr('data-uniq', uniqueID);

                    $form.find('#value').val( $that[ group ][ row ][ col ].value );

                    var colspan = $that[ group ][ row ][ col ].settings && $that[ group ][ row ][ col ].settings.colspan && $that[ group ][ row ][ col ].settings.colspan || 1;
                    var rowspan = $that[ group ][ row ][ col ].settings && $that[ group ][ row ][ col ].settings.rowspan && $that[ group ][ row ][ col ].settings.rowspan || 1;
                    $form.find('#colspan').val( colspan ).attr('max', $that._numberOfColumns);
                    $form.find('#rowspan').val( rowspan ).attr('max', $that[ group ].length);
                }
            );

            $('.save-cell-changes').on(
                'click',
                this, 
                function(e) {
                    var $that = e.data,
                        $form = $(this).closest('.modal-content').find('.modal-body form'),
                        group = $form.find('#markers').attr('data-group'),
                        row = $form.find('#markers').attr('data-row'),
                        col = $form.find('#markers').attr('data-col'),
                        uniqueID = +$form.find('#markers').attr('data-uniq'),
                        colspan = $form.find('#colspan').val(),
                        rowspan = $form.find('#rowspan').val(),
                        value = $form.find('#value').val();

                    if( uniqueID !== $that.uniqueID ) return;

                    $that.change( group, row, col, {
                        settings: {
                            colspan: colspan,
                            rowspan: rowspan
                        },
                        value: value
                    });

                    $('#TableEdidModal').modal('hide');
                }
            );

            return true;
        },

        addTableAfter: function() {

            if( ! $('body').find('#TableEdidModal').length ) {
                this.$table.after(''+
                    '<div class="modal fade" id="TableEdidModal" tabindex="-1" role="dialog" aria-labelledby="TableEdidModalLabel" aria-hidden="true">' +
                      '<div class="modal-dialog">' +
                        '<div class="modal-content">' +
                          '<div class="modal-header">' +
                            '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>' +
                            '<h4 class="modal-title" id="TableEdidModalLabel">Cell settings</h4>' +
                          '</div>' +
                          '<div class="modal-body">' +
                            '<form role="form">' +
                                '<input type="hidden" id="markers">' +
                                '<div class="form-group">' +
                                    '<label for="value">Value</label>' +
                                    '<textarea class="form-control" rows="3" id="value"></textarea>' +
                                '</div>' +
                                '<div class="row">' +
                                 '<div class="col-md-6">' +
                                  '<div class="form-group">' +
                                    '<label for="colspan">Cell width</label>' +
                                    '<input type="number" class="form-control" id="colspan" min="1">' +
                                  '</div>' +
                                 '</div>' +
                                 '<div class="col-md-6">' +
                                  '<div class="form-group">' +
                                    '<label for="rowspan">Cell height</label>' +
                                    '<input type="number" class="form-control" id="rowspan" min="1">' +
                                  '</div>' +
                                 '</div>' +
                                '</div>' +
                            '</form>' +
                          '</div>' +
                          '<div class="modal-footer">' +
                            '<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>' +
                            '<button type="button" class="btn btn-primary save-cell-changes">Save</button>' +
                          '</div>' +
                        '</div>' +
                      '</div>' +
                    '</div>' +
                '');
            }

            return true;
        },

        cellEditingStartBefore: function(params) {
            params.$menuContent.append('<button type="button" class="btn btn-default btn-xs edit-cell" data-toggle="modal" data-target="#TableEdidModal"><span class="glyphicon glyphicon-pencil"></span></button>');
            return true;
        },

    };

});
