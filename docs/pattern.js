$.TableEdid.defaults = {

    // functional framework 1
    _method: function() {
        if (typeof this.methodBefore == 'function' && this.methodBefore() == true) {

            // logic here

        } 
        if (typeof this.methodAfter == 'function')
            this.methodAfter();
    },
    methodBefore: function() {
        return true;
    },
    methodAfter: function() {
    },

    // functional framework 2
    _method: function() {
        if (
            this.hasOwnProperty('methodBefore') 
            && typeof this.methodBefore == 'function' 
            && this.methodBefore() == true
            ||
            ! this.hasOwnProperty('methodBefore')
        ) {

            // logic here

        } 
        if (this.hasOwnProperty('methodAfter') && typeof this.methodAfter == 'function')
            this.methodAfter();
    },

    // functional framework 2 modified
    _method: function() {
        var name = 'method';
        if (
            this.hasOwnProperty(name + 'Before') 
            && typeof this[name + 'Before'] == 'function' 
            && this[name + 'Before']() == true
            ||
            ! this.hasOwnProperty(name + 'Before')
        ) {

            // logic here

        } 
        if (this.hasOwnProperty(name + 'After') && typeof this[name + 'After'] == 'function')
            this[name + 'After']();
    },

    // functional framework 3
    _method: function() {
        var name = 'method';
        this.doAction( name + 'Before', arguments, context );
        if (
            this.hasOwnProperty(name + 'Before') 
            && typeof this[name + 'Before'] == 'function' 
            && this[name + 'Before']() == true
            ||
            ! this.hasOwnProperty(name + 'Before')
        ) {

            // logic here

        } 
        if (this.hasOwnProperty(name + 'After') && typeof this[name + 'After'] == 'function')
            this[name + 'After']();
        this.doAction( name + 'After', arguments, context );
    },

};