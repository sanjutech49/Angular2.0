module compliancecenter {
    export class compliancecenterController {

        public static $inject = ['$state', '$rootScope', 'NavigationSvc', 'enums', 'wrappedLoan'];

        constructor(private $state, private $rootScope, private NavigationSvc, private enums, private wrappedLoan ) {

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

        
    }

    angular.module('compliancecenter').controller('compliancecenterController', compliancecenterController);
}
