(function () {
    'use strict';
    angular.module('preapprovalletters').config(config);
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider.state('loanCenter.loan.preapprovalletters', {
            url: '/preapprovalletters',
            views: {
                'preapprovalletters': {
                    templateUrl: '/angular/preapprovalletters/preapprovalletters.html',
                    controller: 'preapprovallettersController as preapprovallettersCtrl'
                }
            },
        });
    }
})();
//# sourceMappingURL=preapprovalletters.routes.js.map