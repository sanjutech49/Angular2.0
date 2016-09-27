((): void => {
    'use strict';

    angular.module('stipsandconditions').config(config);

    config.$inject = [ '$stateProvider' ];
    function config($stateProvider: any): void {
        
              /*Stips and conditions state*/
        $stateProvider.state('loanCenter.loan.stipsandconditions', {
                url: 'stipsandconditions',
                views: {
                    'contextualDetailsBar': {
                        templateUrl: '/angular/contextualbar/details/contextualbardetails.html',
                        controller: 'ContextualBarDetailsCtrl as conBarCtrl'
                    },
                    'stipsandconditions': {
                        templateUrl: '/angular/stipsandconditions/stipsandconditions.html',
                        controller: 'ConditionsController as conditionsCtrl'
                    }
                },
                resolve: {
                    stipsConditionsViewModel: resolveConditionsViewModel
                },

            })

        resolveConditionsViewModel.$inject = ['$rootScope', 'conditionsSvc'];
        function resolveConditionsViewModel($rootScope, conditionsSvc) {
            var userAccountId = $rootScope.SelectedLoan.UserAccountId;
            var loanId = $rootScope.SelectedLoan.LoanId;
            return conditionsSvc.getData(loanId, userAccountId);
        }
    }

   
})();