(function () {
    'use strict';

    angular.module('loanCenter.core', [
        /*
        * Angular modules
        */
        'ngResource',
        /*
        * Our reusable cross app code modules
        */
        'iMP.Filters', 'iMP.Directives', 'common', 'inputDirectives', 'impButtonDirectives',
        /*
        * Defaul Rest Providers
        */
        'app.services',
        /*
        * 3rd Party modules
        */
        'ui.bootstrap', 'ui.utils',
        /*
        * ui-router module   
        */
        'ui.router',
        /*
        * calculator module
        */
        'CalculatorModule'
    ]);
})();
