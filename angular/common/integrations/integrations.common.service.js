(function () {
    'use strict';
    angular.module('integrations.common')
        .service('commonintegrationsSvc', commonintegrationsSvc);

    commonintegrationsSvc.$inject = ['$resource', 'apiRoot', '$http'];

    function commonintegrationsSvc($resource, apiRoot, $http) {
        //var commonIntegrationsApiPath = apiRoot + 'CommonIntegrations/';

        //function getLoanServiceStatus(loanServiceId) {
        //    return $http.get(commonIntegrationsApiPath + 'GetLoanServiceStatus', { params: { loanServiceId: loanServiceId } });
        //}

        //var services =
        //{
        //    getLoanServiceStatus: getLoanServiceStatus
        //}

        //return services;

        var commonIntegrationsApiPath = apiRoot + 'CommonIntegrations/';

        var services = $resource(commonIntegrationsApiPath + ':path', { path: '@path' }, {
            getLoanServiceStatus: { method: 'GET', params: { loanServiceId: 'loanServiceId' } },
            getClosingCorpSSOToken: { method: 'GET' }
        });

        //var token = $http.get(commonIntegrationsApiPath + 'GetClosingCorpSSOToken');

        var commonIntegrationsService =
        {
            services: services
            //getClosingCorpSSOToken: getClosingCorpSSOToken
        };

        return commonIntegrationsService;
    };
})();


