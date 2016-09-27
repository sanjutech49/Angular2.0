(function () {
    'use strict';
    angular.module('aus')
        .service('ausSvc', ausSvc);

    ausSvc.$inject = ['apiRoot', '$resource'];

    function ausSvc(apiRoot, $resource) {
        var ausApiPath = apiRoot + 'Aus/';

        var services = $resource(ausApiPath + ':path', { path: '@path' }, {
            get: { method: 'GET', params: { loanId: 'loanId' } },
            post: { method: 'POST', params: { caseId: 'caseId', identifier: 'identifier', ausType: 'ausType', userAccountId: 'userAccountId' } },
        });

        var ausService =
        {
            services: services
        };

        return ausService;
    };
})();


