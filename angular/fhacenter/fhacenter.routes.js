/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />
(function () {
    'use strict';
    angular.module('fhaCenter').config(config);
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider.state('loanCenter.loan.fhacenter', {
            url: '/fhacenter',
            views: {
                'fhaCenter': {
                    templateUrl: '/angular/fhacenter/fhacenter.html',
                    controller: 'fhaCenterController as fhaCenter'
                },
                'contextualBar@': {
                    templateUrl: '/angular/contextualbar/contextualbar.html',
                    controller: 'ContextualBarCtrl as contextualBarCtrl'
                }
            }
        }).state('loanCenter.loan.fhacenter.simplerefinance', {
            views: {
                'calculator': {
                    templateUrl: '/angular/fhacenter/simplerefinance/simplerefinance.html',
                    controller: 'simpleRefinanceController as simpleRefi'
                }
            }
        }).state('loanCenter.loan.fhacenter.streamlinerefinance', {
            views: {
                'calculator': {
                    templateUrl: '/angular/fhacenter/streamlinerefinance/streamlinerefinance.html',
                    controller: 'streamlineRefinanceController as streamlineRefi'
                }
            }
        }).state('loanCenter.loan.fhacenter.rateandtermrefinance', {
            views: {
                'calculator': {
                    templateUrl: '/angular/fhacenter/rateandtermrefinance/rateandtermrefinance.html',
                    controller: 'rateAndTermRefinanceController as rateAndTermRefi'
                }
            }
        }).state('loanCenter.loan.fhacenter.cashoutrefinance', {
            views: {
                'calculator': {
                    templateUrl: '/angular/fhacenter/cashoutrefinance/cashoutrefinance.html',
                    controller: 'cashOutController as cashOutRefi'
                }
            }
        }).state('loanCenter.loan.fhacenter.purchase', {
            views: {
                'calculator': {
                    templateUrl: '/angular/fhacenter/purchase/purchase.html',
                    controller: 'purchaseController as purchase'
                }
            }
        }).state('loanCenter.loan.fhacenter.purchasedown', {
            views: {
                'calculator': {
                    templateUrl: '/angular/fhacenter/purchasedown/purchasedown.html',
                    controller: 'purchaseDownController as purchaseDown'
                }
            }
        });
    }
})();
//# sourceMappingURL=fhacenter.routes.js.map