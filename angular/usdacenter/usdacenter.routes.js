/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />
/// <reference path="usdacenter.module.ts" />
(function () {
    'use strict';
    angular.module('usdaCenter').config(config);
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider.state('loanCenter.loan.usdacenter', {
            url: '/usdacenter',
            views: {
                'usdacenter': {
                    templateUrl: '/angular/usdacenter/usdacenter.html',
                    controller: 'usdaCenterController as usdaCenter'
                },
                'contextualBar@': {
                    templateUrl: '/angular/contextualbar/contextualbar.html',
                    controller: 'ContextualBarCtrl as contextualBarCtrl'
                }
            }
        });
    }
})();
//# sourceMappingURL=usdacenter.routes.js.map