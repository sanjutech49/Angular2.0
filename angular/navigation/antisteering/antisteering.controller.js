(function () {
    'use strict';

    angular.module('loanCenter').controller('antiSteeringController', antiSteeringController);

    antiSteeringController.$inject = ['$modalStack', 'amortizationType', 'antiSteeringOptions', 'optionsCompletedCallBack', 'submitForApprovalCallBack'];

    function antiSteeringController($modalStack, amortizationType, antiSteeringOptions, optionsCompletedCallBack, submitForApprovalCallBack) {

        var vm = this;
        vm.amortizationType = amortizationType;
        vm.antiSteeringOptions = antiSteeringOptions;
       
        vm.optionsCompletedCallBack = optionsCompletedCallBack;
        vm.submitForApprovalCallBack = submitForApprovalCallBack;
        vm.cancel = cancel;
        vm.done = done;
        vm.isDoneDisabled = isDoneDisabled;
        vm.initialize = initialize();

        function cancel() {
            $modalStack.dismissAll('cancel');
        }

        function initialize() {
            vm.amortizationTypeText = vm.amortizationType == 1 ? 'Fixed Rate Loan Options' : 'Adjustable Rate Loan Options';
            vm.model = angular.copy(vm.antiSteeringOptions);
        }

        function done() {
            angular.extend(vm.antiSteeringOptions, vm.model);
            $modalStack.dismissAll('cancel');
            if (vm.submitForApprovalCallBack)
                vm.submitForApprovalCallBack();
        }

        function isDoneDisabled() {
            return !vm.optionsCompletedCallBack(vm.model);
        }

    }
})();
