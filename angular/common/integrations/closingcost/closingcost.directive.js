/// <reference path="../../../../scripts/typings/ui-router/angular-ui-router.d.ts" />
/// <reference path="../../../../scripts/typings/angularjs/angular.d.ts" />
angular.module('common').directive('impClosingCostRedirection', function ($state, $timeout) {
    return {
        restrict: 'E',
        replace: true,
        scope: {},
        bindToController: true,
        link: function (scope, el, attrs, controller) {
            var frm = el[0];
            $timeout(function () {
                frm.action = controller.postUrl;
                frm.submit();
                $state.go('loanCenter.loan.cost.details');
            });
        },
        controller: function ($scope, $element, $stateParams, $state) {
            this.apiKey = $stateParams.apiKey;
            this.token = $stateParams.token;
            this.smartGFEId = $stateParams.smartGFEId;
            this.postUrl = $stateParams.postUrl;
            this.customData = $stateParams.customData;
        },
        controllerAs: 'vm',
        templateUrl: 'angular/common/integrations/closingcost/closingcostredirection.html'
    };
});
//# sourceMappingURL=closingcost.directive.js.map