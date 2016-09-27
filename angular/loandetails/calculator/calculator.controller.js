(function () {
    'use strict';
    angular.module('loanDetails')
        .controller('calculatorController', calculatorController);

    function calculatorController($log, $modalInstance, calculatorSvc) {

        var vm = this;

        vm.cancel = Cancel;
        vm.save = Save;
        vm.saveclose = SaveAndClose;
        vm.CalculatorViewModel = {};

        init();

        function init() {
            calculatorSvc.GetImpounds({ loanId: $scope.selectedLoanId }).$promise.then(
                function (data) {
                    console.log("Retrieved data" + data);
                    vm.CalculatorViewModel = data;
                },
                function (error) {
                    $log.error('Failure loading Impounds Calculator data', error);
                });
        };

        function Cancel() {
            console.log("Cancel");
            $modalInstance.dismiss('cancel');
        };

        function Save() {
            console.log("Save");
        };

        function SaveAndClose() {
            console.log("Save & Close");
            $modalInstance.dismiss('cancel');
        };
    };

})();

