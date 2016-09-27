((): void => {
    'use strict';

    angular.module('compliancecenter').config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider: any): void {
        $stateProvider
            .state('loanCenter.loan.compliancecenter', {
            url: '/compliancecenter',
            views: {
                'compliancecenter': {
                    templateUrl: '/angular/compliancecenter/compliancecenter.html',
                    controller: 'compliancecenterController as compliancecenterCtrl'
                }
            },
            params: {
                autoActivateChild: 'loanCenter.loan.compliancecenter.auditlog'
            }
        })
    }
})();

