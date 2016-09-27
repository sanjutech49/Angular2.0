/// <reference path="mailroom.module.ts" />
((): void => {
    'use strict';

    angular.module('mailroom').config(config);

    config.$inject = ['$stateProvider'];
    function config($stateProvider: any): void {
        $stateProvider
            .state('loanCenter.workbench', {
                'abstract': true,
                url: 'workbench',
                views: {
                    'workbench': {
                        templateUrl: '/angular/mailroom/_blank.html'
                    },
                    'contextualBar': {
                        templateUrl: '/angular/contextualbar/contextualbar.html',
                        controller: 'ContextualBarCtrl as contextualBarCtrl'
                    },                   
                },  
                params: {
                loanId: null,
                parentLoanId: null
                }, 
                resolve: {
                    wrappedLoan: function (mailroomResolver, docVaultResolver, docVaultSvc, loanService, $stateParams, HttpUIStatusService, BroadcastSvc, applicationData, $filter, $q) {
                        var d = $q.defer();
                        mailroomResolver(docVaultResolver, docVaultSvc, loanService, $stateParams, HttpUIStatusService, BroadcastSvc, applicationData, $filter, $q).then(
                            function (data) {
                                d.resolve(data);
                            });
                        return d.promise;
                    }
                }
            })
            .state('loanCenter.workbench.mailroom', {
                url: '/mailroom',
                views: {
                    'mailroom': {
                        templateUrl: '/angular/mailroom/mailroom.html',
                        controller: 'mailroomController as mailroomCtrl'
                    }
                },
                params: {
                    loanId: null,
                    loanPurposeType: null,
                    disclosureDueDate: null
                },   
            })
    }
})();

