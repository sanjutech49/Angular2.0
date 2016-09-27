(function () {
    'use strict';

    angular.module('loanCenter').controller('toleranceModalController', toleranceModalController);

    toleranceModalController.$inject = ['$modalInstance', 'costDetailsSvc'];

    function toleranceModalController($modalInstance, costDetailsSvc) {
        var vm = this;      
        vm.selectedToleranceItems = {};
        vm.cancel = cancel;
        vm.getColorCode = getColorCode; 

        costDetailsSvc.getToleranceGroups().then(function (data) {
            vm.toleranceGroups = data;
        },
        function (errorMsg) {
            console.log('Error:' + JSON.stringify(errorMsg));
        });

        costDetailsSvc.getActiveToleranceGroup().then(function (data) {
            vm.selectedToleranceId = vm.activeToleranceId = data.disclosureDetailsId;
            vm.selectedToleranceItems = costDetailsSvc.selectedToleranceItems;
        }, function (errorMsg) {
            console.log('Error:' + JSON.stringify(errorMsg));
        });

        function cancel() {
            $modalInstance.dismiss('cancel');
        };

        function getColorCode(value) {
            return (parseFloat(value) > 0) ? 'alert-red' : 'primary-green';
        }
    };
})();