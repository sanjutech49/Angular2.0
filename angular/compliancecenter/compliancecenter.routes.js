(function () {
    'use strict';
    angular.module('compliancecenter').config(config);
    config.$inject = ['$stateProvider'];
    function config($stateProvider) {
        $stateProvider.state('loanCenter.loan.compliancecenter', {
            url: '/compliancecenter',
            views: {
                'compliancecenter': {
                    templateUrl: '/angular/compliancecenter/compliancecenter.html',
                    controller: 'compliancecenterController as compliancecenterCtrl'
                }
            },
            params: {
                autoActivateChild: 'loanCenter.loan.compliancecenter.auditlog'
            }
        });
    }
})();
//# sourceMappingURL=compliancecenter.routes.js.map