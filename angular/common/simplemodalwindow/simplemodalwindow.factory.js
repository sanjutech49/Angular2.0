
/**
* @desc Factory for handling simple modal popup window that need to be used often across screens
        for complex modal window this factory can be used but the controller need's to be exapned
*/

(function () {

    'use strict';

    /**
    * SET: template URL REQUIRED, size OPTIONAL & windowClass OPTIONAL 
    * Fc: Modal window by default always apears in center of screen, close via cancel button & ESC key, navigation bar stays active, responsive
    */

    angular.module('simpleModalWindow').factory('simpleModalWindowFactory', ['$modal', '$modalStack', 'TEMPLATES_LOCATIONS', function ($modal, $modalStack, TEMPLATES_LOCATIONS) {
        return {
            trigger: function (template, customWindowClass, size) {

                // take tamplate from config if exist, else take template from user
                var templateLocation = TEMPLATES_LOCATIONS.hasOwnProperty(template) ? TEMPLATES_LOCATIONS[template] : template;

                $modal.open({
                    templateUrl: templateLocation,
                    windowClass: customWindowClass || 'imp-center-modal',
                    backdrop: 'static',
                    controller: 'SimpleModalWindowController',
                    size: size || ''
                });
            },
            close: function (reason) {
                // close all modalInstances
                $modalStack.dismissAll(reason);
            }
        };
    }]);

})();