/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />
(function () {
    'use strict';
    angular.module('vaCenter').config(config);
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider.state('loanCenter.loan.vacenter', {
            url: '/vacenter',
            views: {
                'vaCenter': {
                    templateUrl: '/angular/vacenter/vacenter.html',
                    controller: 'vaCenterController as vaCenter'
                },
                'contextualBar@': {
                    templateUrl: '/angular/contextualbar/contextualbar.html',
                    controller: 'ContextualBarCtrl as contextualBarCtrl'
                }
            }
        }).state('loanCenter.loan.vacenter.generalinformation', {
            views: {
                'mainContainer': {
                    templateUrl: '/angular/vacenter/generalinformation/generalinformation.html',
                    controller: 'generalInformationController as generalInformation'
                }
            }
        }).state('loanCenter.loan.vacenter.irrlmax', {
            views: {
                'mainContainer': {
                    templateUrl: '/angular/vacenter/irrlmax/irrlmax.html',
                    controller: 'irrlMaxController as irrlMax'
                }
            }
        }).state('loanCenter.loan.vacenter.irrlqmcertification', {
            views: {
                'mainContainer': {
                    templateUrl: '/angular/vacenter/irrlqmcertification/irrlqmcertification.html',
                    controller: 'irrlQMCertificationController as irrlQMCertification'
                }
            }
        });
    }
})();
//# sourceMappingURL=vacenter.routes.js.map