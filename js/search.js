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
 * @since      0.0.1
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
         * @var      Node    searchElement HTML Node.
         */
        'searchElement': function(){
            return document.createElement('input');
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

        'setVocabulary': function() {},

        'getVocabulary': function() {},

        'createVocabulary': function() {},

        'updateVocabulary': function() {},

        'iSearch': function() {},

    };

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

            if( this.search === true ) this.doMethod('_addSearchElement');

        },

    };

});
