(function () {
    'use strict';

    // directive for loading incomeinformation, regular or military
    angular.module('iMP.Directives').directive('impTemplateControl', templateControl);

    templateControl.$inject = [];

    function templateControl() {
        //  Usage:
        //  <imp-template-control ng-model=""    
        //  additional-model=""
        //  template-url=""></imp-template-control>

        var directive = {
            scope: {
                'ngModel': '=',
                'additionalModel': '=',
                'templateUrl': '=',
            },
            controller: controller,
            controllerAs: 'templateControlCtrl',
            bindToController: true,
            restrict: 'E',
            template: '<ng-include src="templateControlCtrl.getTemplateUrl()"/>'
        };

        return directive;

        function controller() {
            var vm = this;
            vm.getTemplateUrl = getTemplateUrl;

            function getTemplateUrl() {
                return vm.templateUrl;
            }
        }
    }
})();
