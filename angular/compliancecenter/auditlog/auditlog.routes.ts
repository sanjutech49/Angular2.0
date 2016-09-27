((): void => {
    'use strict';

    angular.module('compliancecenter').config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider: any): void {


        $stateProvider.state('loanCenter.loan.compliancecenter.auditlog', {
            url: '/auditlog',
            views: {
                'compliancecenter': {
                    templateUrl: '/angular/compliancecenter/auditlog/auditlog.html',
                    controller: 'auditlogController as auditlogCtrl'
                }
            },
            resolve: {
                auditLogViewModel: resolveAuditLogViewModel
            },
        })

        resolveAuditLogViewModel.$inject = ['$rootScope', 'auditLogSvc'];
        function resolveAuditLogViewModel($rootScope, auditLogSvc) {
            var userAccountId = $rootScope.SelectedLoan.UserAccountId;
            var loanId = $rootScope.SelectedLoan.LoanId;
            return auditLogSvc.getData(loanId, userAccountId);
        }
    }
})();

