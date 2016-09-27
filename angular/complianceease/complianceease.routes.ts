/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />

((): void => {
    'use strict';
    angular.module('complianceEase').config(config);

    config.$inject = ['$stateProvider'];

    function config($stateProvider: angular.ui.IStateProvider): void {
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
                complianceData: (complianceEaseService: complianceEase.service.IComplianceEaseService, wrappedLoan: lib.referenceWrapper<srv.ILoanViewModel>, applicationData: any, $log: ng.ILogService) => {
                    return complianceEaseService.getComplianceData(wrappedLoan.ref.loanId, applicationData.currentUser.userAccountId).$promise.then(
                        (success) => {
                            return success.response;
                        },
                        (error) => {
                            $log.error("Error occurred while getting Complience Ease data!", error);
                        });
                }
            },
            onExit: (complianceEaseService: complianceEase.service.IComplianceEaseService, $interval: ng.IIntervalService) => {
                $interval.cancel(complianceEaseService.interval);
            }
        })
    }
})();