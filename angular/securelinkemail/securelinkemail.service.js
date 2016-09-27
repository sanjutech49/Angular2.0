var secureLinkEmail;
(function (secureLinkEmail) {
    var service;
    (function (service) {
        'use strict';
        var SecureLinkEmailService = (function () {
            function SecureLinkEmailService($resource, apiRoot) {
                this.$resource = $resource;
                this.apiRoot = apiRoot;
                var apiPath = this.apiRoot + 'secureLink/';
                this.secureLinkEmailTemplates = this.$resource(apiPath + 'GetSecureLinkEmailTemplates', {}, {
                    getTemplates: {
                        method: 'GET',
                        url: apiPath + 'GetSecureLinkEmailTemplates',
                        params: { LoanId: '@LoanId', LoanApplicationId: '@LoanApplicationId' },
                        isArray: true
                    }
                });
                this.secureLinkEmailSend = this.$resource(apiPath + 'SendSecureLinkEmail', {}, {
                    sendEmail: {
                        method: 'POST',
                        url: apiPath + 'SendSecureLinkEmail',
                        params: {}
                    }
                });
                this.secureLinkUrl = this.$resource(apiPath + 'GetSecureLinkUrlToken', {}, {
                    getSecureLinkUrl: {
                        method: 'GET',
                        url: apiPath + 'GetSecureLinkUrlToken',
                        params: {}
                    }
                });
            }
            SecureLinkEmailService.$inject = ['$resource', 'apiRoot'];
            SecureLinkEmailService.className = 'secureLinkEmailService';
            return SecureLinkEmailService;
        })();
        service.SecureLinkEmailService = SecureLinkEmailService;
        angular.module('loanCenter').service('secureLinkEmailService', SecureLinkEmailService);
    })(service = secureLinkEmail.service || (secureLinkEmail.service = {}));
})(secureLinkEmail || (secureLinkEmail = {}));
//# sourceMappingURL=securelinkemail.service.js.map