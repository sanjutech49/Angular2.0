var loancenter;
(function (loancenter) {
    'use strict';
    var loanParticipantsService = (function () {
        function loanParticipantsService($resource, apiRoot) {
            this.$resource = $resource;
            this.apiRoot = apiRoot;
            this.$inject = ['$resource', 'api'];
        }
        loanParticipantsService.prototype.getEmptyContact = function () {
            this.proxy = this.$resource(this.apiRoot + 'LoanParticipantsService/GetEmptyCompanyContact', {}, {
                GetEmptyContact: { method: 'GET' }
            });
            return this.proxy.GetEmptyContact().$promise;
        };
        loanParticipantsService.Factory = function () {
            var service = function ($resource, api) {
                return new loanParticipantsService($resource, api);
            };
            service['$inject'] = ['$resource', 'api'];
            return service;
        };
        return loanParticipantsService;
    })();
    loancenter.loanParticipantsService = loanParticipantsService;
    angular.module('loanCenter').service('loanParticipantsService', loancenter.loanParticipantsService);
})(loancenter || (loancenter = {}));
//# sourceMappingURL=loanparticipants.service.js.map