/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />
(function () {
    'use strict';
    angular.module('complianceEase').config(config);
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider.state('loanCenter.loan.complianceEase', {
            url: '/complianceEase',
            views: {
                'complianceEase': {
                    templateUrl: '/angular/complianceease/complianceease.html',
                    controller: 'complianceEaseController as complianceEaseCtrl'
                },
                'contextualBar@': {
                    templateUrl: '/angular/contextualbar/contextualbar.html',
                    controller: 'ContextualBarCtrl as contextualBarCtrl'
                }
            },
            resolve: {
                complianceData: function (complianceEaseService, wrappedLoan, applicationData, $log) {
                    return complianceEaseService.getComplianceData(wrappedLoan.ref.loanId, applicationData.currentUser.userAccountId).$promise.then(function (success) {
                        return success.response;
                    }, function (error) {
                        $log.error("Error occurred while getting Complience Ease data!", error);
                    });
                }
            },
            onExit: function (complianceEaseService, $interval) {
                $interval.cancel(complianceEaseService.interval);
            }
        });
    }
})();
//# sourceMappingURL=complianceease.routes.js.map