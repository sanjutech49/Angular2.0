(function () {
    'use strict';
    angular.module('common')
        .controller('modalInstanceController', function ($scope, $modalStack, message) {
            var vm = this;
            vm.message = message;
            vm.close = function () {
                $modalStack.dismissAll('close');
            }
        })
})();