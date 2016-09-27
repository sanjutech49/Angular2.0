
/**
* @desc Controller for handling modal window
*/

(function () {
    'use strict';
	angular.module('simpleModalWindow').controller('SimpleModalWindowController', ['$modalStack', function ( $modalStack ) {

        var modal = this;

        // for specific button actions, controller needs to be expanded

        // close handling ( close, no, ok ... )
        modal.close = function () {
            $modalStack.dismissAll('cancel');
        };

        // goTo navigation template
		modal.goTo = function ( URL ) {
		    // after stateprovider is implemented: $state.go( URL );
		    window.location( URL );
		    $modalStack.dismissAll('cancel');
		};

    }]);

})();
