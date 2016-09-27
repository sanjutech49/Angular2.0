/// <reference path="../../scripts/typings/angularjs/angular.d.ts" />
/// <reference path="../../scripts/typings/ui-router/angular-ui-router.d.ts" />
/// <reference path="integrations.module.ts" />
(function () {
    'use strict';
    angular.module('integrations').config(config);
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider.state('loanCenter.loan.integrations', {
            url: '/integrations',
            views: {
                'integrations': {
                    templateUrl: '/angular/integrations/integrations.html',
                    controller: 'integrationsController as integrationsCtrl'
                },
                'contextualBar@': {
                    templateUrl: '/angular/contextualbar/contextualbar.html',
                    controller: 'ContextualBarCtrl as contextualBarCtrl'
                }
            }
        });
    }
})();
//# sourceMappingURL=integrations.routes.js.map