/**
 * Plugin for creating an editable table from an array, textarea, table and not only.
 * You can easily add and delete rows, cells.
 * The plugin contains enough options and callback functions for quick customization for your task.
 *
 * @author     Rzhevskiy Anton <antonrzhevskiy@gmail.com>
 * @license:   GPLv3 - https://www.gnu.org/licenses/gpl-3.0.txt
 */

/**
 * Functions providing search and filtering of table rows.
 *
 * @link       https://github.com/AntonRzevskiy/TableEdit/blob/master/js/search.js
 * @since      0.0.2
 *
 * @package    TableEdit
 * @subpackage TableEdit/js
 */
jQuery(document).ready(function($){

    if( !$.TableEdit ) return;

    $.TableEdit.localPlugin = {

        /**
         * Search by the table.
         *
         * @since    0.0.2
         *
         * @var      bool    search    Search by the table. Default false.
         */
        'search': false,

        /**
         * Search initial length.
         *
         * @since    0.0.2
         *
         * @var      int     searchInitLength    The initial length of the search string. Default 3 symbols.
         */
        'searchInitLength': 3,

        /**
         * Word stock for the section tbody.
         *
         * @since    0.0.2
         *
         * @var      array   vocabulary Vocabulary rows.
         */
        'vocabulary': function(){
            return [];
        },

        /**
         * DOM element for search.
         *
         * @since    0.0.2
         *
         * @var      Node    searchElement HTML Node. Default @input.
         */
        'searchElement': function(){
            return document.createElement('input');
        },

        /**
         * The relationship between the rows of the visual table and the data.
         *
         * @since    0.0.2
         *
         * @var      array   taxonomy    The relationship between front-table & data-table.
         *                               Front-index => data-index.
         */
        'taxonomy': function(){
            return [];
        },

    };

    $.TableEdit.plugin = {

        /**
         * Display search element.
         *
         * @since    0.0.2
         *
         * @global   object   this      $.TableEdit.plugin — object context.
         */
        '_addSearchElement': function() {
            $( this.table ).before( this.searchElement );
        },

        /**
         * Set search string in vocabulary cell.
         *
         * @since    0.0.2
         *
         * @param    object   params    {
         *
         *   @type   int      rowIndex  Index of row in data.
         *   @type   int      colIndex  Index of col in data.
         *
         * }
         */
        '_setVocabulary': function( params ) {

            var parent = this.getParent( this.getGroup('B'), params.rowIndex, params.colIndex );

            this.vocabulary[ params.rowIndex ][ params.colIndex ] = parent.cell.val;

        },

        /**
         * Get Vocabulary.
         *
         * @since    0.0.2
         *
         * @see      this::_createVocabulary
         *
         * @return   array    Vocabulary array of tbody section.
         */
        '_getVocabulary': function() {

            return this.vocabulary.length ? this.vocabulary :
                   this.doMethod('_createVocabulary');

        },

        /**
         * Create Vocabulary.
         *
         * @since    0.0.2
         *
         * @see      this::_setVocabulary
         *
         * @return   array    Vocabulary array of tbody section.
         */
        '_createVocabulary': function() {

            var dataBody = this.getGroup('B'),
                length = dataBody.length,
                row, col;

            this.vocabulary = new Array( length );

            for( row = 0; row < length; row++ ) {

                this.vocabulary[ row ] = new Array( dataBody[row].length );

                for( col = 0; col < dataBody[row].length; col++ ) {

                    this.doMethod('_setVocabulary', {

                        'rowIndex': row,
                        'colIndex': col,

                    });

                }

            }

            return this.vocabulary;
        },

        /**
         * Flush Vocabulary.
         *
         * @since    0.0.2
         */
        '_flushVocabulary': function() {

            this.vocabulary = [];

        },

        /**
         * Flush Taxonomy.
         *
         * @since    0.0.2
         */
        '_flushTaxonomy': function() {

            this.taxonomy = [];

        },

        /**
         * Join dictionary cells to strings for searching.
         *
         * @since    0.0.2
         *
         * @see      this::_getVocabulary
         *
         * @global   object   this      $.TableEdit.plugin — object context.
         *
         * @param    object   params    {
         *
         *   @type   object   cols      Object with the column numbers to merge. Default all.
         *   @type   string   separator Delimiter when merging. Default space.
         *
         * }
         *
         * @return   array    Array of strings suitable for searching.
         */
        '_joinVocabulary': function( params ) {

            if( ! params.result ) params.result = [];

            var vocabulary = this.doMethod('_getVocabulary'),
                length = vocabulary.length,
                row = 0;

            for( ; row < length; row++ ) {

                params.result.push(

                    vocabulary[ row ].filter( function( element, index ) {

                        if( ! params.cols ) return true;

                        if( params.cols[ index ] ) return true;

                        return false;

                    } ).join( params.separator || ' ' )

                );

            }

            return params.result;
        },

        /**
         * Create search page.
         *
         * @since    0.0.2
         *
         * @see      this::_prepareSearchingValue
         * @see      this::_createPage
         * @see      this::_iSearch
         * @see      this::_createEmptySearchPage
         *
         * @global   object   this      $.TableEdit.plugin — object context.
         *
         * @param    string   value     Search query.
         * @param    mixed    cols      Columns that are involved in the search. Default undefined (All).
         */
        'iSearch': function( value, cols ) {

            var row, length, tx;

            if( this.searchInitLength > value.length ) {

                if( ! this.getProp( this, 'cache.isSearchedPage' ) ) return;

                this.setProp( this, 'cache.isSearchedPage', false );

                this.doMethod('_flushTaxonomy');

                $( this.tbody ).empty();

                return this.doMethod('_createPage', {});
            }

            console.time( 'iSearch' );

            this.doMethod('_iSearch', {

                'value': value,
                'cols': cols || {},
                'regexp': new RegExp( this.doMethod('_prepareSearchingValue', {'value': value}), 'im' ),
                'reset': true

            });

            this.setProp( this, 'cache.isSearchedPage', true );

            $( this.tbody ).empty();

            if( this.taxonomy.length ) {

                for( row = 0, length = this.taxonomy.length; row < length; row++ ) {
                    tx = this.taxonomy[ row ];
                    this.tbody.appendChild( this.doMethod('_createRow', {
                        'tr': this.createEL('tr'),
                        'index': tx,
                        'row': this.getGroup('B')[tx],
                        'group': this.getGroup('B')
                    }) );
                }

            }

            else {
                // if the search fails
                this.doMethod('_createEmptySearchPage', params);
            }

            console.timeEnd( 'iSearch' );

            console.log( value );
            console.log( this.taxonomy );
            console.log( this.doMethod('_generateAvailableValues', {column: 5}) );

        },

        /**
         * Search rows.
         *
         * @since    0.0.2
         *
         * @see      this::_joinVocabulary
         * @see      this::_createRow
         * @see      this::_createEmptySearchPage
         *
         * @global   object   this      $.TableEdit.plugin — object context.
         *
         * @param    object   params    {
         *
         *   @type   object   regexp    Regular expression for search.
         *   @type   object   cols      Columns that are involved in the search. Default undefined (All).
         *   @type   bool     reset     Reset previous search result. Default TRUE.
         *
         * }
         */
        '_iSearch': function( params ) {

            var rows = this.doMethod('_joinVocabulary', {'cols': params.cols} ),
                row, length;

            if( params.reset ) this.doMethod('_flushTaxonomy');

            for( row = 0, length = rows.length; row < length; row++ ) {

                if( params.regexp.test( rows[ row ] ) ) {

                    this.taxonomy.push( row );

                }

            }

        },

        /**
         * Find original row in taxonomy.
         *
         * @since    0.0.2
         *
         * @global   object   this      $.TableEdit.plugin — object context.
         *
         * @param    object   params    {
         *
         *   @type   int      index     Finding index of data.
         *   @type   int      start     Start position of find. Default undefined.
         *
         * }
         *
         * @return   bool     TRUE if index in taxonomy. FALSE if not.
         */
        '_inTaxonomy': function( params ) {

            params.result = this.taxonomy.indexOf( +params.index, params.start || 0 );

            return !!( params.result >= 0 );
        },

        /**
         * Prepare value to search.
         *
         * @since    0.0.2
         *
         * @param    object   params    {
         *
         *   @type   string   value     Search query.
         *
         * }
         *
         * @return   string   Valid string for RegExp class.
         */
        '_prepareSearchingValue': function( params ) {

            params.matcher = params.matcher || function( match ) {

                return '\\' + match;

            };

            params.regexp = params.regexp || /\^|\(|\)|\[|\]|\{|\}|\.|\$|\*|\+|\?|\\/gmi;

            return params.filtered = params.value.replace( params.regexp, params.matcher );
        },

        /**
         * Unmerge cell (rowspan) & copy each.
         *
         * @since    0.0.2
         *
         * @see      this::saveBackCell
         *
         * @param    object   params    {
         *
         *   @type   string   group     Name of data section.
         *   @type   int      rowIndex  Index of row in data.
         *   @type   int      colIndex  Index of col in data.
         *
         * }
         */
        '_unmergeCellVerticalCopy': function( params ) {

            var ind, length;

            if( ! params.parent ) params.parent = this.getParent( this.getGroup( params.group ), params.rowIndex, params.colIndex );
            if( ! params.copies ) {

                params.copies = [];

                ind = params.parent.rowIndex + 1; // next row!
                length = ind + ( this.getProp( params.parent.cell, 'attr.rowspan' ) || 1 ) - 1;

                for( ; ind < length; ind++ ) {

                    params.copies.push({
                        'rowIndex': ind,
                        'colIndex': params.parent.colIndex,
                        'group': params.group
                    });
                }
            }

            this.saveBackCell( params.parent.rowIndex, params.parent.colIndex, 'attr.rowspan', 1, params.group );

            for( ind = 0; ind < params.copies.length; ind++ ) {

                this.getGroup( params.group )[ params.copies[ ind ].rowIndex ][ params.copies[ ind ].colIndex ] = this.newCell( params.parent.cell, {'copy': true} );

                length = params.copies[ ind ].colIndex; // use length as colIndex

                while( this.getGroup( params.group )[ params.copies[ ind ].rowIndex ][ ++length ] &&
                       this.getGroup( params.group )[ params.copies[ ind ].rowIndex ][ length ].mx === 4
                ) {

                    this.saveBackCell( params.copies[ ind ].rowIndex, length, 'mx', 2, params.group );
                }
            }

        },

        '_generateAvailableValues': function( params ) {

            params.join = {'cols': {}};
            params.join.cols[ params.column ] = true;

            var col = this.doMethod('_joinVocabulary', params.join );

            var result = {};

            for( var i = 0; i < col.length; i++ ) {

                result[ col[i] ] = 1;

            }

            return ( params.result || Object.keys( result ) );
        },

    };

    if( $.TableEdit.plugin.hasOwnProperty( '_skippedCell' ) === false ) {

        /**
         * Add empty method for skipped cells.
         *
         * @since    0.0.2
         *
         * @see      this::_createRow
         */
        $.TableEdit.plugin._skippedCell = function() {};

    }

    $.TableEdit.callbacks.refresh();

    $.TableEdit.callbacks = {

        /**
         * Display search element if @search enabled.
         *
         * @since    0.0.2
         *
         * @see      this::_addTable::callbacks
         * @see      this::_addSearchElement
         *
         * @global   object   this      $.TableEdit.plugin — object context.
         */
        'addTableAfter': function() {

            if( this.search === false ) return true; // exit

            this.doMethod('_addSearchElement');

            return true;
        },

        /**
         * Bind events if @search enabled.
         *
         * @since    0.0.2
         *
         * @see      this::_eventsBind::callbacks
         *
         * @global   object   this      $.TableEdit.plugin — object context.
         */
        'eventsBindAfter': function() {

            if( this.search === false ) return true; // exit

            $(this.searchElement).on(
                'input.iSearch keyup.iSearch change.iSearch',
                this,
                function(e) {

                    // Leave only one event.
                    if( e.type === 'input' ) $(this).off('keyup.iSearch').off('change.iSearch');
                    if( e.type === 'keyup' ) $(this).off('input.iSearch').off('change.iSearch');
                    if( e.type === 'change' ) $(this).off('keyup.iSearch').off('input.iSearch');

                    return e.data.iSearch( $(this).val() );
                }
            );

            return true;
        },

        /**
         * Set rowspan = 1 if @isSearchedPage.
         *
         * @since    0.0.2
         *
         * @see      this::_createCell::callbacks
         *
         * @global   object   this      $.TableEdit.plugin — object context.
         */
        'createCellAfter': function( params ) {

            if( ! this.getProp( this, 'cache.isSearchedPage' ) || params.td.nodeName.toLowerCase() !== 'td' ) return true;

            if( this.getProp( params.col, 'mx' ) === 1 && this.getProp( params.col, 'attr.rowspan' ) > 1 ) {

                this.attr( params.td, 'rowspan', 1 );

            }

            return true;
        },

        /**
         * Get parent cell & set rowspan = 1 & append if @isSearchedPage.
         *
         * @since    0.0.2
         *
         * @see      this::_skippedCell::callbacks
         *
         * @global   object   this      $.TableEdit.plugin — object context.
         */
        'skippedCellAfter': function( params ) {

            if( ! this.getProp( this, 'cache.isSearchedPage' ) || params.row[ params.col ].mx !== 3 ) return true;

            var parent = $.extend( true, {}, this.getParent( params.group, params.index, params.col ) );

            this.setProp( parent.cell, 'attr.rowspan', 1 );

            params.tr.appendChild( this.createCell(
                params.tr,      // HTML Element
                params.row,     // Array
                parent.cell,    // insted of current
                params.index,   // Number Index of row
                params.col,     // Number Index of col
                params.group,   // Array
                params.td       // String optional
            ) );

            return true;
        },

        /**
         * Normalize params for get cell object.
         *
         * @since    0.0.2
         *
         * @see      this::_getDataCell::callbacks
         *
         * @global   object   this      $.TableEdit.plugin — object context.
         */
        'getDataCellBefore': function( params ) {

            if( ! this.getProp( this, 'cache.isSearchedPage' ) ) return true;

            if( this.provideGroup( params.group ) === 'tbody' ) {

                params.rowIndex = this.taxonomy[ params.rowIndex ];

            }

            return true;
        },

        /**
         * Normalize params for inline edit & flush vocabulary.
         *
         * @since    0.0.2
         *
         * @see      this::_cellEditingStop::callbacks
         *
         * @global   object   this      $.TableEdit.plugin — object context.
         */
        'cellEditingStopBefore': function( params ) {

            if( ! this.getProp( this, 'cache.isSearchedPage' ) ) return true;

            if( this.provideGroup( params.group ) === 'tbody' ) {

                params.rowIndex = this.taxonomy[ params.rowIndex ];

                this.doMethod('_flushVocabulary');
            }

            return true;
        },

        /**
         * Normalize params for get row.
         *
         * @since    0.0.2
         *
         * @see      this::_getFrontRow::callbacks
         *
         * @global   object   this      $.TableEdit.plugin — object context.
         */
        'getFrontRowBefore': function( params ) {

            if( ! this.getProp( this, 'cache.isSearchedPage' ) ) return true;

            if( this.provideGroup( params.group ) === 'tbody' && this.doMethod('_inTaxonomy', {index: params.rowIndex}) ) {

                params.rowIndex = this.taxonomy.indexOf( params.rowIndex );

            }

            return true;
        },

        /**
         * Normalize params for global edit & flush vocabulary.
         *
         * @since    0.0.2
         *
         * @see      this::_change::callbacks
         *
         * @global   object   this      $.TableEdit.plugin — object context.
         */
        'changeBefore': function( params ) {

            if( ! this.getProp( this, 'cache.isSearchedPage' ) ) return true;

            if( this.provideGroup( params.group ) === 'tbody' ) {

                params.rowIndex = this.taxonomy[ params.rowIndex ];
                params.cell = this.getGroup( params.group )[ params.rowIndex ][ params.colIndex ];

                this.doMethod('_flushVocabulary');
            }

            return true;
        },

        /**
         * Deny action.
         *
         * @since    0.0.2
         *
         * @see      this::_addNewRow::callbacks
         *
         * @global   object   this      $.TableEdit.plugin — object context.
         */
        'addNewRowBefore': function( params ) {

            if( ! this.getProp( this, 'cache.isSearchedPage' ) ) return true;

            if( this.provideGroup( params.group ) === 'tbody' ) {

                params.condition = false;
            }

            return true;
        },

        /**
         * Deny action.
         *
         * @since    0.0.2
         *
         * @see      this::_deleteRow::callbacks
         *
         * @global   object   this      $.TableEdit.plugin — object context.
         */
        'deleteRowBefore': function( params ) {

            if( ! this.getProp( this, 'cache.isSearchedPage' ) ) return true;

            if( this.provideGroup( params.group ) === 'tbody' ) {

                params.condition = false;
            }

            return true;
        },

        /**
         * Deny action.
         *
         * @since    0.0.2
         *
         * @see      this::_addNewColumn::callbacks
         *
         * @global   object   this      $.TableEdit.plugin — object context.
         */
        'addNewColumnBefore': function( params ) {

            if( ! this.getProp( this, 'cache.isSearchedPage' ) ) return true;

            params.condition = false;

            return true;
        },

        /**
         * Deny action.
         *
         * @since    0.0.2
         *
         * @see      this::_deleteColumn::callbacks
         *
         * @global   object   this      $.TableEdit.plugin — object context.
         */
        'deleteColumnBefore': function( params ) {

            if( ! this.getProp( this, 'cache.isSearchedPage' ) ) return true;

            params.condition = false;

            return true;
        },

    };

    $.TableEdit.callbacks = {

        /**
         * Unmerge cell & copy.
         *
         * @since    0.0.2
         *
         * @see      this::_cellEditingStop::callbacks
         * @see      this::_unmergeCellVerticalCopy
         *
         * @global   object   this      $.TableEdit.plugin — object context.
         */
        'cellEditingStopBefore': function( params ) {

            if( ! this.getProp( this, 'cache.isSearchedPage' ) ) return true;

            var parentCell = this.getParent( this.getGroup( params.group ), params.rowIndex, params.colIndex ).cell;

            if( this.provideGroup( params.group ) === 'tbody' &&
                this.getProp( parentCell, 'attr.rowspan' ) > 1 &&
                this.getProp( parentCell, 'val' ) !== params.newValue
            ) {

                this.doMethod('_unmergeCellVerticalCopy', {
                    'group': params.group,
                    'rowIndex': params.rowIndex,
                    'colIndex': params.colIndex,
                });
            }

            return true;
        },

        /**
         * Unmerge cell & copy.
         *
         * @since    0.0.2
         *
         * @see      this::_change::callbacks
         * @see      this::_unmergeCellVerticalCopy
         *
         * @global   object   this      $.TableEdit.plugin — object context.
         */
        'changeBefore': function( params ) {

            if( ! this.getProp( this, 'cache.isSearchedPage' ) ) return true;

            var parentCell = this.getParent( this.getGroup( params.group ), params.rowIndex, params.colIndex ).cell;

            if( this.provideGroup( params.group ) === 'tbody' &&
                this.getProp( parentCell, 'attr.rowspan' ) > 1
            ) {

                this.doMethod('_unmergeCellVerticalCopy', {
                    'group': params.group,
                    'rowIndex': params.rowIndex,
                    'colIndex': params.colIndex,
                });
            }

            return true;
        },

    };

});
