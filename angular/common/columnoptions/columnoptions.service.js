(function () {
    'use strict';
    angular.module('common').factory('columnOptionsFactory', ['$modal', '$modalStack', function ($modal, $modalStack) {
        return {
            open: function (modalObject) {
                $modal.open({
                    backdrop: 'static',
                    dialogFade: false,
                    controller: 'columnOptionsController as columnOptionsCtrl',
                    templateUrl: 'angular/common/columnoptions/columnoptions.html',
                    windowClass: 'column-options',
                    resolve: {
                        modalObject: function () {
                            return modalObject
                        }
                    }
                });
            },
            close: function (reason) {
                $modalStack.dismissAll('close');
            }
        };
    }]);

})();