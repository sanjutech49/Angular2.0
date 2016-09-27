(function () {
    'use strict';
    angular.module('common').factory('errorModalWindowFactory', ['$modal', '$modalStack', function ($modal, $modalStack) {
        return {
            open: function (message) {
                $modal.open({
                    templateUrl: 'angular/common/errormodalwindow/errormodalwindow.html',
                    backdrop: 'static',
                    windowClass: 'custom-modal-error',
                    dialogFade: false,
                    keyboard: false,
                    controller: 'modalInstanceController as modalInstanceCtrl',
                    resolve: {
                        message: function () {
                            return message;
                        }
                    }
                });
                //want to change style of element with class modal-backdrop
                angular.element(document.getElementsByClassName('modal-backdrop')).addClass('custom-modal-backdrop');
            },
            close: function (reason) {
                angular.element(document.getElementsByClassName('modal-backdrop')).removeClass('custom-modal-backdrop');
                $modalStack.dismissAll('close');
            }
        };
    }]);

})();