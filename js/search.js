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
         * Word stock for the section tbody.
         *
         * @since    0.0.2
         *
         * @var      array   vocabulary Vocabulary rows.
         */
        'vocabulary': function(){
            return [];
        },

    };

    $.TableEdit.plugin = {

        'setVocabulary': function() {},

        'getVocabulary': function() {},

        'createVocabulary': function() {},

        'updateVocabulary': function() {},

        'iSearch': function() {},

    };

});
