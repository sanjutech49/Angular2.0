var compliancecenter;
(function (compliancecenter) {
    var compliancecenterController = (function () {
        function compliancecenterController($state, $rootScope, NavigationSvc, enums, wrappedLoan) {
            this.$state = $state;
            this.$rootScope = $rootScope;
            this.NavigationSvc = NavigationSvc;
            this.enums = enums;
            this.wrappedLoan = wrappedLoan;
            NavigationSvc.contextualType = enums.ContextualTypes.ComplianceCenter;
            var vm = this;
            vm.wrappedLoan = wrappedLoan;
            $state.go('loanCenter.loan.compliancecenter.auditlog');
            $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams, fromState, fromParams) {
                if (toState && toState.params && toState.params.autoActivateChild) {
                    $state.go(toState.params.autoActivateChild);
                }
            });
        }
        compliancecenterController.$inject = ['$state', '$rootScope', 'NavigationSvc', 'enums', 'wrappedLoan'];
        return compliancecenterController;
    })();
    compliancecenter.compliancecenterController = compliancecenterController;
    angular.module('compliancecenter').controller('compliancecenterController', compliancecenterController);
})(compliancecenter || (compliancecenter = {}));
//# sourceMappingURL=compliancecenter.controller.js.map