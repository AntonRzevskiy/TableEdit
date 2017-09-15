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
    
};