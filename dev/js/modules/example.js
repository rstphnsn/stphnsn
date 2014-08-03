var akqa = akqa || {};
akqa.base = akqa.base || {};

akqa.base.example = (function () {
    'use strict';

    var init, myPrivateVar, myPrivateMethod;

    myPrivateVar = 0;

    myPrivateMethod = function(foo) {
        console.log(foo);
    };

    init = (function () {
        //Self running function
        myPrivateMethod('Example module is running');
    }());

    return {
        // A public variable
        myPublicVar: 'foo',
        // A public function utilizing privates
        myPublicFunction: function(bar) {
            // Increment our private counter
            myPrivateVar = myPrivateVar + bar;
            // Call our private method using bar
            myPrivateMethod(bar);
        }
    };
})();

