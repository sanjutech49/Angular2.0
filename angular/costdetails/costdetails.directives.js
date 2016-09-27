(function () {
    'use strict';

    angular.module('loanCenter').directive('cashToCloseValueChanged', function () {
        return {
            restrict: 'AE',
            scope: {
                loanEstimate: '=',
                finalValue: '=',
                isDisclosureAvailable: '='
            },
            controller: controller,
            controllerAs: 'ctrl',
            bindToController: true,
            template: '<div class="{{ctrl.getTextClass()}}"><span>{{ctrl.getText()}}</span></div>',
            replace: true
        };

        function controller() {
            var vm = this;
            vm.getText = getText;
            vm.getTextClass = getTextClass;

            function isChanged() {
                return parseFloat(vm.loanEstimate) !== parseFloat(vm.finalValue) && vm.isDisclosureAvailable;
            }
            function getText() {
                return isChanged() ? 'Yes' : 'No';
            }
            function getTextClass() {
                return isChanged() ? 'col-a' : 'col-a values-changed';
            }
        }

       
    });
})();