var integrationsServices;
(function (integrationsServices) {
    var service;
    (function (service) {
        'use strict';
        var IntegrationsService = (function () {
            function IntegrationsService(apiRoot, $resource) {
                var _this = this;
                this.apiRoot = apiRoot;
                this.$resource = $resource;
                /*
                 * @desc: Gets Integration Data
                */
                this.getIntegrationData = function (loanId, userAccountId) {
                    return _this.$resource(_this.apiPath, { loanId: loanId, userAccountId: userAccountId }).get();
                };
                this.apiPath = apiRoot + "Integrations/";
            }
            IntegrationsService.className = 'integrationsService';
            IntegrationsService.$inject = ['apiRoot', '$resource'];
            return IntegrationsService;
        })();
        service.IntegrationsService = IntegrationsService;
        angular.module('integrations').service('integrationsService', IntegrationsService);
    })(service = integrationsServices.service || (integrationsServices.service = {}));
})(integrationsServices || (integrationsServices = {}));
//# sourceMappingURL=integrations.service.js.map